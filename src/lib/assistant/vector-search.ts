// Optional semantic retrieval with Vertex AI Vector Search 2.0. Enabled only
// when RAG_BACKEND=vertex-vector and the collection variables are set; any
// failure returns null so the caller falls back to local retrieval.
import { GoogleAuth } from "google-auth-library";
import type { EvidenceKind } from "./knowledge.ts";
import type { RetrievedDocument } from "./retrieval.ts";

type VectorSearchData = { content?: unknown; source_id?: unknown; source_title?: unknown; kind?: unknown; href?: unknown };
type VectorSearchResult = { dataObject?: { name?: unknown; data?: VectorSearchData }; distance?: unknown };

const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const MAX_RESULTS = 6;
const KINDS: EvidenceKind[] = ["profile", "project", "experience", "education", "skills", "recognition", "timeline"];

function getConfiguration() {
  const project = process.env.VERTEX_VECTOR_SEARCH_PROJECT?.trim();
  const collection = process.env.VERTEX_VECTOR_SEARCH_COLLECTION?.trim();
  if (process.env.RAG_BACKEND !== "vertex-vector" || !project || !collection) return null;
  return { project, collection, location: process.env.VERTEX_VECTOR_SEARCH_LOCATION?.trim() || "us-central1" };
}

let auth: GoogleAuth | null | undefined;
function getAuth() {
  if (auth !== undefined) return auth;
  const serialized = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  try {
    auth = new GoogleAuth({ scopes: [SCOPE], ...(serialized ? { credentials: JSON.parse(serialized) } : {}) });
  } catch {
    auth = null;
  }
  return auth;
}

function toDocument(result: VectorSearchResult, index: number): RetrievedDocument | null {
  const data = result.dataObject?.data;
  if (!data || typeof data.content !== "string" || typeof data.source_id !== "string" || typeof data.source_title !== "string") return null;
  if (!KINDS.includes(data.kind as EvidenceKind)) return null;
  const name = typeof result.dataObject?.name === "string" ? result.dataObject.name : `semantic-${index + 1}`;
  const projectSlug = data.source_id.startsWith("project:") ? data.source_id.slice("project:".length) : undefined;
  return {
    id: name.split("/").pop() || `semantic-${index + 1}`,
    sourceId: data.source_id,
    title: data.source_title,
    kind: data.kind as EvidenceKind,
    text: data.content,
    href: typeof data.href === "string" && data.href ? data.href : undefined,
    projectSlug,
    score: typeof result.distance === "number" && Number.isFinite(result.distance) ? result.distance : 0,
  };
}

export function isSemanticRetrievalEnabled() {
  return getConfiguration() !== null;
}

export async function semanticRetrieve(query: string): Promise<RetrievedDocument[] | null> {
  const config = getConfiguration();
  const client = getAuth();
  if (!config || !client) return null;
  try {
    const token = await client.getAccessToken();
    if (!token) return null;
    const parent = `projects/${config.project}/locations/${config.location}/collections/${config.collection}`;
    const response = await fetch(`https://vectorsearch.googleapis.com/v1/${parent}/dataObjects:search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        semanticSearch: {
          searchText: query,
          searchField: "embedding",
          taskType: "RETRIEVAL_QUERY",
          topK: MAX_RESULTS,
          outputFields: { dataFields: ["content", "source_id", "source_title", "kind", "href"] },
        },
      }),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) {
      console.warn(JSON.stringify({ event: "assistant.semantic_unavailable", status: response.status }));
      return null;
    }
    const payload = (await response.json()) as { results?: VectorSearchResult[] };
    const documents = (payload.results ?? []).map(toDocument).filter((item): item is RetrievedDocument => item !== null);
    return documents.length > 0 ? documents : null;
  } catch (error) {
    console.warn(JSON.stringify({ event: "assistant.semantic_failed", name: error instanceof Error ? error.name : "UnknownError" }));
    return null;
  }
}
