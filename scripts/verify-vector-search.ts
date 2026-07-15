import { retrieveSemanticPortfolioEvidence } from "../src/lib/vertex-vector-search.ts";

const query = process.argv.slice(2).join(" ") || "What makes NeuroBench distinctive?";
const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

if (!credentials) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is required to verify the hosted Vector Search identity.");
}

const serviceAccount = JSON.parse(credentials) as { client_email?: unknown };
const evidence = await retrieveSemanticPortfolioEvidence(query);

console.log(JSON.stringify({
  serviceAccount: typeof serviceAccount.client_email === "string" ? serviceAccount.client_email : "unknown",
  retrieval: evidence ? "semantic" : "unavailable",
  sources: evidence?.map((item) => item.sourceTitle) ?? [],
}));
