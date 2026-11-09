export const MAX_CHAT_MESSAGE_LENGTH = 800;
export const MAX_CHAT_HISTORY_MESSAGES = 8;
export const MAX_CHAT_HISTORY_MESSAGE_LENGTH = 1_200;
export const MAX_BODY_BYTES = 16_384;

export type ChatHistoryItem = { role: "user" | "assistant"; text: string };

export type ChatValidationResult = { ok: true; message: string } | { ok: false; status: 400 | 413; error: string };

export type ChatHistoryValidationResult = { ok: true; history: ChatHistoryItem[] } | { ok: false; status: 400 | 413; error: string };

// Control characters other than tab/newline are never meaningful in a question.
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function normalize(text: string) {
  return text.replace(CONTROL_CHARACTERS, "").trim().replace(/\s+/g, " ");
}

export function validateChatMessage(value: unknown): ChatValidationResult {
  if (typeof value !== "string") {
    return { ok: false, status: 400, error: "Message must be a string." };
  }

  const message = normalize(value);

  if (!message) {
    return { ok: false, status: 400, error: "Message is required." };
  }

  if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
    return { ok: false, status: 413, error: `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.` };
  }

  return { ok: true, message };
}

export function validateChatHistory(value: unknown): ChatHistoryValidationResult {
  if (value === undefined) {
    return { ok: true, history: [] };
  }

  if (!Array.isArray(value)) {
    return { ok: false, status: 400, error: "Chat history must be a list." };
  }

  if (value.length > MAX_CHAT_HISTORY_MESSAGES) {
    return { ok: false, status: 413, error: `Chat history can include at most ${MAX_CHAT_HISTORY_MESSAGES} messages.` };
  }

  const history: ChatHistoryItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || !("role" in item) || !("text" in item)) {
      return { ok: false, status: 400, error: "Each chat history item needs a role and text." };
    }

    const { role, text } = item as { role?: unknown; text?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof text !== "string") {
      return { ok: false, status: 400, error: "Chat history contains an invalid message." };
    }

    const normalizedText = normalize(text);
    if (!normalizedText) {
      return { ok: false, status: 400, error: "Chat history cannot contain empty messages." };
    }
    if (normalizedText.length > MAX_CHAT_HISTORY_MESSAGE_LENGTH) {
      return { ok: false, status: 413, error: `Each chat history message must be ${MAX_CHAT_HISTORY_MESSAGE_LENGTH} characters or fewer.` };
    }

    history.push({ role, text: normalizedText });
  }

  return { ok: true, history };
}

/** Reads a request body as text, refusing to buffer more than `limit` bytes. */
export async function readBodyWithLimit(body: ReadableStream<Uint8Array> | null, limit = MAX_BODY_BYTES): Promise<{ ok: true; text: string } | { ok: false }> {
  if (!body) return { ok: true, text: "" };
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => undefined);
      return { ok: false };
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(merged) };
}
