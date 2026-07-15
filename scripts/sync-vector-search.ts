import { GoogleAuth } from "google-auth-library";
import { portfolioKnowledgeBase } from "../src/lib/portfolio-rag.ts";

const [project, location = "us-central1", collection = "samuel-portfolio-rag"] = process.argv.slice(2);

if (!project) {
  throw new Error("Usage: npm run rag:sync -- <project-id> [location] [collection-id]");
}

const parent = `projects/${project}/locations/${location}/collections/${collection}`;
const endpoint = `https://vectorsearch.googleapis.com/v1/${parent}/dataObjects`;
const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
const accessToken = await auth.getAccessToken();

if (!accessToken) {
  throw new Error("Unable to obtain Application Default Credentials for Vector Search.");
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function request(url: string, method: "GET" | "POST" | "PATCH", body?: unknown) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(30_000),
    });

    if ((response.status !== 429 && response.status < 500) || attempt === 7) {
      return response;
    }

    const retryAfterSeconds = Number.parseFloat(response.headers.get("retry-after") ?? "");
    const delay = Number.isFinite(retryAfterSeconds)
      ? retryAfterSeconds * 1_000
      : Math.min(30_000, 4_000 * 2 ** attempt);
    console.log(`Vector Search is throttled; retrying ${method} in ${Math.ceil(delay / 1_000)} seconds.`);
    await wait(delay);
  }

  throw new Error("Vector Search retry loop unexpectedly completed.");
}

let created = 0;
let updated = 0;
let skipped = 0;

for (const [index, evidence] of portfolioKnowledgeBase.entries()) {
  const dataObjectId = `rag-${String(index + 1).padStart(3, "0")}`;
  const data = {
    content: evidence.text,
    source_id: evidence.sourceId,
    source_title: evidence.sourceTitle,
    kind: evidence.kind,
    ...(evidence.href ? { href: evidence.href } : {}),
  };
  const createResponse = await request(`${endpoint}?dataObjectId=${dataObjectId}`, "POST", { data });

  if (createResponse.ok) {
    created += 1;
    continue;
  }

  if (createResponse.status !== 409) {
    throw new Error(`Unable to create ${dataObjectId}: ${createResponse.status} ${await createResponse.text()}`);
  }

  const existingResponse = await request(`${endpoint}/${dataObjectId}`, "GET");
  if (!existingResponse.ok) {
    throw new Error(`Unable to inspect ${dataObjectId}: ${existingResponse.status} ${await existingResponse.text()}`);
  }

  const existing = await existingResponse.json() as { data?: Record<string, unknown> };
  if (JSON.stringify(existing.data) === JSON.stringify(data)) {
    skipped += 1;
    continue;
  }

  const updateResponse = await request(`${endpoint}/${dataObjectId}?updateMask=data`, "PATCH", { data });
  if (!updateResponse.ok) {
    throw new Error(`Unable to update ${dataObjectId}: ${updateResponse.status} ${await updateResponse.text()}`);
  }
  updated += 1;
}

console.log(`Vector Search sync complete: ${created} created, ${updated} updated, ${skipped} unchanged, ${portfolioKnowledgeBase.length} total.`);
