"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AssistantContextValue = {
  isOpen: boolean;
  open: (prompt?: string) => void;
  close: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

// The panel (and its streaming client) is only downloaded the first time someone opens it.
const AssistantPanel = dynamic(() => import("./AssistantPanel"), { ssr: false });

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [request, setRequest] = useState<{ prompt: string; id: number } | null>(null);

  const open = useCallback((prompt?: string) => {
    setHasOpened(true);
    setIsOpen(true);
    if (prompt) setRequest({ prompt, id: Date.now() });
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setHasOpened(true);
        setIsOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <AssistantContext.Provider value={value}>
      {children}
      {hasOpened && <AssistantPanel open={isOpen} onClose={close} request={request} onRequestHandled={() => setRequest(null)} />}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error("useAssistant must be used inside AssistantProvider");
  return context;
}
