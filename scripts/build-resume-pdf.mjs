// Prints the HTML résumé (/resume) to public/resume.pdf with a locally
// installed Chromium browser, so the PDF and the web page share one source.
//
//   npm run build && npm run start          (in one terminal)
//   npm run resume:pdf [-- http://localhost:3000]
//
// Set CHROME_PATH to override browser discovery.
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const base = (process.argv[2] || process.env.RESUME_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const output = resolve("public/resume.pdf");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const browser = candidates.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error("No Chromium-based browser found. Set CHROME_PATH.");
  process.exit(1);
}

const response = await fetch(`${base}/resume`).catch(() => null);
if (!response?.ok) {
  console.error(`Could not load ${base}/resume — start the site first (npm run start).`);
  process.exit(1);
}

const result = spawnSync(
  browser,
  ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=5000", `--print-to-pdf=${output}`, `${base}/resume`],
  { stdio: "inherit" },
);

if (result.status !== 0 || !existsSync(output)) {
  console.error("PDF generation failed.");
  process.exit(1);
}
console.log(`Wrote ${output} (${Math.round(statSync(output).size / 1024)} KB) from ${base}/resume`);
