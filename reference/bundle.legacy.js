/* @ds-bundle: {"format":4,"namespace":"ISMDesignSystem_106e83","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"AccentBar","sourcePath":"components/core/Divider.jsx"},{"name":"Footer","sourcePath":"components/core/Footer.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ListRow","sourcePath":"components/core/ListRow.jsx"},{"name":"SiteHeader","sourcePath":"components/core/SiteHeader.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"00c2c2255050","components/core/Button.jsx":"70aabfb56cbc","components/core/Card.jsx":"baad5b65e1b3","components/core/Divider.jsx":"89b3e8e1c0b4","components/core/Footer.jsx":"558d154e5a32","components/core/Input.jsx":"334c1c980b32","components/core/ListRow.jsx":"d2fd403ebf31","components/core/SiteHeader.jsx":"10d5e681cfb7","ui_kits/dot-bible-app/HomeScreen.jsx":"aa76561c75ed","ui_kits/dot-bible-app/ios-frame.jsx":"24642b887be3","ui_kits/marketing-email/EmailParts.jsx":"05998ce2a253","ui_kits/marketing-site/HeroSections.jsx":"287faf9b1803","ui_kits/marketing-site/Sections.jsx":"3b3a072463c8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ISMDesignSystem_106e83 = window.ISMDesignSystem_106e83 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = "outlineDark",
  children
}) {
  const tones = {
    outlineDark: {
      color: "rgba(255,255,255,0.85)",
      borderColor: "rgba(255,255,255,0.4)"
    },
    outlineLight: {
      color: "rgba(0,0,0,0.7)",
      borderColor: "rgba(0,0,0,0.28)"
    },
    solidBlue: {
      color: "#fff",
      borderColor: "var(--horizon-blue)",
      backgroundColor: "var(--horizon-blue)"
    },
    accentText: {
      color: "var(--horizon-blue)",
      borderColor: "transparent"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 14px",
      border: "1px solid",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--eyebrow-tracking)",
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  transition: "background-color .15s ease, color .15s ease, border-color .15s ease, opacity .15s ease"
};

// Blue is reserved for the PRIMARY action only. Secondary actions use an
// outline or solid white; never a second blue button in the same group.
const variants = {
  primary: {
    backgroundColor: "var(--horizon-blue)",
    color: "#fff"
  },
  "primary-hover": {
    backgroundColor: "var(--horizon-blue-dim)"
  },
  outlineDark: {
    backgroundColor: "transparent",
    color: "#fff",
    borderColor: "rgba(255,255,255,0.55)"
  },
  "outlineDark-hover": {
    backgroundColor: "rgba(255,255,255,0.1)"
  },
  outlineLight: {
    backgroundColor: "transparent",
    color: "#000",
    borderColor: "rgba(0,0,0,0.4)"
  },
  "outlineLight-hover": {
    backgroundColor: "rgba(0,0,0,0.06)"
  },
  solidWhite: {
    backgroundColor: "#fff",
    color: "#000"
  },
  "solidWhite-hover": {
    backgroundColor: "#e1e1e4"
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--horizon-blue)",
    padding: "14px 8px"
  }
};
const sizes = {
  sm: {
    padding: "9px 20px",
    fontSize: 14
  },
  md: {},
  lg: {
    padding: "18px 34px",
    fontSize: 18
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = hover && !disabled && variants[variant + "-hover"] ? {
    ...variants[variant],
    ...variants[variant + "-hover"]
  } : variants[variant];
  return /*#__PURE__*/React.createElement("button", _extends({}, rest, {
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...v,
      ...sizes[size],
      opacity: disabled ? 0.45 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }), children, icon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  image,
  eyebrow,
  title,
  subtitle,
  cta = "Explore",
  height = 360,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: "relative",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      height,
      backgroundColor: "var(--charcoal-900)",
      backgroundImage: image ? `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.75)), url(${image})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      border: "1px solid var(--border-hairline-dark)",
      cursor: onClick ? "pointer" : "default",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 20,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, cta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.92)",
      color: "#000",
      fontSize: 14,
      fontWeight: 600,
      padding: "8px 14px",
      borderRadius: "var(--radius-pill)"
    }
  }, cta, " \u2197")), /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,0.75)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "var(--eyebrow-tracking)",
      textTransform: "uppercase",
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 24,
      lineHeight: 1.2
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 15,
      marginTop: 6
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function Divider({
  orientation = "horizontal",
  length = 72,
  thickness = 2
}) {
  const isH = orientation === "horizontal";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: isH ? length : thickness,
      height: isH ? thickness : length,
      borderRadius: 999,
      background: "var(--gradient-signature)"
    }
  });
}
function AccentBar({
  progress = 0.4,
  width = 200
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height: 3,
      borderRadius: 2,
      background: "rgba(255,255,255,0.18)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      width: `${progress * 100}%`,
      borderRadius: 2,
      background: "var(--gradient-signature)"
    }
  }));
}
Object.assign(__ds_scope, { Divider, AccentBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Footer.jsx
try { (() => {
const navCols = [{
  title: "ABOUT",
  links: ["About ISM", "Our Mission", "Our Team", "Statement of Faith", "FAQ's"]
}, {
  title: "PLATFORMS",
  links: ["dot.Bible App", "ISM Radio", "ISM Publishing", "TAP Cards"]
}, {
  title: "GET INVOLVED",
  links: ["Give Online", "Join The Mission", "Partner With Us", "Contact"]
}];
const socialIcons = {
  instagram: "M16.0034 9.02616C12.1441 9.02616 9.03129 12.1398 9.03129 15.9999C9.03129 19.86 12.1441 22.9736 16.0034 22.9736C19.8627 22.9736 22.9756 19.86 22.9756 15.9999C22.9756 12.1398 19.8627 9.02616 16.0034 9.02616ZM16.0034 20.5337C13.5095 20.5337 11.4706 18.5005 11.4706 15.9999C11.4706 13.4993 13.5034 11.4661 16.0034 11.4661C18.5035 11.4661 20.5363 13.4993 20.5363 15.9999C20.5363 18.5005 18.4974 20.5337 16.0034 20.5337ZM24.887 8.74087C24.887 9.64526 24.1589 10.3675 23.2608 10.3675C22.3567 10.3675 21.6346 9.63916 21.6346 8.74087C21.6346 7.84267 22.3628 7.11433 23.2608 7.11433C24.1589 7.11433 24.887 7.84267 24.887 8.74087ZM29.5048 10.3918C29.4017 8.21289 28.9041 6.28277 27.3082 4.69264C25.7183 3.10244 23.7887 2.60474 21.6103 2.4955C19.3652 2.36804 12.6357 2.36804 10.3905 2.4955C8.21811 2.59868 6.2885 3.09636 4.69263 4.68654C3.09667 6.27676 2.60519 8.20679 2.49596 10.3857C2.36853 12.6313 2.36853 19.3623 2.49596 21.608C2.59912 23.7869 3.09667 25.717 4.69263 27.3071C6.2885 28.8973 8.2121 29.395 10.3905 29.5043C12.6357 29.6318 19.3652 29.6318 21.6103 29.5043C23.7887 29.4011 25.7183 28.9034 27.3082 27.3071C28.8981 25.717 29.3956 23.7869 29.5048 21.608C29.6322 19.3623 29.6322 12.6374 29.5048 10.3918ZM26.6043 24.0176C26.131 25.2071 25.2147 26.1236 24.0194 26.6031C22.2293 27.3132 17.9816 27.1494 16.0034 27.1494C14.0252 27.1494 9.77157 27.3071 7.98758 26.6031C6.79816 26.1297 5.88196 25.2132 5.40252 24.0176C4.69263 22.2271 4.85645 17.9785 4.85645 15.9999C4.85645 14.0213 4.69864 9.76661 5.40252 7.98222C5.87586 6.79263 6.79216 5.87613 7.98758 5.39668C9.77757 4.68654 14.0252 4.8504 16.0034 4.8504C17.9816 4.8504 22.2353 4.69264 24.0194 5.39668C25.2087 5.87013 26.1249 6.78653 26.6043 7.98222C27.3143 9.7727 27.1504 14.0213 27.1504 15.9999C27.1504 17.9785 27.3143 22.2332 26.6043 24.0176Z",
  facebook: "M29.6004 16.0827C29.6004 8.52408 23.5133 2.3999 16.0004 2.3999C8.48747 2.3999 2.40039 8.52408 2.40039 16.0827C2.40039 22.9119 7.37373 28.5726 13.8754 29.5999V20.038H10.4205V16.0827H13.8754V13.068C13.8754 9.63905 15.9044 7.74505 19.0121 7.74505C20.5005 7.74505 22.0567 8.01205 22.0567 8.01205V11.3776H20.3414C18.6523 11.3776 18.1254 12.4325 18.1254 13.5144V16.0827H21.8972L21.294 20.038H18.1254V29.5999C24.6271 28.5726 29.6004 22.9119 29.6004 16.0827Z",
  x: "M18.5871 13.9175L28.713 2.40015H26.3135L17.5212 12.4005L10.4988 2.40015H2.39941L13.0186 17.5224L2.39941 29.6001H4.79909L14.0839 19.0395L21.5 29.6001H29.5994L18.5871 13.9175ZM15.3005 17.6556L14.2245 16.1498L5.66369 4.16769H9.34938L16.2581 13.8377L17.334 15.3435L26.3146 27.9129H22.6289L15.3005 17.6556Z",
  linkedin: "M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z"
};
const socialViewBox = {
  instagram: 32,
  facebook: 32,
  x: 32,
  linkedin: 512
};
function SocialRing({
  name
}) {
  const box = socialViewBox[name];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${box} ${box}`,
    width: 17,
    height: 17,
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: socialIcons[name]
  })));
}
function Footer({
  ctaText = "Help deliver the Bible beyond every barrier.",
  ctaLabel = "Support Bible Access"
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      position: "relative",
      background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(4,109,227,0.30), transparent 70%), radial-gradient(ellipse 45% 40% at 85% 10%, rgba(243,178,90,0.16), transparent 70%), #000",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      paddingTop: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "32px auto",
      padding: "32px 16px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
      borderRadius: 15,
      border: "1px solid transparent",
      backgroundImage: "linear-gradient(#000,#000), linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)",
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      lineHeight: 1.3,
      margin: 0,
      color: "#fff"
    }
  }, ctaText), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid #fff",
      padding: "12px 20px",
      borderRadius: 9999,
      fontSize: 16,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, ctaLabel, " \u2197"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "24px 16px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 48,
      padding: "32px 0 48px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 390,
      flex: "1 1 320px"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/Full Logo Black.svg",
    style: {
      display: "block",
      width: "min(100%,285px)",
      height: "auto",
      filter: "brightness(0) invert(1)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "22px 0 26px",
      maxWidth: "36rem",
      color: "rgba(255,255,255,0.68)",
      fontSize: 14,
      lineHeight: 1.75
    }
  }, "Delivering unhindered access to the Bible until everyone can engage with Scripture in their own language, without barriers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(SocialRing, {
    name: "instagram"
  }), /*#__PURE__*/React.createElement(SocialRing, {
    name: "facebook"
  }), /*#__PURE__*/React.createElement(SocialRing, {
    name: "x"
  }), /*#__PURE__*/React.createElement(SocialRing, {
    name: "linkedin"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 56,
      flex: "2 1 430px"
    }
  }, navCols.map(col => /*#__PURE__*/React.createElement("div", {
    key: col.title,
    style: {
      minWidth: 115
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 14px",
      color: "rgba(255,255,255,0.5)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.13em",
      textTransform: "uppercase"
    }
  }, col.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 0,
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 2.15,
      color: "#ffffff"
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("span", {
    key: l
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.14)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 32,
      padding: "22px 0 4px",
      color: "rgba(255,255,255,0.5)",
      fontSize: 11,
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 3px"
    }
  }, "\xA9 2026 \u2013 International Scripture Ministries Inc"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "ISM is a 501(c)(3) nonprofit organization. All donations are tax-deductible.")), /*#__PURE__*/React.createElement("div", {
    style: {
      whiteSpace: "nowrap"
    }
  }, "Cookie Policy\xA0|\xA0Terms\xA0|\xA0Privacy"))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Footer.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  dark = false,
  type = "text"
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      fontFamily: "var(--font-sans)"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    style: {
      padding: "14px 16px",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"}`,
      backgroundColor: dark ? "rgba(255,255,255,0.06)" : "#fff",
      color: dark ? "#fff" : "#000",
      fontSize: 16,
      outline: "none"
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ListRow.jsx
try { (() => {
function ListRow({
  icon,
  title,
  meta,
  progress = 0.15,
  dark = true
}) {
  const fg = dark ? "#fff" : "#000";
  const track = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      backgroundColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: fg,
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 16,
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      borderRadius: 2,
      backgroundColor: track,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      width: `${progress * 100}%`,
      borderRadius: 2,
      backgroundColor: "var(--horizon-blue)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)",
      fontSize: 13,
      flexShrink: 0
    }
  }, meta), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: `1px solid ${track}`,
      background: "none",
      color: fg,
      flexShrink: 0,
      cursor: "pointer"
    }
  }, "\u25B6"));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/core/SiteHeader.jsx
