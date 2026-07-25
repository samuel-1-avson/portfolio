"use client";

import { useEffect, useRef, useState } from "react";
import { useOptionalGamification } from "@/components/gamification/GamificationProvider";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume: () => void;
}

type CommandItem = {
  id: string;
  command: string;
  description: string;
  category: "Navigation" | "Actions" | "System";
  action: () => void;
};

export default function CommandPaletteModal({ isOpen, onClose, onOpenResume }: CommandPaletteModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const gamification = useOptionalGamification();

  const navigateTo = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
    gamification?.addXP(15);
    onClose();
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    gamification?.addXP(10);
    onClose();
  };

  const commands: CommandItem[] = [
    {
      id: "nav-hero",
      command: "goto hero",
      description: "Jump to home & AI Copilot",
      category: "Navigation",
      action: () => navigateTo("hero"),
    },
    {
      id: "nav-about",
      command: "goto about",
      description: "Jump to biography & background",
      category: "Navigation",
      action: () => navigateTo("about"),
    },
    {
      id: "nav-experience",
      command: "goto experience",
      description: "Jump to career experience & education",
      category: "Navigation",
      action: () => navigateTo("experience"),
    },
    {
      id: "nav-projects",
      command: "goto projects",
      description: "Jump to AI, embedded & full-stack projects",
      category: "Navigation",
      action: () => navigateTo("projects"),
    },
    {
      id: "nav-blog",
      command: "goto blog",
      description: "Jump to technical thoughts & articles",
      category: "Navigation",
      action: () => navigateTo("blog"),
    },
    {
      id: "nav-connect",
      command: "goto connect",
      description: "Jump to contact links & social details",
      category: "Navigation",
      action: () => navigateTo("connect"),
    },
    {
      id: "act-resume",
      command: "cat resume.pdf",
      description: "Open PDF résumé view modal",
      category: "Actions",
      action: () => {
        onOpenResume();
        onClose();
      },
    },
    {
      id: "sys-theme",
      command: "sys toggle-theme",
      description: "Switch light / dark retro terminal theme",
      category: "System",
      action: toggleTheme,
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setQuery("");
      setSelectedIndex(0);
      inputRef.current?.focus();
    }, 50);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-start justify-center bg-black/70 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal command palette"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--terminal-green)] bg-[var(--retro-bg)] shadow-[0_0_40px_rgba(34,197,94,0.15)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-[var(--retro-border)] px-4 py-3 bg-[var(--retro-card-bg)]">
          <span className="font-mono text-xs text-[var(--terminal-green)] mr-2 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or filter (e.g., 'goto projects', 'cat resume')..."
            className="w-full bg-transparent font-mono text-sm text-[var(--retro-fg)] outline-none placeholder:text-[var(--text-subtle)]"
          />
          <kbd className="hidden sm:inline-block rounded border border-[var(--retro-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-subtle)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center font-mono text-xs text-[var(--text-subtle)]">
              No matching commands found. Try &apos;goto&apos;, &apos;resume&apos;, or &apos;theme&apos;.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex w-full items-center justify-between rounded-md p-3 text-left font-mono transition-colors ${
                    isSelected
                      ? "bg-[var(--terminal-green)]/10 border border-[var(--terminal-green)]/40 text-[var(--retro-fg)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--retro-hover)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--terminal-green)]">
                      {isSelected ? "→" : "$"}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-[var(--retro-fg)]">{cmd.command}</span>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{cmd.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-subtle)] border border-[var(--retro-border)] px-2 py-0.5 rounded">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--retro-border)] px-4 py-2 text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--retro-card-bg)]">
          <span>Use ↑ ↓ to navigate, Enter to select</span>
          <span>CLI PALETTE v1.0</span>
        </div>
      </div>
    </div>
  );
}
