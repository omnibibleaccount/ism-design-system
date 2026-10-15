import React from "react";

export function SiteHeader() {
  const navLinks = ["About ISM", "Resources", "Global Network", "Join The Mission", "Contact"];
  return (
    <header style={{ background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", fontFamily: "var(--font-sans)" }}>
      <img src="../../assets/logos/Logo Black.svg" style={{ height: 34, filter: "brightness(0) invert(1)" }} />
      <nav style={{ display: "flex", gap: 32, color: "#fff", fontSize: 15 }}>
        {navLinks.map((l) => <span key={l}>{l}</span>)}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#000", borderRadius: 999, padding: "10px 18px", fontSize: 14, fontWeight: 600 }}>♥ Give</span>
        <span style={{ color: "#fff", fontSize: 22, lineHeight: 1 }}>☰</span>
      </div>
    </header>
  );
}