try { (() => {
function SiteHeader() {
  const navLinks = ["About ISM", "Resources", "Global Network", "Join The Mission", "Contact"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 32px",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/Logo Black.svg",
    style: {
      height: 34,
      filter: "brightness(0) invert(1)"
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 32,
      color: "#fff",
      fontSize: 15
    }
  }, navLinks.map(l => /*#__PURE__*/React.createElement("span", {
    key: l
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#fff",
      color: "#000",
      borderRadius: 999,
      padding: "10px 18px",
      fontSize: 14,
      fontWeight: 600
    }
  }, "\u2665 Give"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff",
      fontSize: 22,
      lineHeight: 1
    }
  }, "\u2630")));
}
Object.assign(__ds_scope, { SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dot-bible-app/HomeScreen.jsx
try { (() => {
function HomeScreen() {
  const blue = "linear-gradient(160deg,#1a4fd6 0%,#3f6fe0 40%,#8a6fe0 70%,#f0b26a 100%)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0b0c0d",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      minHeight: "100%",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontWeight: 700,
      fontSize: 17
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, "\u2733"), " dot.Bible"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2315"), /*#__PURE__*/React.createElement("span", null, "\u2261"))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "6px 16px 20px",
      borderRadius: 20,
      height: 170,
      background: blue,
      position: "relative",
      overflow: "hidden",
      padding: 20,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.85
    }
  }, "\xB7 \xB7"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 24,
      marginTop: 30,
      lineHeight: 1.15
    }
  }, "The Word of God"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      letterSpacing: "0.14em",
      opacity: 0.85,
      marginTop: 4
    }
  }, "AT YOUR FINGERTIPS")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      padding: "0 16px",
      marginBottom: 20
    }
  }, ["The Old Testament", "The New Testament"].map(t => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      height: 190,
      borderRadius: 16,
      background: "linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.75)), linear-gradient(135deg,#2a3550,#4a3a55)",
      padding: 14,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "flex-end",
      background: "rgba(255,255,255,.92)",
      color: "#000",
      fontSize: 12,
      fontWeight: 600,
      padding: "6px 10px",
      borderRadius: 999
    }
  }, "Explore \u2197"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 16
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      marginBottom: 20,
      fontSize: 13,
      color: "rgba(255,255,255,.75)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Share the Bible with a Friend"), /*#__PURE__*/React.createElement("span", {
    style: {
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 999,
      padding: "6px 12px"
    }
  }, "Send Invite \u25B7")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 16px 20px",
      borderRadius: 20,
      background: "linear-gradient(135deg,#f0c98a,#c7a8e8 60%,#6f8fe0)",
      color: "#111",
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.2
    }
  }, "Audio Bible Companion"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      marginTop: 6,
      opacity: 0.8
    }
  }, "Every Book. Every Chapter. Anywhere in the world."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginTop: 12,
      border: "1px solid rgba(0,0,0,.4)",
      borderRadius: 999,
      padding: "8px 14px",
      fontSize: 12,
      fontWeight: 600
    }
  }, "Start Listening \u2197")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      marginBottom: 6,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, "Trending Audio Teaching"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "rgba(255,255,255,.6)"
    }
  }, "Browse All")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px"
    }
  }, [["John 3:17-4:54", "9:12"], ["Romans 8:18-8:39", "9:12"], ["John 3:17-4:54", "9:12"]].map(([t, m], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "rgba(255,255,255,.08)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginBottom: 6
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      borderRadius: 2,
      background: "rgba(255,255,255,.18)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "30%",
      height: 3,
      borderRadius: 2,
      background: "var(--horizon-blue)"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,.5)"
    }
  }, m), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10
    }
  }, "\u25B6")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      marginBottom: 10
    }
  }, "New Testament Studies"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      overflowX: "auto"
    }
  }, [["the GOSPELS", "#7a2020"], ["ROMANS", "#1f2a4a"], ["MATTHEW", "#7a4a20"]].map(([t, c], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      minWidth: 100,
      height: 140,
      borderRadius: 10,
      background: c,
      flexShrink: 0,
      position: "relative",
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 8,
      left: 8,
      right: 8,
      fontSize: 12,
      fontWeight: 700,
      color: "#fff"
    }
  }, t))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dot-bible-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dot-bible-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dot-bible-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-email/EmailParts.jsx
