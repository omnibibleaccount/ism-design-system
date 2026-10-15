import React from "react";

export function Badge({ tone = "outlineDark", children }) {
  const tones = {
    outlineDark: { color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.4)" },
    outlineLight: { color: "rgba(0,0,0,0.7)", borderColor: "rgba(0,0,0,0.28)" },
    solidBlue: { color: "#fff", borderColor: "var(--horizon-blue)", backgroundColor: "var(--horizon-blue)" },
    accentText: { color: "var(--horizon-blue)", borderColor: "transparent" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "6px 14px",
      border: "1px solid", borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "var(--eyebrow-tracking)",
      ...tones[tone],
    }}>{children}</span>
  );
}
