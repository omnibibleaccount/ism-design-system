function EmailShell({ dark, children }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: dark ? "#12131a" : "#fff", fontFamily: "var(--font-sans)", color: dark ? "#fff" : "#000" }}>
      {children}
    </div>
  );
}
function EmailHeader({ dark }) {
  return (
    <div style={{ padding: "24px 24px 0", textAlign: "center" }}>
      <img src="../../assets/logos/Full Logo Black.svg" style={{ height: 34, filter: dark ? "invert(1)" : "none", opacity: dark ? 0.9 : 1 }} />
    </div>
  );
}
function EmailFooter({ dark }) {
  return (
    <div style={{ background: dark ? "#0e0f10" : "#f4f4f4", padding: "28px 24px", textAlign: "center", fontSize: 12, color: dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.55)" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
        {["Find a Radio Station","Download the App","Invite a Friend"].map(t=> <span key={t}>{t}</span>)}
      </div>
      <img src="../../assets/logos/Logo Black.svg" style={{ height: 24, filter: dark ? "invert(1)" : "none", marginBottom: 12, opacity: .7 }} /><br/>
      <div>Box 7100, Pasadena, California 91109-7100</div>
      <div style={{ marginTop: 8 }}>Update preferences | Unsubscribe</div>
    </div>
  );
}
function QuoteBlock({ text, citation }) {
  return (
    <div style={{ background: "#fff9ec", padding: "40px 20px", margin: "24px 0" }}>
      <div style={{ borderTop: "1px solid #eeab47", borderRight: "1px solid #eeab47", borderBottom: "1px solid #eeab47", borderLeft: "6px solid #eeab47", padding: "24px 32px" }}>
        <p style={{ margin: 0, fontStyle: "italic", fontSize: 17, lineHeight: 1.5, color: "#000" }}>{text}</p>
        {citation && <p style={{ margin: "10px 0 0", fontSize: 14, fontWeight: 600, color: "#000" }}>{citation}</p>}
      </div>
    </div>
  );
}
function StepCard({ number, title, body }) {
  return (
    <div style={{ display: "flex", gap: 16, background: "#fff", border: "1px solid rgba(0,0,0,.08)", borderRadius: 12, padding: "24px 24px 24px 8px", margin: "0 0 16px" }}>
      <span style={{ fontSize: 26, fontWeight: 700, color: "var(--horizon-blue)", flexShrink: 0, width: 32, textAlign: "center" }}>{number}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(0,0,0,.7)" }}>{body}</div>
      </div>
    </div>
  );
}
function IconStepRow({ icon, title, body, cta }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", margin: "0 0 28px" }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--horizon-blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,.65)", marginBottom: 10 }}>{body}</div>
        <span style={{ display: "inline-flex", alignItems: "center", padding: "8px 14px", borderRadius: 999, background: "var(--horizon-blue)", color: "#fff", fontSize: 12, fontWeight: 700 }}>{cta} ↗</span>
      </div>
    </div>
  );
}
function SignOff({ line = "Until all have heard,", title = "President" }) {
  return (
    <div style={{ margin: "24px 0" }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{line}</div>
      <div style={{ fontFamily: "'Miss Noteworthy', cursive", fontSize: 22, marginBottom: 2 }}>Troy Carl</div>
      <div style={{ fontStyle: "italic", fontSize: 14 }}>{title}</div>
    </div>
  );
}
function DarkFooter() {
  return (
    <div style={{ background: "#20242b", color: "#fff", padding: "32px 24px", textAlign: "center" }}>
      <img src="../../assets/logos/Full Logo Black.svg" style={{ height: 34, filter: "brightness(0) invert(1)", marginBottom: 14 }} />
      <div style={{ fontSize: 11, lineHeight: 1.7, opacity: 0.85 }}>
        INTERNATIONAL SCRIPTURE MINISTRIES<br/>PO BOX 24253<br/>BOONE, IA 50950-0400<br/>
        1-833-60-BIBLE (24253) | contact@ism.bible
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, margin: "16px 0" }}>
        {["f","◐","in"].map((s,i)=><span key={i} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{s}</span>)}
      </div>
      <div style={{ fontSize: 10, opacity: 0.6, lineHeight: 1.6 }}>
        You are receiving this email because you asked to receive updates from ISM or have an existing relationship with our ministry.<br/>
        Manage email preferences | Unsubscribe | Privacy
      </div>
    </div>
  );
}
window.EmailShell = EmailShell; window.EmailHeader = EmailHeader; window.EmailFooter = EmailFooter;
window.QuoteBlock = QuoteBlock; window.StepCard = StepCard; window.IconStepRow = IconStepRow; window.SignOff = SignOff; window.DarkFooter = DarkFooter;
