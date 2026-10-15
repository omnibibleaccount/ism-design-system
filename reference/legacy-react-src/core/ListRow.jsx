import React from "react";

export function ListRow({ icon, title, meta, progress = 0.15, dark = true }) {
  const fg = dark ? "#fff" : "#000";
  const track = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: fg, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{title}</div>
        <div style={{ height: 3, borderRadius: 2, backgroundColor: track, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, borderRadius: 2, backgroundColor: "var(--horizon-blue)" }} />
        </div>
      </div>
      <div style={{ color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)", fontSize: 13, flexShrink: 0 }}>{meta}</div>
      <button style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${track}`, background: "none", color: fg, flexShrink: 0, cursor: "pointer" }}>▶</button>
    </div>
  );
}
