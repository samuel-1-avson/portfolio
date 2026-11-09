// Re-mounts on every navigation, giving each page a short, reduced-motion-aware entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
