import React from "react";

export function Input({ label, placeholder, dark = false, type = "text" }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font-sans)" }}>
      {label && <span style={{ fontSize: 13, fontWeight: 600, color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{label}</span>}
      <input type={type} placeholder={placeholder} style={{
        padding: "14px 16px", borderRadius: "var(--radius-md)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"}`,
        backgroundColor: dark ? "rgba(255,255,255,0.06)" : "#fff",
        color: dark ? "#fff" : "#000", fontSize: 16, outline: "none",
      }} />
    </label>
  );
}
