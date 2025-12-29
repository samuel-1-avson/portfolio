"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import Typewriter from "@/components/effects/Typewriter";
import ResumeModal from "@/components/ResumeModal";

// Simple chatbot responses based on keywords
const getChatResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return `Hello! I'm Samuel's portfolio assistant. Ask me about his skills, projects, or experience!`;
  }
  if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
    return `Samuel specializes in: Python, PyTorch, LangChain, FastAPI, Docker, AWS, and GCP. He's focused on AI/ML and data engineering.`;
  }
  if (lowerInput.includes('project')) {
    return `Samuel has built AI agents, ML pipelines, trading bots, and computer vision systems. Check out the Projects section below!`;
  }
  if (lowerInput.includes('experience') || lowerInput.includes('work')) {
    return `Samuel has experience as an AI Engineer and ML Intern, working on LLM systems, data pipelines, and autonomous agents.`;
  }
  if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('reach')) {
    return `You can reach Samuel at ${portfolioData.personal.email} or connect on LinkedIn and GitHub.`;
  }
  if (lowerInput.includes('education') || lowerInput.includes('study') || lowerInput.includes('school')) {
    return `Samuel studied ${portfolioData.education[0]?.degree || 'Computer Science'} at ${portfolioData.education[0]?.school || 'University'}.`;
  }
  if (lowerInput.includes('resume') || lowerInput.includes('cv')) {
    return `Click "View Resume" above to see Samuel's full resume, or download it directly!`;
  }
  if (lowerInput.includes('who') || lowerInput.includes('about')) {
    return `Samuel is a Data Engineer focused on AI/ML, building intelligent agents and scalable data systems.`;
  }
  
  return `I can help you learn about Samuel's skills, projects, experience, or contact info. What would you like to know?`;
};

const HeroSection = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setIsTyping(true);
    setChatResponse('');
    
    // Simulate typing delay
    setTimeout(() => {
      setChatResponse(getChatResponse(chatInput));
      setIsTyping(false);
      setChatInput('');
    }, 500);
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
