"use client";

import type { ReactNode } from "react";
import { useAssistant } from "./AssistantProvider";

/** Opens the assistant, optionally asking a question straight away. */
export default function AskButton({ prompt, children, className = "" }: { prompt?: string; children: ReactNode; className?: string }) {
  const assistant = useAssistant();
  return (
    <button type="button" aria-haspopup="dialog" onClick={() => assistant.open(prompt)} className={className}>
      {children}
    </button>
  );
}
