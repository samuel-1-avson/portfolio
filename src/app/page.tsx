"use client";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import BlogSection from "@/components/sections/BlogSection";
import ConnectSection from "@/components/sections/ConnectSection";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import MLBackground from "@/components/visuals/MLBackground";
import { GamificationProvider } from "@/components/gamification/GamificationProvider";
import AchievementToast from "@/components/gamification/AchievementToast";

export default function Home() {
  return (
    <GamificationProvider>
      <main className="min-h-screen bg-[var(--retro-bg)] text-[var(--retro-fg)] relative overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[var(--retro-fg)] focus:px-4 focus:py-3 focus:text-[var(--retro-bg)]">Skip to content</a>
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
        <div id="main-content" className="relative z-10" tabIndex={-1}>
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

        {/* Gamification Toast */}
        <AchievementToast />
      </main>
    </GamificationProvider>
  );
}

