import React from "react";

const navCols = [
  { title: "ABOUT", links: ["About ISM", "Our Mission", "Our Team", "Statement of Faith", "FAQ's"] },
  { title: "PLATFORMS", links: ["dot.Bible App", "ISM Radio", "ISM Publishing", "TAP Cards"] },
  { title: "GET INVOLVED", links: ["Give Online", "Join The Mission", "Partner With Us", "Contact"] },
];

const socialIcons = {
  instagram: "M16.0034 9.02616C12.1441 9.02616 9.03129 12.1398 9.03129 15.9999C9.03129 19.86 12.1441 22.9736 16.0034 22.9736C19.8627 22.9736 22.9756 19.86 22.9756 15.9999C22.9756 12.1398 19.8627 9.02616 16.0034 9.02616ZM16.0034 20.5337C13.5095 20.5337 11.4706 18.5005 11.4706 15.9999C11.4706 13.4993 13.5034 11.4661 16.0034 11.4661C18.5035 11.4661 20.5363 13.4993 20.5363 15.9999C20.5363 18.5005 18.4974 20.5337 16.0034 20.5337ZM24.887 8.74087C24.887 9.64526 24.1589 10.3675 23.2608 10.3675C22.3567 10.3675 21.6346 9.63916 21.6346 8.74087C21.6346 7.84267 22.3628 7.11433 23.2608 7.11433C24.1589 7.11433 24.887 7.84267 24.887 8.74087ZM29.5048 10.3918C29.4017 8.21289 28.9041 6.28277 27.3082 4.69264C25.7183 3.10244 23.7887 2.60474 21.6103 2.4955C19.3652 2.36804 12.6357 2.36804 10.3905 2.4955C8.21811 2.59868 6.2885 3.09636 4.69263 4.68654C3.09667 6.27676 2.60519 8.20679 2.49596 10.3857C2.36853 12.6313 2.36853 19.3623 2.49596 21.608C2.59912 23.7869 3.09667 25.717 4.69263 27.3071C6.2885 28.8973 8.2121 29.395 10.3905 29.5043C12.6357 29.6318 19.3652 29.6318 21.6103 29.5043C23.7887 29.4011 25.7183 28.9034 27.3082 27.3071C28.8981 25.717 29.3956 23.7869 29.5048 21.608C29.6322 19.3623 29.6322 12.6374 29.5048 10.3918ZM26.6043 24.0176C26.131 25.2071 25.2147 26.1236 24.0194 26.6031C22.2293 27.3132 17.9816 27.1494 16.0034 27.1494C14.0252 27.1494 9.77157 27.3071 7.98758 26.6031C6.79816 26.1297 5.88196 25.2132 5.40252 24.0176C4.69263 22.2271 4.85645 17.9785 4.85645 15.9999C4.85645 14.0213 4.69864 9.76661 5.40252 7.98222C5.87586 6.79263 6.79216 5.87613 7.98758 5.39668C9.77757 4.68654 14.0252 4.8504 16.0034 4.8504C17.9816 4.8504 22.2353 4.69264 24.0194 5.39668C25.2087 5.87013 26.1249 6.78653 26.6043 7.98222C27.3143 9.7727 27.1504 14.0213 27.1504 15.9999C27.1504 17.9785 27.3143 22.2332 26.6043 24.0176Z",
  facebook: "M29.6004 16.0827C29.6004 8.52408 23.5133 2.3999 16.0004 2.3999C8.48747 2.3999 2.40039 8.52408 2.40039 16.0827C2.40039 22.9119 7.37373 28.5726 13.8754 29.5999V20.038H10.4205V16.0827H13.8754V13.068C13.8754 9.63905 15.9044 7.74505 19.0121 7.74505C20.5005 7.74505 22.0567 8.01205 22.0567 8.01205V11.3776H20.3414C18.6523 11.3776 18.1254 12.4325 18.1254 13.5144V16.0827H21.8972L21.294 20.038H18.1254V29.5999C24.6271 28.5726 29.6004 22.9119 29.6004 16.0827Z",
  x: "M18.5871 13.9175L28.713 2.40015H26.3135L17.5212 12.4005L10.4988 2.40015H2.39941L13.0186 17.5224L2.39941 29.6001H4.79909L14.0839 19.0395L21.5 29.6001H29.5994L18.5871 13.9175ZM15.3005 17.6556L14.2245 16.1498L5.66369 4.16769H9.34938L16.2581 13.8377L17.334 15.3435L26.3146 27.9129H22.6289L15.3005 17.6556Z",
  linkedin: "M444.17 32H70.28C49.85 32 32 46.7 32 66.89v374.72C32 461.91 49.85 480 70.28 480h373.78c20.54 0 35.94-18.21 35.94-38.39V66.89C480.12 46.7 464.6 32 444.17 32zm-273.3 373.43h-64.18V205.88h64.18zM141 175.54h-.46c-20.54 0-33.84-15.29-33.84-34.43 0-19.49 13.65-34.42 34.65-34.42s33.85 14.82 34.31 34.42c-.01 19.14-13.31 34.43-34.66 34.43zm264.43 229.89h-64.18V296.32c0-26.14-9.34-44-32.56-44-17.74 0-28.24 12-32.91 23.69-1.75 4.2-2.22 9.92-2.22 15.76v113.66h-64.18V205.88h64.18v27.77c9.34-13.3 23.93-32.44 57.88-32.44 42.13 0 74 27.77 74 87.64z",
};
const socialViewBox = { instagram: 32, facebook: 32, x: 32, linkedin: 512 };
function SocialRing({ name }) {
  const box = socialViewBox[name];
  return (
    <span style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox={`0 0 ${box} ${box}`} width={17} height={17} fill="#fff"><path d={socialIcons[name]} /></svg>
    </span>
  );
}

