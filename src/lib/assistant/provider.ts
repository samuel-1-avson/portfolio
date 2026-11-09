// Gemini integration (server-only). Keys never leave the server: the browser
// only ever talks to /api/chat.
import { GoogleGenAI } from "@google/genai";

export type ModelUsage = { promptTokens?: number; outputTokens?: number };

export type ModelStream = (input: {
  systemInstruction: string;
  prompt: string;
  signal: AbortSignal;
  onUsage?: (usage: ModelUsage) => void;
}) => AsyncIterable<string>;

const DEFAULT_MODEL = "gemini-2.5-flash";

function resolveConfiguration() {
  const apiKey = process.env.VERTEX_AI_API_KEY || process.env.VERTEX_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const isDeveloperKey = Boolean(process.env.GEMINI_API_KEY && !process.env.VERTEX_AI_API_KEY && !process.env.VERTEX_API_KEY);
  const backend = process.env.GEMINI_BACKEND || (isDeveloperKey ? "developer" : "vertex");
  if (backend === "vertex-adc") return { backend, apiKey: undefined } as const;
  if (!apiKey) return null;
  return { backend, apiKey } as const;
}

export function getModelName() {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

export function isModelConfigured() {
  return resolveConfiguration() !== null;
}

function createClient() {
  const config = resolveConfiguration();
  if (!config) return null;
  const httpOptions = { timeout: 20_000, retryOptions: { attempts: 1 } };
  if (config.backend === "vertex-adc") {
    let credentials: { client_email: string; private_key: string } | undefined;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      } catch {
        console.error(JSON.stringify({ event: "assistant.config_error", reason: "GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON" }));
        return null;
      }
    }
    return new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_CLOUD_LOCATION || "global",
      googleAuthOptions: credentials ? { credentials } : undefined,
      httpOptions,
    });
  }
  if (config.backend === "vertex") return new GoogleGenAI({ vertexai: true, apiKey: config.apiKey, httpOptions });
  return new GoogleGenAI({ apiKey: config.apiKey, httpOptions });
}

function thinkingConfig(model: string) {
  const configured = Number.parseInt(process.env.GEMINI_THINKING_BUDGET ?? "", 10);
  if (Number.isSafeInteger(configured) && configured >= 0) return { thinkingBudget: configured };
  // Flash 2.5 thinks by default; a portfolio Q&A over supplied evidence does not need it and it delays the first token.
  return /2\.5-flash/.test(model) ? { thinkingBudget: 0 } : undefined;
}

/** Returns a streaming function, or null when no provider is configured. */
export function getGeminiStream(): ModelStream | null {
  if (!isModelConfigured()) return null;
  return async function* stream({ systemInstruction, prompt, signal, onUsage }) {
    const client = createClient();
    if (!client) throw new Error("Gemini client could not be created.");
    const model = getModelName();
    const thinking = thinkingConfig(model);
    const response = await client.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 450,
        abortSignal: signal,
        ...(thinking ? { thinkingConfig: thinking } : {}),
      },
    });
    for await (const chunk of response) {
      if (chunk.usageMetadata) {
        onUsage?.({ promptTokens: chunk.usageMetadata.promptTokenCount, outputTokens: chunk.usageMetadata.candidatesTokenCount });
      }
      const text = chunk.text;
      if (text) yield text;
    }
  };
}
