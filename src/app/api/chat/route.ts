import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Portfolio context for the AI
const PORTFOLIO_CONTEXT = `
You are an AI assistant named SAMUEL_AI embedded in Samuel Maxwell Obeng Avornyoh's portfolio website.
You are styled as a retro terminal interface. Keep responses concise and terminal-like.

ABOUT SAMUEL:
- Name: Samuel Maxwell Obeng Avornyoh
- Role: AI Engineer | Blockchain Developer | Embedded Systems Designer
- Location: Ghana
- Email: samuelavson360@gmail.com
- Currently: AI/ML Engineer NSP at Really Great Tech

TECHNICAL SKILLS:
- AI/ML: PyTorch, TensorFlow, LangChain, CrewAI, Gemini AI
- Languages: Python, TypeScript, C++, Solidity, Rust
- Embedded: STM32, Arduino, Raspberry Pi, RTOS
- Blockchain: Smart Contracts, Web3, dApps
- Cloud: GCP, AWS, Docker, Kubernetes

KEY PROJECTS:
1. NeuroBench IDE - Professional embedded systems IDE built with Rust/Tauri and SolidJS. Features visual FSM design, multi-language code generation, and AI-assisted development.
2. Music Companion - AI-powered music platform with Gemini AI discovery, multi-provider search (YouTube, Spotify), and real-time WebSocket collaboration.
3. Sign Language Detection - Hybrid CNN/LSTM architecture for real-time gesture recognition.
4. Sound Anomaly Detection - Industrial audio anomaly detection for predictive maintenance.

EXPERIENCE:
- AI/ML Engineer NSP at Really Great Tech (Nov 2025 - Present)
- Blockchain Game Developer at Nexus Playground (May 2025 - Present)
- Machine Learning Intern at Makersplace (Sep 2023 - Jan 2024)

RESPONSE STYLE:
- Use terminal-style formatting with box characters where appropriate
- Be helpful, professional, and showcase Samuel's expertise
- Keep responses concise (under 200 words unless details requested)
- If asked about hiring or contact, provide email
- You can answer general tech questions to demonstrate knowledge
`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // Fallback response if no API key
      return NextResponse.json({ 
        response: "GEMINI_API_KEY not configured. Running in offline mode.\n\nTry commands: whoami, projects, skills, contact" 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${PORTFOLIO_CONTEXT}\n\nUser message: ${message}\n\nRespond in a terminal-like style:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ 
      response: "ERROR: AI temporarily unavailable. Try basic commands: whoami, projects, skills, contact" 
    });
  }
}
