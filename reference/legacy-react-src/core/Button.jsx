import React from "react";

const base = {
  fontFamily: "var(--font-sans)",
  fontWeight: 600,
  fontSize: 16,
  lineHeight: 1,
  borderRadius: "var(--radius-pill)",
  padding: "14px 28px",
  border: "1px solid transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease, opacity .15s ease",
};

// Blue is reserved for the PRIMARY action only. Secondary actions use an
// outline or solid white; never a second blue button in the same group.
const variants = {
  primary: { backgroundColor: "var(--horizon-blue)", color: "#fff" },
  "primary-hover": { backgroundColor: "var(--horizon-blue-dim)" },
  outlineDark: { backgroundColor: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.55)" },
  "outlineDark-hover": { backgroundColor: "rgba(255,255,255,0.1)" },
  outlineLight: { backgroundColor: "transparent", color: "#000", borderColor: "rgba(0,0,0,0.4)" },
  "outlineLight-hover": { backgroundColor: "rgba(0,0,0,0.06)" },
  solidWhite: { backgroundColor: "#fff", color: "#000" },
  "solidWhite-hover": { backgroundColor: "#e1e1e4" },
  ghost: { backgroundColor: "transparent", color: "var(--horizon-blue)", padding: "14px 8px" },
};

const sizes = {
  sm: { padding: "9px 20px", fontSize: 14 },
  md: {},
  lg: { padding: "18px 34px", fontSize: 18 },
};

export function Button({ variant = "primary", size = "md", disabled = false, icon = null, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const v = hover && !disabled && variants[variant + "-hover"] ? { ...variants[variant], ...variants[variant + "-hover"] } : variants[variant];
  return (
    <button
      {...rest}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...v, ...sizes[size], opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style }}
    >
      {children}
      {icon}
    </button>
  );
}
