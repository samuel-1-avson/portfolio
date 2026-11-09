// Shared black-and-white social preview layout for next/og (Satori: flexbox only).
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#000", color: "#fff", padding: "72px 80px" }}>
      <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#b3b3b3" }}>{eyebrow}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: title.length > 28 ? 76 : 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>{title}</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.3, color: "#d4d4d4", maxWidth: 980 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #fff", paddingTop: 28, fontSize: 26 }}>
        <span>Samuel Avornyoh</span>
        <span style={{ color: "#b3b3b3" }}>{footer}</span>
      </div>
    </div>
  );
}
