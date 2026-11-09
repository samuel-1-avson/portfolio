// Client-side view of the /api/chat NDJSON protocol (mirrors src/lib/assistant/chat.ts).
export type SourceRef = { id: string; title: string; kind: string; href?: string };
export type ProjectRef = { slug: string; name: string; tagline: string; status: string; href: string };
export type ChatAction = { label: string; href: string };

export type ServerEvent =
  | { type: "meta"; requestId: string; sources: SourceRef[]; projects: ProjectRef[]; actions: ChatAction[]; retrieval: "local" | "semantic" }
  | { type: "delta"; text: string }
  | { type: "done"; mode: "model" | "portfolio"; notice?: string }
  | { type: "error"; message: string };

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  status?: "pending" | "streaming" | "done" | "error" | "stopped";
  mode?: "model" | "portfolio";
  notice?: string;
  sources?: SourceRef[];
  projects?: ProjectRef[];
  actions?: ChatAction[];
};

/** Splits a streamed NDJSON body into parsed events. */
export async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<ServerEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) {
        try {
          yield JSON.parse(line) as ServerEvent;
        } catch {
          // Ignore a malformed line rather than abandoning the answer.
        }
      }
      newline = buffer.indexOf("\n");
    }
  }
  const rest = buffer.trim();
  if (rest) {
    try {
      yield JSON.parse(rest) as ServerEvent;
    } catch {
      // ignore
    }
  }
}
