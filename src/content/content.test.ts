import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { featuredProjects, formatDate, formatPeriod, getCategoryCounts, getLastActivity, getPrimaryLink, projects } from "./index.ts";
import { recognition } from "./profile.ts";
import { resumeProjects } from "./resume.ts";
import { validateContent } from "./validate.ts";

describe("portfolio content", () => {
  it("passes structural validation", () => {
    assert.deepEqual(validateContent(), []);
  });

  it("features the four priority projects plus NeuroBench, each with a case study", () => {
    assert.deepEqual(
      featuredProjects.map((project) => project.slug),
      ["bitmomo", "proxyhubb", "ciphervault", "creg", "neurobench"],
    );
    assert.ok(featuredProjects.every((project) => project.caseStudy));
  });

  it("never exposes source links for private repositories", () => {
    for (const project of projects.filter((item) => item.repository?.visibility === "private")) {
      assert.equal(project.links.some((link) => link.kind === "source"), false, project.slug);
    }
  });

  it("keeps unverified recognition out of the rendered set", () => {
    const unverified = recognition.filter((item) => !item.verified);
    assert.ok(unverified.length > 0, "unverified items are retained for owner confirmation");
    assert.ok(unverified.every((item) => item.links.length === 0));
  });

  it("only references real projects from the résumé", () => {
    const slugs = new Set(projects.map((project) => project.slug));
    for (const item of resumeProjects) assert.ok(slugs.has(item.slug), item.slug);
  });

  it("describes BitMomo honestly as a testnet system", () => {
    const bitmomo = projects.find((project) => project.slug === "bitmomo");
    assert.equal(bitmomo?.status, "testnet");
    assert.match(bitmomo?.summary ?? "", /testnet/);
  });

  it("formats dates and periods", () => {
    assert.equal(formatDate("2026-02"), "Feb 2026");
    assert.equal(formatDate("2026-11-09"), "9 Nov 2026");
    assert.equal(formatPeriod("2025-12", "2026-03"), "Dec 2025 – Mar 2026");
    assert.equal(formatPeriod("2026-02"), "Feb 2026 – Present");
    assert.equal(formatPeriod("2025-07", "2025-07"), "Jul 2025");
  });

  it("derives category counts and primary links", () => {
    const counts = getCategoryCounts();
    assert.ok(counts.find((item) => item.id === "blockchain")!.count >= 3);
    assert.equal(getPrimaryLink(projects.find((project) => project.slug === "ciphervault")!)?.kind, "live");
    assert.match(getLastActivity(projects[0]), /^\d{4}-\d{2}-\d{2}$/);
  });
});
