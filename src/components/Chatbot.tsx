"use client";

import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useOptionalGamification } from './gamification/GamificationProvider';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isHtml?: boolean;
}

const SECRET_COMMANDS: Record<string, string> = {
  'sudo hire-me': `
╔═══════════════════════════════════════════════════════════╗
║  🚀 SUDO PRIVILEGE GRANTED                                ║
║                                                           ║
║  Congratulations! You've discovered a secret command.     ║
║  This proves you have the curiosity and technical         ║
║  mindset I value in collaborators.                        ║
║                                                           ║
║  📧 Let's connect: ${portfolioData.personal.email}        ║
╚═══════════════════════════════════════════════════════════╝
  `,
  'rm -rf /': `
⚠️ PERMISSION_DENIED: Nice try! This isn't a real terminal...
But I appreciate the chaos energy. 😈

Achievement hint: Try something more constructive!
  `,
  'cat /etc/passwd': `
root:x:0:0:Samuel Avornyoh:/root:/bin/bash
ai_engineer:x:1000:1000:Neural Networks:/home/ai:/bin/python
blockchain:x:1001:1001:Decentralized:/home/web3:/bin/solidity
creativity:x:1002:1002:Ideas:/home/mind:/bin/infinite

Just kidding! But you've found an easter egg. 🥚
  `,
  'hack': `
🔓 INITIATING_HACK_SEQUENCE...
████████░░░░░░░░░░░░ 40%
ERROR: Ethics module prevented action.

Just kidding! I appreciate your hacker spirit though.
Type 'skills' to see what I can actually do.
  `,
  'matrix': `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

🐇 Knock, knock.

(Try the Konami code: ↑↑↓↓←→←→BA)
  `,
  'coffee': `
☕ BREWING_COFFEE...
████████████████████ 100%

Coffee ready! Fun fact: This portfolio was built
with approximately 47 cups of coffee.
  `,
  'game': `
🎮 TYPING_GAME_COMING_SOON!

In the meantime, try exploring more commands:
- whoami
- projects
- skills
- contact
- help
  `,
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: "SYSTEM_ONLINE... TYPE 'HELP' FOR COMMANDS." }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const gamificationContext = useOptionalGamification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isTyping, setIsTyping] = useState(false);

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      return data.response || 'RESPONSE_ERROR. TRY AGAIN.';
    } catch {
      return 'CONNECTION_ERROR. AI OFFLINE. TRY BASIC COMMANDS: whoami, projects, skills, contact';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim(); // Save the message before clearing
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setCommandHistory(prev => [...prev, userMessage]);
    setHistoryIndex(-1);
    
    const lowerInput = userMessage.toLowerCase();
    setInput(''); // Clear input after saving

    // Track command for gamification
    if (gamificationContext) {
      gamificationContext.trackCommand(lowerInput);
    }

    // Check for static commands first
    let botResponse: string | null = null;
    
    // Check secret commands first
    const secretKey = Object.keys(SECRET_COMMANDS).find(key => lowerInput.includes(key));
    if (secretKey) {
      botResponse = SECRET_COMMANDS[secretKey];
      if (gamificationContext) {
        gamificationContext.unlockAchievement('secret_command');
      }
    } else if (lowerInput.includes('who') || lowerInput.includes('about') || lowerInput === 'whoami') {
      botResponse = `
┌─ USER_PROFILE ─────────────────────────────────
│ NAME: ${portfolioData.personal.name}
│ ROLE: ${portfolioData.personal.tagline}
│ LOCATION: ${portfolioData.personal.location}
├─ BIO ──────────────────────────────────────────
│ ${portfolioData.personal.bio}
└────────────────────────────────────────────────
      `;
    } else if (lowerInput.includes('project') || lowerInput.includes('work') || lowerInput.includes('built')) {
      const projectList = portfolioData.projects.map((p, i) => 
        `  ${i + 1}. ${p.title}\n     └─ ${p.tech.slice(0, 3).join(', ')}`
      ).join('\n');
      botResponse = `
┌─ PROJECT_LIST ─────────────────────────────────
${projectList}
├────────────────────────────────────────────────
│ Type project name for details
└────────────────────────────────────────────────
      `;
    } else if (lowerInput.includes('skill') || lowerInput.includes('stack') || lowerInput.includes('tech')) {
      botResponse = `
┌─ TECHNICAL_STACK ──────────────────────────────
│ LANGUAGES: Python, Rust, TS/JS, SQL, Solidity, Go, C/C++
│ ML/AI: PyTorch, scikit-learn, LangChain, CrewAI, MLflow
│ TOOLS/INFRA: GCP, AWS, Docker, Kubernetes, Git/GitHub
│ BACKEND/DB: FastAPI, Express.js, Axum, Redis, Supabase
├─ EXPERTISE_AREAS ──────────────────────────────
│ ▸ AI Systems & MLOps
│ ▸ Data Engineering & Analytics
│ ▸ Blockchain & dApps
│ ▸ Embedded System Design
└────────────────────────────────────────────────
      `;
    } else if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('connect')) {
      botResponse = `
┌─ COMM_CHANNELS ────────────────────────────────
│ EMAIL: ${portfolioData.personal.email}
│ GITHUB: ${portfolioData.socials.github}
│ LINKEDIN: ${portfolioData.socials.linkedin}
├────────────────────────────────────────────────
│ Response time: Usually within 24 hours
└────────────────────────────────────────────────
      `;
    } else if (lowerInput === 'help' || lowerInput === '?') {
      botResponse = `
┌─ AVAILABLE_COMMANDS ───────────────────────────
│ whoami    - Display user profile
│ projects  - List all projects
│ skills    - Show technical stack
│ contact   - Get contact information
│ clear     - Clear terminal
│ help      - Show this message
├─ AI_MODE ──────────────────────────────────────
│ Ask any question! Powered by Gemini AI.
│ Try: "What makes you a good AI Engineer?"
├─ HINTS ────────────────────────────────────────
│ There are secret commands to discover...
└────────────────────────────────────────────────
      `;
    } else if (lowerInput === 'clear' || lowerInput === 'cls') {
      setMessages([{ id: Date.now().toString(), sender: 'bot', text: "TERMINAL_CLEARED. READY FOR INPUT..." }]);
      return;
    } else if (lowerInput.includes('experience') || lowerInput.includes('cv') || lowerInput.includes('resume')) {
      const exp = portfolioData.cv[0];
      botResponse = `
┌─ CURRENT_POSITION ─────────────────────────────
│ ROLE: ${exp.role}
│ AT: ${exp.company}
│ PERIOD: ${exp.period}
├─ DESCRIPTION ──────────────────────────────────
│ ${exp.description}
└────────────────────────────────────────────────
      `;
    }

    // Check for specific project names
    if (!botResponse) {
      portfolioData.projects.forEach(project => {
        if (lowerInput.includes(project.title.toLowerCase().split(' ')[0].toLowerCase())) {
          botResponse = `
┌─ PROJECT: ${project.title.toUpperCase()} ──────
│ ${project.description}
├─ TECH_STACK ───────────────────────────────────
│ ${project.tech.join(' • ')}
├─ LINK ─────────────────────────────────────────
│ ${project.link === '#' ? 'Coming soon...' : project.link}
└────────────────────────────────────────────────
          `;
        }
      });
    }

    // If no static response, call Gemini AI
    if (!botResponse) {
      setIsTyping(true);
      botResponse = await callGeminiAPI(userMessage);
      setIsTyping(false);
    }

    setMessages(prev => [...prev, { 
      id: (Date.now() + 1).toString(), 
      sender: 'bot', 
      text: botResponse!, // Guaranteed non-null after Gemini fallback
      isHtml: false 
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="h-[350px] md:h-[400px] flex flex-col font-mono text-sm">
      {/* Terminal Output */}
      <div className="flex-1 overflow-y-auto space-y-3 terminal-scrollbar pr-2">
        <div className="text-[var(--retro-fg)]/40 text-xs mb-4">
          &gt; LAST_LOGIN: {new Date().toLocaleDateString()}<br/>
          &gt; READY_FOR_INPUT...
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            {msg.sender === 'user' ? (
              <div className="flex items-start gap-2">
                <span className="text-[var(--terminal-cyan)] shrink-0">guest@portfolio $</span>
                <span className="text-[var(--retro-fg)]">{msg.text}</span>
              </div>
            ) : (
              <div className="text-[var(--terminal-green)] whitespace-pre-wrap text-xs leading-relaxed">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-[var(--terminal-green)] text-xs animate-pulse">
            GEMINI_AI: Processing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-[var(--terminal-green)]/20 flex items-center gap-2">
        <span className="text-[var(--terminal-cyan)] shrink-0">guest@portfolio $</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent border-none text-[var(--retro-fg)] font-mono text-sm focus:outline-none"
          placeholder="type command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <span className="w-2 h-4 bg-[var(--terminal-green)] animate-cursor-blink" />
      </div>
    </div>
  );
};

export default Chatbot;
