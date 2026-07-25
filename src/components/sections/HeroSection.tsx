"use client";

import { useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import Typewriter from "@/components/effects/Typewriter";
import ResumeModal from "@/components/ResumeModal";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { useOptionalGamification } from "@/components/gamification/GamificationProvider";

type ChatAction = { label: string; href: string };
type RagSource = { sourceId: string; sourceTitle: string; kind: "profile" | "project" | "experience" | "education" | "award"; href?: string };
type ChatMessage = { id: string; role: "visitor" | "assistant"; text: string; actions?: ChatAction[]; sources?: RagSource[]; retrieval?: "local" | "semantic"; notice?: string };
type ChatHistoryItem = { role: "user" | "assistant"; text: string };

const suggestedQuestions = [
  "What makes NeuroBench distinctive?",
  "Summarize Samuel's AI engineering experience.",
  "How can I work with Samuel?",
];

async function callPortfolioAssistant(message: string, history: ChatHistoryItem[]) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data = await response.json().catch(() => null) as { response?: string; error?: string; actions?: ChatAction[]; sources?: RagSource[]; retrieval?: "local" | "semantic"; notice?: string } | null;
    if (!response.ok) return { text: data?.error || "The assistant is unavailable. Please try again shortly." };
    return { text: data?.response || "I could not prepare an answer. Please try another question.", actions: data?.actions, sources: data?.sources, retrieval: data?.retrieval, notice: data?.notice };
  } catch {
    return { text: "Connection error. Please try again or use the contact section below." };
  }
}