try { (() => {
function EmailShell({
  dark,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 480,
      margin: "0 auto",
      background: dark ? "#12131a" : "#fff",
      fontFamily: "var(--font-sans)",
      color: dark ? "#fff" : "#000"
    }
  }, children);
}
function EmailHeader({
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 24px 0",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/Full Logo Black.svg",
    style: {
      height: 34,
      filter: dark ? "invert(1)" : "none",
      opacity: dark ? 0.9 : 1
    }
  }));
}
function EmailFooter({
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? "#0e0f10" : "#f4f4f4",
      padding: "28px 24px",
      textAlign: "center",
      fontSize: 12,
      color: dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 16,
      marginBottom: 16
    }
  }, ["Find a Radio Station", "Download the App", "Invite a Friend"].map(t => /*#__PURE__*/React.createElement("span", {
    key: t
  }, t))), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/Logo Black.svg",
    style: {
      height: 24,
      filter: dark ? "invert(1)" : "none",
      marginBottom: 12,
      opacity: .7
    }
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", null, "Box 7100, Pasadena, California 91109-7100"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, "Update preferences | Unsubscribe"));
}
function QuoteBlock({
  text,
  citation
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff9ec",
      padding: "40px 20px",
      margin: "24px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid #eeab47",
      borderRight: "1px solid #eeab47",
      borderBottom: "1px solid #eeab47",
      borderLeft: "6px solid #eeab47",
      padding: "24px 32px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontStyle: "italic",
      fontSize: 17,
      lineHeight: 1.5,
      color: "#000"
    }
  }, text), citation && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontSize: 14,
      fontWeight: 600,
      color: "#000"
    }
  }, citation)));
}
function StepCard({
  number,
  title,
  body
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      background: "#fff",
      border: "1px solid rgba(0,0,0,.08)",
      borderRadius: 12,
      padding: "24px 24px 24px 8px",
      margin: "0 0 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: "var(--horizon-blue)",
      flexShrink: 0,
      width: 32,
      textAlign: "center"
    }
  }, number), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: "rgba(0,0,0,.7)"
    }
  }, body)));
}
function IconStepRow({
  icon,
  title,
  body,
  cta
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      margin: "0 0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "var(--horizon-blue)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontSize: 18
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      marginBottom: 6
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: "rgba(0,0,0,.65)",
      marginBottom: 10
    }
  }, body), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 14px",
      borderRadius: 999,
      background: "var(--horizon-blue)",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700
    }
  }, cta, " \u2197")));
}
function SignOff({
  line = "Until all have heard,",
  title = "President"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 16,
      marginBottom: 6
    }
  }, line), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Miss Noteworthy', cursive",
      fontSize: 22,
      marginBottom: 2
    }
  }, "Troy Carl"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontStyle: "italic",
      fontSize: 14
    }
  }, title));
}
function DarkFooter() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#20242b",
      color: "#fff",
      padding: "32px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/Full Logo Black.svg",
    style: {
      height: 34,
      filter: "brightness(0) invert(1)",
      marginBottom: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      lineHeight: 1.7,
      opacity: 0.85
    }
  }, "INTERNATIONAL SCRIPTURE MINISTRIES", /*#__PURE__*/React.createElement("br", null), "PO BOX 24253", /*#__PURE__*/React.createElement("br", null), "BOONE, IA 50950-0400", /*#__PURE__*/React.createElement("br", null), "1-833-60-BIBLE (24253) | contact@ism.bible"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 12,
      margin: "16px 0"
    }
  }, ["f", "◐", "in"].map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 26,
      height: 26,
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11
    }
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      opacity: 0.6,
      lineHeight: 1.6
    }
  }, "You are receiving this email because you asked to receive updates from ISM or have an existing relationship with our ministry.", /*#__PURE__*/React.createElement("br", null), "Manage email preferences | Unsubscribe | Privacy"));
}
window.EmailShell = EmailShell;
window.EmailHeader = EmailHeader;
window.EmailFooter = EmailFooter;
window.QuoteBlock = QuoteBlock;
window.StepCard = StepCard;
window.IconStepRow = IconStepRow;
window.SignOff = SignOff;
window.DarkFooter = DarkFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-email/EmailParts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/HeroSections.jsx
try { (() => {
function HeroSection({
  eyebrow,
  title,
  body,
  checks,
  cta,
  secondary,
  image,
  logoBar = true
}) {
  const SiteHeader = window.SiteHeader;
  return /*#__PURE__*/React.createElement("div", null, logoBar && /*#__PURE__*/React.createElement(SiteHeader, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "#000",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      minHeight: 520,
      display: "flex",
      alignItems: "center",
      overflow: "hidden"
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(90deg,#000 0%,#000 28%,rgba(0,0,0,.55) 52%,rgba(4,20,50,.55) 100%), url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }), !image && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(160deg,#000 0%,#0a0e1a 55%,#0d1b3f 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      maxWidth: 640,
      padding: "64px 64px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginBottom: 24,
      padding: "8px 16px",
      border: "1px solid rgba(80,140,255,.8)",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#4474D0"
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 20px",
      fontSize: 52,
      fontWeight: 700,
      lineHeight: 1.1
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 24px",
      fontSize: 19,
      lineHeight: 1.6,
      color: "rgba(255,255,255,.75)",
      maxWidth: 520
    }
  }, body), checks && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px 24px",
      marginBottom: 28,
      fontSize: 15,
      color: "rgba(255,255,255,.75)"
    }
  }, checks.map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, "\u2713 ", c))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid #fff",
      borderRadius: 9999,
      padding: "14px 24px",
      fontSize: 16,
      width: "fit-content"
    }
  }, cta, " \u2197"), secondary && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "rgba(255,255,255,.65)"
    }
  }, secondary)))));
}
window.HeroSection = HeroSection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/HeroSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Sections.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0b0d18",
      color: "#fff",
      textAlign: "center",
      padding: "90px 24px 60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 20px",
      fontSize: 56,
      fontWeight: 600,
      lineHeight: 1.2,
      textTransform: "uppercase",
      backgroundImage: "linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  }, "Help Us Deliver the Bible Where It's Never Gone Before"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 auto 28px",
      maxWidth: 640,
      fontSize: 20,
      lineHeight: 1.5,
      opacity: 0.9
    }
  }, "Our mission is to make scripture accessible to everyone, everywhere, every stream."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid #fff",
      padding: "12px 20px",
      borderRadius: 9999,
      fontSize: 16
    }
  }, "Submit Partner Inquiry \u2197")));
}
function VideoBanner() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto -60px",
      position: "relative",
      zIndex: 2,
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      boxShadow: "0 12px 30px rgba(0,0,0,.45)",
      aspectRatio: "16/8.5",
      backgroundImage: "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://braze-images.com/appboy/communication/assets/image_assets/images/6a6abbb54dd79d00842b3b41/original.png?1785379763')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      color: "#fff"
    }
  }, "\u25B6")));
}
function TogetherBanner() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 100,
      paddingTop: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundImage: "linear-gradient(rgba(11,13,24,.35),rgba(11,13,24,.75)), url('https://braze-images.com/appboy/communication/assets/image_assets/images/6a63c7ac38dac500a1d9e2f0/original.png?1784924075')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "110px 24px 70px",
      textAlign: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 20px",
      fontSize: 26,
      fontWeight: 500,
      maxWidth: 700,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }, "Together, We're Making the Bible Unstoppable."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 auto",
      maxWidth: 580,
      fontSize: 16,
      lineHeight: 1.7,
      opacity: 0.85
    }
  }, "When you become a partner with ISM, you help millions experience God's Word in their heart language\u2014encountering Him more deeply and personally. Together, we're breaking barriers so the Bible can reach everyone, everywhere.")));
}
function WhyPartner() {
  const items = [["globe.svg", "Global Reach", "Reaching over 2.5 billion people through radio, digital platforms, and global partner networks."], ["download.svg", "FaithTech Innovation", "Using AI, mobile apps, radio, publishing, and emerging technology to advance Bible distribution."], ["folded-hands.svg", "Unreached Focus", "Prioritizing the world's most unreached people and languages with little or no access to Scripture."], ["share-outreach.svg", "Collaborative Impact", "Partnering with ministries like THRU the BIBLE, KWAVE, KLOVE, and Bible societies to expand reach and impact."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#0b0d18",
      color: "#fff",
      padding: "20px 24px 60px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginBottom: 20,
      padding: "6px 10px",
      border: "1px solid rgba(80,140,255,.8)",
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#4474D0",
      background: "rgba(255,255,255,.08)"
    }
  }, "Partner With Us"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 24px",
      fontSize: 26,
      fontWeight: 500
    }
  }, "Why Partner with ISM"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 40px",
      fontSize: 16,
      lineHeight: 1.7,
      opacity: 0.75,
      maxWidth: 720,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }, "Partnering with ISM means joining an expanding, global bible network delivering the Bible without barriers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 32,
      justifyContent: "center",
      textAlign: "left"
    }
  }, items.map(([icon, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: "1 1 360px",
      minWidth: 280,
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: "rgba(255,255,255,.06)",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/" + icon,
    style: {
      width: 26,
      height: 26,
      filter: "brightness(0) invert(1)"
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 8px",
      fontSize: 20,
      fontWeight: 500
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      lineHeight: 1.8,
      opacity: 0.85
    }
  }, d)))))));
}
function GbnGrid() {
  const cards = [["DOT.BIBLE APPS", "ISM Bible Apps", "ISM's Bible Apps deliver Scripture and teaching content in hundreds of languages, making it easy to read, listen, and share with others."], ["RADIO BROADCASTS", "ISM Radio: The Sojourner Project", "Through HD radio and streaming broadcasts, ISM Radio delivers the Bible 24/7 in multiple languages—even where apps cannot go."], ["PUBLICATIONS", "ISM Publishing", "Distributing Bibles and resources via Amazon, Kindle, and global print-on-demand—preserving indigenous languages and strengthening communities of faith."], ["TAP & PROCLAIM", "ISM TAP Cards", "With a single tap, our Tap Cards connect to the Global Bible Network, with access to available languages in multiple formats."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#05060c",
      padding: "70px 24px",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 32
    }
  }, cards.map(([tag, title, body]) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      position: "relative",
      height: 340,
      borderRadius: 16,
      overflow: "hidden",
      backgroundImage: "linear-gradient(160deg,#141c33,#241d33)",
      display: "flex",
      alignItems: "flex-end",
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginBottom: 14,
      padding: "7px 12px",
      border: "1px solid rgba(86,130,255,.75)",
      borderRadius: 4,
      background: "rgba(10,14,28,.6)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#6f96f5"
    }
  }, tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 10px",
      fontSize: 22,
      fontWeight: 500
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.7,
      opacity: 0.85,
      maxWidth: 420
    }
  }, body))))));
}
function PartnerPathway() {
  const steps = [["1", "Engage", "Complete a short form and receive additional Partner resources to start the process. We'll connect personally to explore your ministry's vision and how ISM can equip you to reach more people with Scripture."], ["2", "Equip", "As you invest in Bible access, we'll equip you with tools to make impact tangible—TAP Cards, radio resources, Bible apps, and publishing assets that put God's Word directly into the hands of those who've never had it."], ["3", "Expand", "Together, we'll expand Bible access to new languages and regions through technology, innovation, and prayer—breaking barriers so the Bible can go where it's never been."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#0b0d18",
      color: "#fff",
      padding: "70px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 2,
      margin: "0 auto 32px",
      borderRadius: 999,
      backgroundImage: "linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginBottom: 16,
      padding: "6px 10px",
      border: "1px solid rgba(80,140,255,.8)",
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#4474D0",
      background: "rgba(255,255,255,.08)"
    }
  }, "ISM Partner Pathway"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 auto 16px",
      fontSize: 26,
      fontWeight: 600,
      maxWidth: 780
    }
  }, "A simple three-step journey to join the mission of global Bible access."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 auto 48px",
      maxWidth: 680,
      fontSize: 16,
      lineHeight: 1.7,
      opacity: 0.85
    }
  }, "Partnering with ISM means combining the heart of the Church with the tools of technology. We merge innovation and the Great Commission\u2014empowering ministries to reach people where traditional methods cannot."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 32,
      maxWidth: 1200,
      margin: "0 auto",
      flexWrap: "wrap",
      justifyContent: "center"
    }
  }, steps.map(([n, t, d]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      position: "relative",
      flex: "1 1 320px",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 24,
      background: "rgba(255,255,255,.03)",
      padding: "56px 24px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -36,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: 35,
      fontWeight: 600,
      backgroundImage: "linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 16px",
      fontSize: 22,
      fontWeight: 500
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 16,
      lineHeight: 1.75,
      color: "#a6b1bb"
    }
  }, d)))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      border: "1px solid #fff",
      padding: "12px 20px",
      borderRadius: 9999,
      fontSize: 16,
      marginTop: 56
    }
  }, "Submit Partner Inquiry \u2197"));
}
function Faq() {
  const qs = [["What is ISM's mission?", "ISM exists to make Scripture accessible to everyone, everywhere—leveraging modern technology, media, and partnerships to deliver the Bible to every language and every person."], ["How does ISM ensure accuracy and faithfulness in its Bible content?", "We work with trusted Bible translation and media partners to ensure every broadcast, app, and publication reflects accurate Scripture and sound theology."], ["Are you a non-profit organization?", "Yes. ISM is a registered 501(c)(3) nonprofit ministry supported by donations, sponsorships, and partnerships that help expand Bible access globally."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#0b0d18",
      color: "#fff",
      padding: "0 24px 80px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 2,
      margin: "0 auto 32px",
      borderRadius: 999,
      backgroundImage: "linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      marginBottom: 16,
      padding: "6px 10px",
      border: "1px solid rgba(80,140,255,.8)",
      fontSize: 12,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "#4474D0",
      background: "rgba(255,255,255,.08)"
    }
  }, "FAQs"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 32px",
      fontSize: 22,
      fontWeight: 500
    }
  }, "Questions About ISM?"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "left"
    }
  }, qs.map(([q, a]) => /*#__PURE__*/React.createElement("details", {
    key: q,
    style: {
      margin: "0 0 12px",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 16,
      background: "rgba(255,255,255,.03)",
      padding: "16px 20px"
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      cursor: "pointer",
      fontSize: 16,
      fontWeight: 600,
      listStyle: "none"
    }
  }, q), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontSize: 16,
      lineHeight: 1.75,
      opacity: 0.85
    }
  }, a))))));
}
window.Hero = Hero;
window.VideoBanner = VideoBanner;
window.TogetherBanner = TogetherBanner;
window.WhyPartner = WhyPartner;
window.GbnGrid = GbnGrid;
window.PartnerPathway = PartnerPathway;
window.Faq = Faq;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.AccentBar = __ds_scope.AccentBar;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
