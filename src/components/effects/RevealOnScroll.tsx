import type { ReactNode } from "react";

interface RevealOnScrollProps { children: ReactNode; className?: string; }

// Content deliberately renders visible. Decorative reveals must never make the
// professional profile inaccessible when JavaScript or observers are unavailable.
export default function RevealOnScroll({ children, className = "" }: RevealOnScrollProps) {
  return <div className={className}>{children}</div>;
}