export function Footer({ ctaText = "Help deliver the Bible beyond every barrier.", ctaLabel = "Support Bible Access" }) {
  return (
    <footer style={{ position: "relative", background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(4,109,227,0.30), transparent 70%), radial-gradient(ellipse 45% 40% at 85% 10%, rgba(243,178,90,0.16), transparent 70%), #000", color: "#fff", fontFamily: "var(--font-sans)", paddingTop: 50 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ margin: "32px auto", padding: "32px 16px", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderRadius: 15, border: "1px solid transparent", backgroundImage: "linear-gradient(#000,#000), linear-gradient(90deg,#046de3,#8f7de0 55%,#f3b25a 100%)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box" }}>
          <h2 style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3, margin: 0, color: "#fff" }}>{ctaText}</h2>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #fff", padding: "12px 20px", borderRadius: 9999, fontSize: 16, color: "#fff", whiteSpace: "nowrap" }}>{ctaLabel} ↗</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, padding: "32px 0 48px", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 390, flex: "1 1 320px" }}>
            <img src="../../assets/logos/Full Logo Black.svg" style={{ display: "block", width: "min(100%,285px)", height: "auto", filter: "brightness(0) invert(1)" }} />
            <p style={{ margin: "22px 0 26px", maxWidth: "36rem", color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.75 }}>Delivering unhindered access to the Bible until everyone can engage with Scripture in their own language, without barriers.</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <SocialRing name="instagram" /><SocialRing name="facebook" /><SocialRing name="x" /><SocialRing name="linkedin" />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 56, flex: "2 1 430px" }}>
            {navCols.map((col) => (
              <div key={col.title} style={{ minWidth: 115 }}>
                <h3 style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase" }}>{col.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0, fontSize: 13, fontWeight: 600, lineHeight: 2.15, color: "#ffffff" }}>
                  {col.links.map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,.14)" }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 32, padding: "22px 0 4px", color: "rgba(255,255,255,0.5)", fontSize: 11, lineHeight: 1.6 }}>
          <div>
            <p style={{ margin: "0 0 3px" }}>© 2026 – International Scripture Ministries Inc</p>
            <p style={{ margin: 0 }}>ISM is a 501(c)(3) nonprofit organization. All donations are tax-deductible.</p>
          </div>
          <div style={{ whiteSpace: "nowrap" }}>Cookie Policy&nbsp;|&nbsp;Terms&nbsp;|&nbsp;Privacy</div>
        </div>
      </div>
    </footer>
  );
}
