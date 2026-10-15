import React from "react";

export function Card({ image, eyebrow, title, subtitle, cta = "Explore", height = 360, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden",
      height, backgroundColor: "var(--charcoal-900)",
      backgroundImage: image ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.75)), url(${image})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center",
      border: "1px solid var(--border-hairline-dark)", cursor: onClick ? "pointer" : "default",
      display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20, boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {cta && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.92)",
            color: "#000", fontSize: 14, fontWeight: 600, padding: "8px 14px", borderRadius: "var(--radius-pill)",
          }}>{cta} ↗</span>
        )}
      </div>
      <div>
        {eyebrow && <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, letterSpacing: "var(--eyebrow-tracking)", textTransform: "uppercase", marginBottom: 8 }}>{eyebrow}</div>}
        {title && <div style={{ color: "#fff", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 24, lineHeight: 1.2 }}>{title}</div>}
        {subtitle && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 6 }}>{subtitle}</div>}
      </div>
    </div>
  );
}
