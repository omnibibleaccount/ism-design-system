function HomeScreen() {
  const blue = "linear-gradient(160deg,#1a4fd6 0%,#3f6fe0 40%,#8a6fe0 70%,#f0b26a 100%)";
  return (
    <div style={{ background: "#0b0c0d", color: "#fff", fontFamily: "var(--font-sans)", minHeight: "100%", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 17 }}>
          <span style={{ fontSize: 20 }}>✳</span> dot.Bible
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 18 }}><span>⌕</span><span>≡</span></div>
      </div>

      <div style={{ margin: "6px 16px 20px", borderRadius: 20, height: 170, background: blue, position: "relative", overflow: "hidden", padding: 20, boxSizing: "border-box" }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>· ·</div>
        <div style={{ fontWeight: 600, fontSize: 24, marginTop: 30, lineHeight: 1.15 }}>The Word of God</div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", opacity: 0.85, marginTop: 4 }}>AT YOUR FINGERTIPS</div>
      </div>

      <div style={{ display: "flex", gap: 12, padding: "0 16px", marginBottom: 20 }}>
        {["The Old Testament", "The New Testament"].map((t) => (
          <div key={t} style={{ flex: 1, height: 190, borderRadius: 16, background: "linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.75)), linear-gradient(135deg,#2a3550,#4a3a55)", padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ alignSelf: "flex-end", background: "rgba(255,255,255,.92)", color: "#000", fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 999 }}>Explore ↗</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 20, fontSize: 13, color: "rgba(255,255,255,.75)" }}>
        <span>Share the Bible with a Friend</span>
        <span style={{ border: "1px solid rgba(255,255,255,.4)", borderRadius: 999, padding: "6px 12px" }}>Send Invite ▷</span>
      </div>

      <div style={{ margin: "0 16px 20px", borderRadius: 20, background: "linear-gradient(135deg,#f0c98a,#c7a8e8 60%,#6f8fe0)", color: "#111", padding: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 20, lineHeight: 1.2 }}>Audio Bible Companion</div>
        <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>Every Book. Every Chapter. Anywhere in the world.</div>
        <span style={{ display: "inline-block", marginTop: 12, border: "1px solid rgba(0,0,0,.4)", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontWeight: 600 }}>Start Listening ↗</span>
      </div>

      <div style={{ padding: "0 16px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Trending Audio Teaching</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Browse All</span>
      </div>
      <div style={{ padding: "0 16px" }}>
        {[["John 3:17-4:54","9:12"],["Romans 8:18-8:39","9:12"],["John 3:17-4:54","9:12"]].map(([t,m],i)=>(
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, marginBottom: 6 }}>{t}</div>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,.18)" }}><div style={{ width: "30%", height: 3, borderRadius: 2, background: "var(--horizon-blue)" }} /></div>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>{m}</span>
            <span style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>▶</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 16px 32px" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>New Testament Studies</div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
          {[["the GOSPELS","#7a2020"],["ROMANS","#1f2a4a"],["MATTHEW","#7a4a20"]].map(([t,c],i)=>(
            <div key={i} style={{ minWidth: 100, height: 140, borderRadius: 10, background: c, flexShrink: 0, position: "relative", padding: 8 }}>
              <span style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontSize: 12, fontWeight: 700, color: "#fff" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.HomeScreen = HomeScreen;
