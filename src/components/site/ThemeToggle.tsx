"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Light-first theme switch. The choice is stored per browser; the default is light. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this page view.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label="Dark theme"
      title={`Switch to ${next} theme`}
      className={`inline-flex size-11 items-center justify-center text-fg transition-opacity hover:opacity-60 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="7.25" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
      </svg>
    </button>
  );
}
