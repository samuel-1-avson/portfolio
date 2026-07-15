"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import Typewriter from "@/components/effects/Typewriter";
import ResumeModal from "@/components/ResumeModal";

const suggestedQuestions = ["Which projects show AI engineering?", "Summarize Samuel's Rust experience", "How can I contact Samuel?"];
type ChatAction = { label: string; href: string };
type ChatMessage = { id: string; role: "visitor" | "assistant"; text: string; actions?: ChatAction[]; notice?: string };

async function callPortfolioAssistant(message: string) {
  try {
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
    const data = await response.json().catch(() => null) as { response?: string; error?: string; actions?: ChatAction[]; notice?: string } | null;
    if (!response.ok) return { text: data?.error || "The assistant is unavailable. Please try again shortly." };
    return { text: data?.response || "I could not prepare an answer. Please try another question.", actions: data?.actions, notice: data?.notice };
  } catch { return { text: "Connection error. You can still reach Samuel through the contact links below." }; }
}

export default function HeroSection() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const ask = async (message: string) => {
    if (!message.trim() || isTyping) return;
    const question = message.trim();
    setChatInput(""); setIsTyping(true);
    setMessages((current) => [...current, { id: `${Date.now()}-visitor`, role: "visitor", text: question }]);
    const answer = await callPortfolioAssistant(question);
    setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: "assistant", ...answer }]);
    setIsTyping(false);
  };

  return <>
    <section id="hero" tabIndex={-1} className="relative flex min-h-screen items-center justify-center py-28 text-center sm:py-32">
      <div className="container relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 flex items-center justify-center gap-2 font-mono text-xs font-bold tracking-[0.15em] text-[var(--terminal-green)]"><span className="size-2 rounded-full bg-[var(--terminal-green)]" /> AVAILABLE FOR COLLABORATION</p>
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.05em] text-[var(--retro-fg)] sm:text-7xl md:text-8xl">Samuel Maxwell<br />Obeng Avornyoh<span className="text-[var(--terminal-green)]">.</span></h1>
          <div className="mx-auto mt-7 max-w-3xl text-lg font-medium leading-relaxed text-[var(--text-muted)] sm:text-xl"><Typewriter text={portfolioData.personal.tagline} delay={250} speed={25} /></div>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--text-muted)]">{portfolioData.personal.bio}</p>
          <p className="mt-4 font-mono text-xs text-[var(--text-subtle)]">Based in {portfolioData.personal.location} · Open to AI, platform, and systems work</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#projects" className="rounded-md bg-[var(--terminal-green)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">Explore selected work <span aria-hidden="true">→</span></a>
            <button type="button" onClick={() => setIsResumeOpen(true)} className="rounded-md border border-[var(--retro-border)] px-5 py-3 text-sm font-semibold text-[var(--retro-fg)] transition hover:bg-[var(--retro-hover)]">View résumé</button>
          </div>
          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-[var(--retro-border)] bg-[color:color-mix(in_srgb,var(--retro-card-bg)_88%,transparent)] p-4 text-left shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--retro-border)] pb-3"><p className="font-mono text-xs font-semibold text-[var(--terminal-green)]">PORTFOLIO ASSISTANT</p><button type="button" onClick={() => setMessages([])} disabled={messages.length === 0 || isTyping} className="font-mono text-[10px] text-[var(--text-subtle)] transition hover:text-[var(--retro-fg)] disabled:invisible">CLEAR</button></div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Ask about Samuel’s work, technical focus, or contact details.</p>
            <form onSubmit={(event) => { event.preventDefault(); void ask(chatInput); }} className="mt-4 flex gap-2">
              <label className="sr-only" htmlFor="portfolio-question">Ask the portfolio assistant</label>
              <input id="portfolio-question" value={chatInput} onChange={(event) => setChatInput(event.target.value)} maxLength={800} disabled={isTyping} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-md border border-[var(--retro-border)] bg-transparent px-3 py-2 text-sm text-[var(--retro-fg)] placeholder:text-[var(--text-subtle)]" />
              <button type="submit" disabled={isTyping || !chatInput.trim()} className="rounded-md bg-[var(--retro-fg)] px-4 py-2 font-mono text-xs font-bold text-[var(--retro-bg)] disabled:cursor-not-allowed disabled:opacity-50">{isTyping ? "THINKING" : "ASK"}</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">{suggestedQuestions.map((question) => <button key={question} type="button" disabled={isTyping} onClick={() => void ask(question)} className="rounded-full border border-[var(--retro-border)] px-3 py-1.5 text-left text-xs text-[var(--text-muted)] transition hover:border-[var(--terminal-green)] hover:text-[var(--retro-fg)]">{question}</button>)}</div>
            {(messages.length > 0 || isTyping) && <div aria-live="polite" aria-atomic="false" className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-md bg-[var(--retro-hover)] p-3 text-sm leading-6 text-[var(--retro-fg)]">
              {messages.map((message) => <div key={message.id} className={message.role === "visitor" ? "border-l-2 border-[var(--terminal-cyan)] pl-3 text-[var(--text-muted)]" : "border-l-2 border-[var(--terminal-green)] pl-3"}>
                <p className="font-mono text-[10px] font-bold tracking-wider text-[var(--text-subtle)]">{message.role === "visitor" ? "YOU" : "PORTFOLIO ASSISTANT"}</p>
                <p>{message.text}</p>
                {message.notice && <p className="mt-1 text-xs text-[var(--text-subtle)]">{message.notice}</p>}
                {message.actions && <div className="mt-2 flex flex-wrap gap-2">{message.actions.map((action) => <a key={action.href} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="rounded-full border border-[var(--retro-border)] bg-[var(--retro-card-bg)] px-3 py-1 text-xs font-medium text-[var(--retro-fg)] transition hover:border-[var(--terminal-green)]">{action.label} <span aria-hidden="true">→</span></a>)}</div>}
              </div>)}
              {isTyping && <p className="animate-pulse font-mono text-xs text-[var(--terminal-green)]">The portfolio assistant is preparing an answer…</p>}
            </div>}
          </div>
        </div>
      </div>
    </section>
    <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
  </>;
}
