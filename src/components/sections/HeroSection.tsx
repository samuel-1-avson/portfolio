"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import Typewriter from "@/components/effects/Typewriter";
import ResumeModal from "@/components/ResumeModal";

// Call Gemini API for chat responses
const callGeminiAPI = async (userMessage: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();
    return data.response || 'Sorry, I could not process that. Try asking about skills, projects, or experience.';
  } catch {
    return 'Connection error. Try again or check out the sections below!';
  }
};

const HeroSection = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setIsTyping(true);
    setChatResponse('');
    
    // Call Gemini API
    const response = await callGeminiAPI(userMessage);
    setChatResponse(response);
    setIsTyping(false);
  };

  return (
    <>
      <section id="hero" className="min-h-screen flex flex-col justify-center relative py-20">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center">
            {/* Terminal prompt */}
            <div className="font-mono text-sm text-green-600 mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>~/portfolio</span>
            </div>
            
            {/* Name */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight text-[var(--retro-fg)]">
              {portfolioData.personal.name.split(' ')[0]}
              <span className="text-green-500">.</span>
            </h1>
            
            {/* Tagline with typewriter */}
            <div className="text-xl sm:text-2xl text-[var(--retro-fg)]/60 font-mono mb-8">
              <Typewriter text={portfolioData.personal.tagline} delay={300} speed={40} />
            </div>

            {/* Bio */}
            <p className="text-base text-[var(--retro-fg)]/50 font-mono leading-relaxed mb-10 max-w-xl mx-auto">
              {portfolioData.personal.bio}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a 
                href="#projects" 
                className="px-6 py-3 bg-green-500 text-white font-mono text-sm hover:bg-green-600 transition-colors"
              >
                View Projects →
              </a>
              <button 
                onClick={() => setIsResumeOpen(true)}
                className="px-6 py-3 border border-[var(--retro-border)] text-[var(--retro-fg)] font-mono text-sm hover:border-green-500 hover:text-green-600 transition-colors"
              >
                View Resume
              </button>
            </div>

            {/* Mini Chatbot */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleChatSubmit} className="relative">
                <div className="flex items-center gap-2 border border-[var(--retro-border)] bg-[var(--retro-bg)] px-3 py-2">
                  <span className="text-green-600 font-mono text-sm">{'>'}</span>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything about Samuel..."
                    className="flex-1 bg-transparent font-mono text-sm text-[var(--retro-fg)] placeholder:text-[var(--retro-fg)]/30 outline-none"
                  />
                  <button 
                    type="submit"
                    className="text-xs text-green-600 hover:text-green-500 font-mono"
                  >
                    [SEND]
                  </button>
                </div>
              </form>
              
              {/* Chat Response */}
              {(chatResponse || isTyping) && (
                <div className="mt-2 p-3 border border-[var(--retro-border)] bg-[var(--retro-bg)] text-left">
                  <span className="text-green-600 font-mono text-xs">$ response:</span>
                  <p className="font-mono text-sm text-[var(--retro-fg)]/80 mt-1">
                    {isTyping ? (
                      <span className="animate-pulse">thinking...</span>
                    ) : (
                      chatResponse
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Minimal scroll indicator */}
            <div className="mt-12 font-mono text-xs text-[var(--retro-fg)]/30">
              scroll ↓
            </div>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
};

export default HeroSection;
