"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import Typewriter from "@/components/effects/Typewriter";
import ResumeModal from "@/components/ResumeModal";

type ChatAction = { label: string; href: string };
type ChatMessage = { id: string; role: "visitor" | "assistant"; text: string; actions?: ChatAction[]; notice?: string };

async function callPortfolioAssistant(message: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json().catch(() => null) as { response?: string; error?: string; actions?: ChatAction[]; notice?: string } | null;
    if (!response.ok) return { text: data?.error || "The assistant is unavailable. Please try again shortly." };
    return { text: data?.response || "I could not prepare an answer. Please try another question.", actions: data?.actions, notice: data?.notice };
  } catch {
    return { text: "Connection error. Please try again or use the contact section below." };
  }
}

const HeroSection = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const latestAssistant = [...messages].reverse().find((message) => message.role === "assistant");

  const ask = async (message: string) => {
    const question = message.trim();
    if (!question || isTyping) return;
    setChatInput("");
    setIsTyping(true);
    setMessages((current) => [...current, { id: `${Date.now()}-visitor`, role: "visitor", text: question }]);
    const answer = await callPortfolioAssistant(question);
    setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: "assistant", ...answer }]);
    setIsTyping(false);
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

            <div className="mx-auto mt-8 max-w-md">
              <form onSubmit={(event) => { event.preventDefault(); void ask(chatInput); }} className="relative">
                <div className="flex items-center gap-2 border border-[var(--retro-border)] bg-[var(--retro-bg)] px-3 py-2">
                  <span className="font-mono text-sm text-green-600" aria-hidden="true">&gt;</span>
                  <label className="sr-only" htmlFor="portfolio-question">Ask the portfolio assistant</label>
                  <input id="portfolio-question" type="text" value={chatInput} onChange={(event) => setChatInput(event.target.value)} maxLength={800} disabled={isTyping} placeholder="Ask me anything about Samuel..." className="min-w-0 flex-1 bg-transparent font-mono text-sm text-[var(--retro-fg)] placeholder:text-[var(--retro-fg)]/30 outline-none" />
                  <button type="submit" disabled={isTyping || !chatInput.trim()} className="font-mono text-xs text-green-600 transition-colors hover:text-green-500 disabled:opacity-50">[SEND]</button>
                </div>
              </form>

              {(latestAssistant || isTyping) && <div aria-live="polite" aria-atomic="true" className="mt-2 border border-[var(--retro-border)] bg-[var(--retro-bg)] p-3 text-left">
                <div className="mb-1 flex items-center justify-between"><span className="font-mono text-xs text-green-600">$ response:</span>{messages.length > 0 && <button type="button" onClick={() => setMessages([])} className="font-mono text-[10px] text-[var(--retro-fg)]/40 hover:text-green-600">[CLEAR]</button>}</div>
                <p className="font-mono text-sm leading-relaxed text-[var(--retro-fg)]/80">{isTyping ? <span className="animate-pulse">thinking...</span> : latestAssistant?.text}</p>
                {latestAssistant?.notice && <p className="mt-2 font-mono text-xs text-[var(--retro-fg)]/40">{latestAssistant.notice}</p>}
                {latestAssistant?.actions && <div className="mt-3 flex flex-wrap gap-2">{latestAssistant.actions.map((action) => <a key={action.href} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="border border-[var(--retro-border)] px-2 py-1 font-mono text-xs text-green-600 transition hover:border-green-500">[{action.label} →]</a>)}</div>}
              </div>}
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
