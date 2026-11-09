import { NextRequest, NextResponse } from "next/server";
import { runChat, type ChatEvent } from "@/lib/assistant/chat";
import { getGeminiStream, getModelName } from "@/lib/assistant/provider";
import { positiveInteger, RateLimiter } from "@/lib/assistant/rate-limit";
import { readBodyWithLimit, validateChatHistory, validateChatMessage } from "@/lib/assistant/validation";
import { isSemanticRetrievalEnabled, semanticRetrieve } from "@/lib/assistant/vector-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const limiter = new RateLimiter(positiveInteger(process.env.CHAT_RATE_LIMIT_PER_MINUTE, 10), positiveInteger(process.env.CHAT_DAILY_LIMIT, 300));

function clientId(request: NextRequest) {
  // Vercel sets x-real-ip / x-forwarded-for at its edge; elsewhere these are best-effort.
  return request.headers.get("x-real-ip")?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
}

function jsonError(error: string, status: number, requestId: string, headers: Record<string, string> = {}) {
  return NextResponse.json({ error, requestId }, { status, headers: { "X-Request-Id": requestId, "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return jsonError("Cross-origin requests are not allowed.", 403, requestId);
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return jsonError("Cross-site requests are not allowed.", 403, requestId);

  if (!request.headers.get("content-type")?.includes("application/json")) return jsonError("Content-Type must be application/json.", 415, requestId);

  const body = await readBodyWithLimit(request.body);
  if (!body.ok) return jsonError("Request body is too large.", 413, requestId);

  let payload: { message?: unknown; history?: unknown } | null = null;
  try {
    payload = JSON.parse(body.text);
  } catch {
    return jsonError("Request body must be valid JSON.", 400, requestId);
  }

  const message = validateChatMessage(payload?.message);
  if (!message.ok) return jsonError(message.error, message.status, requestId);
  const history = validateChatHistory(payload?.history);
  if (!history.ok) return jsonError(history.error, history.status, requestId);

  const decision = limiter.check(clientId(request));
  const rateHeaders = {
    "X-RateLimit-Remaining": String(Math.max(0, decision.remaining)),
    "X-RateLimit-Reset": String(Math.ceil(decision.resetAt / 1000)),
  };
  if (!decision.allowed) {
    return jsonError("Too many questions in a short time. Please wait a minute and try again.", 429, requestId, {
      ...rateHeaders,
      "Retry-After": String(Math.max(1, Math.ceil((decision.resetAt - Date.now()) / 1000))),
    });
  }

  const dailyLimit = positiveInteger(process.env.CHAT_DAILY_LIMIT, 300);
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort(), { once: true });
  const encoder = new TextEncoder();

  const events = runChat(
    { message: message.message, history: history.history, requestId },
    {
      model: getGeminiStream(),
      semanticRetrieve: isSemanticRetrievalEnabled() ? semanticRetrieve : undefined,
      reserveModelCall: () => {
        if (limiter.dailyUsed >= dailyLimit) return false;
        limiter.consumeDailyBudget();
        return true;
      },
      signal: abort.signal,
      onMetrics: (metrics) => {
        // Operational telemetry only: never log the visitor's message or the answer.
        console.info(
          JSON.stringify({
            event: "assistant.request",
            requestId,
            model: metrics.mode === "model" ? getModelName() : undefined,
            ...metrics,
            messageChars: message.message.length,
            historyItems: history.history.length,
          }),
        );
      },
    },
  );

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const next = await events.next();
        if (next.done) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(`${JSON.stringify(next.value satisfies ChatEvent)}\n`));
      } catch (error) {
        console.error(JSON.stringify({ event: "assistant.stream_error", requestId, name: error instanceof Error ? error.name : "UnknownError" }));
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: "error", message: "Something went wrong while answering. Please try again." })}\n`));
        controller.close();
      }
    },
    async cancel() {
      abort.abort();
      await events.return(undefined);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Accel-Buffering": "no",
      "X-Request-Id": requestId,
      ...rateHeaders,
    },
  });
}

export function GET() {
  return NextResponse.json({ error: "Use POST." }, { status: 405, headers: { Allow: "POST" } });
}
