function HeroSection({eyebrow, title, body, checks, cta, secondary, image, logoBar=true}){
  const SiteHeader = window.SiteHeader;
  return (
    <div>
      {logoBar && <SiteHeader/>}
      <div style={{position:"relative",background:"#000",color:"#fff",fontFamily:"var(--font-sans)",minHeight:520,display:"flex",alignItems:"center",overflow:"hidden"}}>
        {image && <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(90deg,#000 0%,#000 28%,rgba(0,0,0,.55) 52%,rgba(4,20,50,.55) 100%), url(${image})`,backgroundSize:"cover",backgroundPosition:"center"}}/>}
        {!image && <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#000 0%,#0a0e1a 55%,#0d1b3f 100%)"}}/>}
        <div style={{position:"relative",zIndex:1,maxWidth:640,padding:"64px 64px",boxSizing:"border-box"}}>
          <span style={{display:"inline-block",marginBottom:24,padding:"8px 16px",border:"1px solid rgba(80,140,255,.8)",fontSize:13,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#4474D0"}}>{eyebrow}</span>
          <h1 style={{margin:"0 0 20px",fontSize:52,fontWeight:700,lineHeight:1.1}}>{title}</h1>
          <p style={{margin:"0 0 24px",fontSize:19,lineHeight:1.6,color:"rgba(255,255,255,.75)",maxWidth:520}}>{body}</p>
          {checks && <div style={{display:"flex",flexWrap:"wrap",gap:"6px 24px",marginBottom:28,fontSize:15,color:"rgba(255,255,255,.75)"}}>
            {checks.map(c=><span key={c} style={{display:"flex",alignItems:"center",gap:6}}>✓ {c}</span>)}
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:6,border:"1px solid #fff",borderRadius:9999,padding:"14px 24px",fontSize:16,width:"fit-content"}}>{cta} ↗</span>
            {secondary && <span style={{fontSize:14,color:"rgba(255,255,255,.65)"}}>{secondary}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
window.HeroSection = HeroSection;
