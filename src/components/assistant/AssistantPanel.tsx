"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { readEvents, type Message } from "./protocol";

const STORAGE_KEY = "portfolio-assistant:v2";
const MAX_STORED = 24;

const SUGGESTIONS = [
  "What are his most recent projects?",
  "Tell me about BitMomo.",
  "Which projects involve blockchain?",
  "What has he built with AI?",
  "Which project best shows his system architecture skills?",
  "How can I contact him?",
];

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Message[]) : [];
    // Anything interrupted by a reload is shown as stopped rather than spinning forever.
    return Array.isArray(parsed)
      ? parsed.map((message) => (message.status === "pending" || message.status === "streaming" ? { ...message, status: "stopped" } : message))
      : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch {
    // Storage may be unavailable; the conversation still works for this view.
  }
}

/** Plain-text answer formatting: paragraphs and "- " lists. No HTML is ever injected. */
function MessageText({ text, streaming }: { text: string; streaming: boolean }) {
  const lines = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#+\s*/gm, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let paragraph: string[] = [];
  const flushList = () => {
    if (list.length) blocks.push(<ul key={`l${blocks.length}`} className="ml-4 list-[square] space-y-1 marker:text-subtle">{list.map((item, index) => <li key={index}>{item}</li>)}</ul>);
    list = [];
  };
  const flushParagraph = () => {
    if (paragraph.length) blocks.push(<p key={`p${blocks.length}`}>{paragraph.join(" ")}</p>);
    paragraph = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    const bullet = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return (
    <div className="space-y-3">
      {blocks.length ? blocks : null}
      {streaming && <span aria-hidden="true" className="caret ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] bg-fg" />}
    </div>
  );
}

function AssistantMessage({ message, onRetry }: { message: Message; onRetry: () => void }) {
  const streaming = message.status === "pending" || message.status === "streaming";
  return (
    <div className="space-y-4">
      <p className="label">Assistant</p>
      {message.status === "pending" && !message.text ? (
        <p className="flex items-center gap-2 text-muted">
          <span aria-hidden="true" className="caret inline-block size-2 bg-fg" />
          Searching the portfolio…
        </p>
      ) : (
        <MessageText text={message.text} streaming={message.status === "streaming"} />
      )}

      {message.status === "error" && (
        <button type="button" onClick={onRetry} className="min-h-10 border border-line-strong px-3 text-sm hover:bg-fg hover:text-bg">
          Try again
        </button>
      )}
      {message.status === "stopped" && <p className="text-sm text-subtle">Stopped.</p>}

      {!streaming && message.projects && message.projects.length > 0 && (
        <div>
          <p className="label mb-2">Related work</p>
          <ul className="divide-y divide-line border-y border-line">
            {message.projects.map((project) => (
              <li key={project.slug}>
                <Link href={project.href} className="group flex items-start justify-between gap-3 py-3">
                  <span>
                    <span className="block font-medium">{project.name}</span>
                    <span className="mt-0.5 block text-sm text-muted">{project.tagline}</span>
                  </span>
                  <span className="mt-1 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-subtle">{project.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!streaming && message.actions && message.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.actions.map((action) => {
            const external = action.href.startsWith("http");
            const className = "inline-flex min-h-10 items-center border border-line-strong px-3 text-sm transition-colors hover:bg-fg hover:text-bg";
            return external || action.href.startsWith("mailto:") ? (
              <a key={action.href} href={action.href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {action.label}
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : (
              <Link key={action.href} href={action.href} className={className}>
                {action.label}
              </Link>
            );
          })}
        </div>
      )}

      {!streaming && message.status === "done" && (
        <p className="text-xs text-subtle">
          {message.notice ?? (message.mode === "portfolio" ? "Answered directly from portfolio data." : "AI-generated from portfolio data — check the linked pages for detail.")}
          {message.sources && message.sources.length > 0 && (
            <>
              {" "}
              Sources:{" "}
              {message.sources.map((source, index) => (
                <Fragment key={source.id}>
                  {index > 0 && " · "}
                  {source.href && source.href.startsWith("/") ? (
                    <Link href={source.href} className="underline underline-offset-2 hover:text-fg">
                      {source.title}
                    </Link>
                  ) : (
                    source.title
                  )}
                </Fragment>
              ))}
            </>
          )}
        </p>
      )}
    </div>
  );
}

type PanelProps = {
  open: boolean;
  onClose: () => void;
  request: { prompt: string; id: number } | null;
  onRequestHandled: () => void;
};

export default function AssistantPanel({ open, onClose, request, onRequestHandled }: PanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const busyRef = useRef(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    messagesRef.current = messages;
    saveMessages(messages);
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  // Open/close the native modal dialog (focus trap, Escape and inert background come with it).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) document.documentElement.style.overflow = "";
  }, [open]);

  useEffect(() => () => {
    document.documentElement.style.overflow = "";
  }, []);

  const update = useCallback((id: string, change: (message: Message) => Message) => {
    setMessages((current) => current.map((message) => (message.id === id ? change(message) : message)));
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 800);
      if (!text || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setInput("");
      setAnnouncement("");

      const history = messagesRef.current
        .filter((message) => message.text && message.status !== "error" && message.status !== "pending")
        .slice(-8)
        .map((message) => ({ role: message.role, text: message.text.slice(0, 1_200) }));
      const stamp = `${Date.now()}`;
      const assistantId = `a-${stamp}`;
      setMessages((current) => [...current, { id: `u-${stamp}`, role: "user", text }, { id: assistantId, role: "assistant", text: "", status: "pending" }]);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          const data = (await response.json().catch(() => null)) as { error?: string } | null;
          const error = data?.error ?? "The assistant is unavailable right now. You can still browse the work pages or email Samuel.";
          update(assistantId, (message) => ({ ...message, status: "error", text: error }));
          setAnnouncement(error);
          return;
        }
        let answer = "";
        for await (const event of readEvents(response.body)) {
          if (event.type === "meta") {
            update(assistantId, (message) => ({ ...message, sources: event.sources, projects: event.projects, actions: event.actions }));
          } else if (event.type === "delta") {
            answer += event.text;
            update(assistantId, (message) => ({ ...message, status: "streaming", text: message.text + event.text }));
          } else if (event.type === "done") {
            update(assistantId, (message) => ({ ...message, status: "done", mode: event.mode, notice: event.notice }));
            setAnnouncement(`Answer: ${answer.slice(0, 600)}`);
          } else if (event.type === "error") {
            update(assistantId, (message) => ({ ...message, status: "error", text: message.text || event.message }));
            setAnnouncement(event.message);
          }
        }
        update(assistantId, (message) => (message.status === "streaming" || message.status === "pending" ? { ...message, status: "done" } : message));
      } catch {
        if (controller.signal.aborted) {
          update(assistantId, (message) => ({ ...message, status: "stopped" }));
        } else {
          const error = "The connection dropped before the answer finished. Please try again.";
          update(assistantId, (message) => ({ ...message, status: "error", text: message.text || error }));
          setAnnouncement(error);
        }
      } finally {
        busyRef.current = false;
        abortRef.current = null;
        setBusy(false);
      }
    },
    [update],
  );

  // A question passed from elsewhere on the site ("Ask about this project").
  useEffect(() => {
    if (!request) return;
    const timer = setTimeout(() => {
      onRequestHandled();
      void send(request.prompt);
    }, 0);
    return () => clearTimeout(timer);
  }, [request, onRequestHandled, send]);

  const stop = () => abortRef.current?.abort();

  const reset = () => {
    stop();
    setMessages([]);
    setAnnouncement("Conversation cleared.");
    inputRef.current?.focus();
  };

  const retry = (assistantId: string) => {
    const index = messages.findIndex((message) => message.id === assistantId);
    const question = index > 0 ? messages[index - 1] : undefined;
    if (!question || question.role !== "user") return;
    setMessages((current) => current.filter((message) => message.id !== assistantId && message.id !== question.id));
    setTimeout(() => void send(question.text), 0);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(input);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="assistant-title"
      aria-describedby="assistant-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="sheet fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none border-l border-line-strong bg-bg p-0 text-fg backdrop:bg-black/50 sm:w-[30rem]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id="assistant-title" className="font-semibold">
              Portfolio assistant
            </h2>
            <p id="assistant-description" className="mt-0.5 text-sm text-muted">
              Answers come only from Samuel&apos;s verified portfolio data.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button type="button" onClick={reset} className="min-h-10 px-2 text-sm text-muted hover:text-fg">
                New chat
              </button>
            )}
            <button type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center hover:opacity-60" aria-label="Close assistant">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={listRef} className="scroll-area flex-1 overflow-y-auto px-5 py-6" role="log" aria-label="Conversation" aria-busy={busy}>
          {messages.length === 0 ? (
            <div>
              <p className="text-lede">Ask about Samuel&apos;s projects, how they&apos;re built, his experience or how to reach him.</p>
              <p className="label mt-8 mb-3">Try asking</p>
              <ul className="divide-y divide-line border-y border-line">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button type="button" onClick={() => void send(suggestion)} className="group flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left">
                      <span>{suggestion}</span>
                      <span aria-hidden="true" className="arrow text-subtle">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="space-y-8">
              {messages.map((message) => (
                <li key={message.id}>
                  {message.role === "user" ? (
                    <div className="border-l-2 border-fg pl-4">
                      <p className="label mb-1">You</p>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  ) : (
                    <AssistantMessage message={message} onRetry={() => retry(message.id)} />
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>

        <form onSubmit={onSubmit} className="border-t border-line px-5 py-4">
          <label htmlFor="assistant-input" className="sr-only">
            Ask a question about Samuel&apos;s work
          </label>
          <div className="flex items-end gap-2 border border-line-strong focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-fg">
            <textarea
              id="assistant-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={800}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about projects, skills or experience…"
              className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-[0.95rem] outline-none placeholder:text-subtle [field-sizing:content]"
            />
            {busy ? (
              <button type="button" onClick={stop} className="m-1 inline-flex min-h-10 items-center border border-line-strong px-3 text-sm hover:bg-fg hover:text-bg">
                Stop
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} className="m-1 inline-flex min-h-10 items-center bg-fg px-4 text-sm font-medium text-bg disabled:opacity-30">
                Send
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-subtle">Enter to send · Shift+Enter for a new line · Esc to close. Questions go to Google Gemini to draft answers; this site does not store them.</p>
        </form>
      </div>
    </dialog>
  );
}
