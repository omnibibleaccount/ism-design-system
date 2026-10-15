import React from "react";

export function Divider({ orientation = "horizontal", length = 72, thickness = 2 }) {
  const isH = orientation === "horizontal";
  return (
    <div style={{
      width: isH ? length : thickness,
      height: isH ? thickness : length,
      borderRadius: 999,
      background: "var(--gradient-signature)",
    }} />
  );
}

export function AccentBar({ progress = 0.4, width = 200 }) {
  return (
    <div style={{ width, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.18)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, width: `${progress * 100}%`, borderRadius: 2, background: "var(--gradient-signature)" }} />
    </div>
  );
}
