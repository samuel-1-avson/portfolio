"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import ConnectSection from "@/components/sections/ConnectSection";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import MLBackground from "@/components/visuals/MLBackground";

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 100);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--retro-bg)] text-[var(--retro-fg)] relative overflow-x-hidden">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{
          backgroundImage: 'linear-gradient(var(--retro-fg) 1px, transparent 1px), linear-gradient(90deg, var(--retro-fg) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* ML Background Animations */}
      <MLBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className={`
        relative z-10 transition-opacity duration-500
        ${isReady ? 'opacity-100' : 'opacity-0'}
      `}>
        <HeroSection />
        
        <RevealOnScroll>
          <AboutSection />
        </RevealOnScroll>

        <RevealOnScroll>
          <ExperienceSection />
        </RevealOnScroll>
        
        <RevealOnScroll>
          <ProjectsSection />
        </RevealOnScroll>

        <RevealOnScroll>
          <BlogSection />
        </RevealOnScroll>
      </div>
      
      {/* Footer */}
      <ConnectSection />
    </main>
  );
}