const HeroSection = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const gamification = useOptionalGamification();
  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const latestVisitor = [...messages].reverse().find((message) => message.role === "visitor");
  const formattedResponse = latestAssistant?.text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[-*]\s/gm, "• ")
    .trim();

  const ask = async (message: string) => {
    const question = message.trim();
    if (!question || isTyping) return;
    const history = messages.slice(-6).map((message) => ({
      role: message.role === "visitor" ? "user" as const : "assistant" as const,
      text: message.text,
    }));
    setChatInput("");
    setIsTyping(true);
    gamification?.addXP(20);
    setMessages((current) => [...current, { id: `${Date.now()}-visitor`, role: "visitor", text: question }]);
    const answer = await callPortfolioAssistant(question, history);
    const assistantMsgId = `${Date.now()}-assistant`;

    // Initialize assistant message with empty text for streaming effect
    setMessages((current) => [
      ...current,
      { id: assistantMsgId, role: "assistant", text: "", actions: answer.actions, sources: answer.sources, retrieval: answer.retrieval, notice: answer.notice },
    ]);

    const fullText = answer.text;
    let currentLen = 0;
    const chunkSize = 4;
    const interval = setInterval(() => {
      currentLen += chunkSize;
      if (currentLen >= fullText.length) {
        currentLen = fullText.length;
        clearInterval(interval);
        setIsTyping(false);
        inputRef.current?.focus();
      }
      setMessages((current) =>
        current.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, text: fullText.slice(0, currentLen) } : msg
        )
      );
    }, 15);
  };

  return (
    <>
      <section id="hero" tabIndex={-1} className="relative flex min-h-screen items-center justify-center py-24 text-center sm:py-28">
        <div className="container relative z-10 mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-center gap-2 font-mono text-sm text-green-600">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span>~/portfolio</span>
            </div>

            <h1 className="text-6xl font-bold leading-[0.95] tracking-tight text-[var(--retro-fg)] sm:text-7xl md:text-8xl">
              Samuel<span className="text-green-500">.</span>
            </h1>

            <div className="mx-auto mt-7 max-w-3xl text-xl text-[var(--retro-fg)]/60 sm:text-2xl">
              <Typewriter text={portfolioData.personal.tagline} delay={300} speed={40} />
            </div>

            <p className="mx-auto mt-8 max-w-xl font-mono text-base leading-relaxed text-[var(--retro-fg)]/50">
              {portfolioData.personal.bio}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#projects" className="bg-green-500 px-6 py-3 font-mono text-sm text-white transition-colors hover:bg-green-600">View Projects →</a>
              <button type="button" onClick={() => setIsResumeOpen(true)} className="border border-[var(--retro-border)] px-6 py-3 font-mono text-sm text-[var(--retro-fg)] transition-colors hover:border-green-500 hover:text-green-600">View Resume</button>
            </div>

            <div className="mx-auto mt-10 max-w-xl text-left">
              <div className="border border-[var(--retro-border)] bg-[color:color-mix(in_srgb,var(--retro-card-bg)_94%,transparent)] p-3 shadow-[0_16px_48px_-32px_var(--terminal-glow)] sm:p-4">
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--retro-border)] pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wide text-[var(--retro-fg)]">
                    <span className="size-2 rounded-full bg-[var(--terminal-green)] shadow-[0_0_10px_var(--terminal-glow)]" />
                    PORTFOLIO COPILOT
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--text-subtle)]">Grounded in portfolio evidence</span>
                </div>
              <form onSubmit={(event) => { event.preventDefault(); void ask(chatInput); }} className="relative">
                <div className="flex items-center gap-2 border border-[var(--retro-border)] bg-[var(--retro-bg)] px-3 py-2">
                  <span className="font-mono text-sm text-green-600" aria-hidden="true">&gt;</span>
                  <label className="sr-only" htmlFor="portfolio-question">Ask Samuel&apos;s portfolio assistant</label>
                  <input ref={inputRef} id="portfolio-question" type="text" value={chatInput} onChange={(event) => setChatInput(event.target.value)} maxLength={800} disabled={isTyping} aria-describedby="portfolio-assistant-hint" placeholder="Ask about projects, experience, or collaboration..." className="min-w-0 flex-1 bg-transparent font-mono text-sm text-[var(--retro-fg)] placeholder:text-[var(--retro-fg)]/30 outline-none" />
                  <button type="submit" disabled={isTyping || !chatInput.trim()} className="font-mono text-xs text-green-600 transition-colors hover:text-green-500 disabled:opacity-50">[SEND]</button>
                </div>
              </form>
              <p id="portfolio-assistant-hint" className="mt-2 font-mono text-[11px] leading-5 text-[var(--text-subtle)]">Answers are grounded in retrieved portfolio evidence. Follow-up questions retain the recent conversation.</p>

              {!latestAssistant && !isTyping && <div className="mt-3 flex flex-wrap gap-2" aria-label="Suggested questions">
                {suggestedQuestions.map((question) => <button key={question} type="button" onClick={() => void ask(question)} className="border border-[var(--retro-border)] px-2.5 py-1.5 text-left font-mono text-[11px] text-[var(--text-muted)] transition hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]">{question}</button>)}
              </div>}

              {(latestAssistant || isTyping) && <div aria-live="polite" aria-atomic="true" className="mt-2 border border-[var(--retro-border)] bg-[var(--retro-bg)] p-3 text-left">
                <div className="mb-1 flex items-center justify-between"><span className="font-mono text-xs text-green-600">$ response:</span>{messages.length > 0 && <button type="button" onClick={() => setMessages([])} className="font-mono text-[10px] text-[var(--retro-fg)]/40 hover:text-green-600">[CLEAR]</button>}</div>
                {latestVisitor && !isTyping && <p className="mb-2 truncate font-mono text-[11px] text-[var(--text-subtle)]">you &gt; {latestVisitor.text}</p>}
                <div className="max-h-64 overflow-y-auto pr-1 font-mono text-sm leading-6 text-[var(--retro-fg)]/80 whitespace-pre-wrap break-words">{isTyping ? <span className="animate-pulse">thinking...</span> : formattedResponse}</div>
                {latestAssistant?.notice && <p className="mt-2 font-mono text-xs text-[var(--retro-fg)]/40">{latestAssistant.notice}</p>}
                {latestAssistant?.sources && latestAssistant.sources.length > 0 && <div className="mt-3 border-t border-[var(--retro-border)] pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">{latestAssistant.retrieval === "semantic" ? "Semantic retrieved evidence" : "Retrieved evidence"}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {latestAssistant.sources.map((source) => source.href ? <a key={source.sourceId} href={source.href} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 border border-[var(--retro-border)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] transition hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"><span className="truncate">{source.sourceTitle}</span><ExternalLinkIcon className="h-3 w-3 shrink-0" /></a> : <span key={source.sourceId} className="max-w-full truncate border border-[var(--retro-border)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)]">{source.sourceTitle}</span>)}
                  </div>
                </div>}
                {latestAssistant?.actions && <div className="mt-3 flex flex-wrap gap-2">{latestAssistant.actions.map((action) => <a key={action.href} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="border border-[var(--retro-border)] px-2 py-1 font-mono text-xs text-green-600 transition hover:border-green-500">[{action.label} →]</a>)}</div>}
              </div>}
              </div>
            </div>

            <div className="mt-12 font-mono text-xs text-[var(--retro-fg)]/30">scroll ↓</div>
          </div>
        </div>
      </section>
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default HeroSection;
