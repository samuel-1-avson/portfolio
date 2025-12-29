"use client";

import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const targetId = id.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'About', path: '#about' },
    { name: 'Experience', path: '#experience' },
    { name: 'Projects', path: '#projects' },
    { name: 'Connect', path: '#connect' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--retro-bg)]/90 backdrop-blur-sm border-b border-[var(--retro-border)]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-mono font-bold text-[var(--retro-fg)] hover:text-green-600 transition-colors">
          {portfolioData.personal.name.toLowerCase()}_
        </Link>
        
        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.path} 
              href={link.path}
              onClick={(e) => handleScroll(e, link.path)}
              className="font-mono text-sm text-[var(--retro-fg)]/60 hover:text-green-600 transition-colors hidden sm:block"
            >
              {link.name}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
