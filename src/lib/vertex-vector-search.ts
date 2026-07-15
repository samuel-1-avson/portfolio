import { GoogleAuth } from "google-auth-library";
import type { EvidenceKind, RetrievedEvidence } from "./portfolio-rag";

type VectorSearchData = {
  content?: unknown;
  source_id?: unknown;
  source_title?: unknown;
  kind?: unknown;
  href?: unknown;
};

type VectorSearchResult = {
  dataObject?: { name?: unknown; data?: VectorSearchData };
  distance?: unknown;
};

type VectorSearchResponse = { results?: VectorSearchResult[] };

const scope = "https://www.googleapis.com/auth/cloud-platform";
const maxResults = 4;

function isEvidenceKind(value: unknown): value is EvidenceKind {
  return value === "profile" || value === "project" || value === "experience" || value === "education" || value === "award";
}

function getConfiguration() {
  const project = process.env.VERTEX_VECTOR_SEARCH_PROJECT?.trim();
  const collection = process.env.VERTEX_VECTOR_SEARCH_COLLECTION?.trim();
  if (process.env.RAG_BACKEND !== "vertex-vector" || !project || !collection) return null;

  return {
    project,
    collection,
    location: process.env.VERTEX_VECTOR_SEARCH_LOCATION?.trim() || "us-central1",
  };
}

function getGoogleAuth() {
  const serializedCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serializedCredentials) return new GoogleAuth({ scopes: [scope] });

  try {
    return new GoogleAuth({
      credentials: JSON.parse(serializedCredentials) as { client_email: string; private_key: string },
      scopes: [scope],
    });
  } catch {
    return null;
  }
}

function toEvidence(result: VectorSearchResult, index: number): RetrievedEvidence | null {
  const data = result.dataObject?.data;
  if (!data || typeof data.content !== "string" || typeof data.source_id !== "string" || typeof data.source_title !== "string" || !isEvidenceKind(data.kind)) {
    return null;
  }

  const name = typeof result.dataObject?.name === "string" ? result.dataObject.name : `semantic-${index + 1}`;
  return {
    id: name.split("/").pop() || `semantic-${index + 1}`,
    sourceId: data.source_id,
    sourceTitle: data.source_title,
    kind: data.kind,
    text: data.content,
    ...(typeof data.href === "string" && data.href ? { href: data.href } : {}),
    score: typeof result.distance === "number" && Number.isFinite(result.distance) ? result.distance : 0,
  };
}

export async function retrieveSemanticPortfolioEvidence(query: string, limit = maxResults): Promise<RetrievedEvidence[] | null> {
  const config = getConfiguration();
  const auth = getGoogleAuth();
  if (!config || !auth) return null;

  try {
    const accessToken = await auth.getAccessToken();
    if (!accessToken) return null;

    const parent = `projects/${config.project}/locations/${config.location}/collections/${config.collection}`;
    const response = await fetch(`https://vectorsearch.googleapis.com/v1/${parent}/dataObjects:search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        semanticSearch: {
          searchText: query,
          searchField: "embedding",
          taskType: "RETRIEVAL_QUERY",
          topK: Math.min(Math.max(limit, 1), maxResults),
          outputFields: { dataFields: ["content", "source_id", "source_title", "kind", "href"] },
        },
      }),
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) return null;

    const payload = await response.json() as VectorSearchResponse;
    const evidence = (payload.results ?? []).map(toEvidence).filter((item): item is RetrievedEvidence => item !== null);
    return evidence.length > 0 ? evidence : null;
  } catch {
    return null;
  }
}
