function Hero(){
  return (
    <div style={{background:"#0b0d18",color:"#fff",textAlign:"center",padding:"90px 24px 60px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <h1 style={{margin:"0 0 20px",fontSize:56,fontWeight:600,lineHeight:1.2,textTransform:"uppercase",backgroundImage:"linear-gradient(90deg,#4a65ff,#7aa2ff 45%,#e3b39a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Help Us Deliver the Bible Where It's Never Gone Before</h1>
        <p style={{margin:"0 auto 28px",maxWidth:640,fontSize:20,lineHeight:1.5,opacity:0.9}}>Our mission is to make scripture accessible to everyone, everywhere, every stream.</p>
        <span style={{display:"inline-flex",alignItems:"center",gap:6,border:"1px solid #fff",padding:"12px 20px",borderRadius:9999,fontSize:16}}>Submit Partner Inquiry ↗</span>
      </div>
    </div>
  );
}
function VideoBanner(){
  return (
    <div style={{maxWidth:1100,margin:"0 auto -60px",position:"relative",zIndex:2,padding:"0 20px"}}>
      <div style={{position:"relative",overflow:"hidden",borderRadius:20,boxShadow:"0 12px 30px rgba(0,0,0,.45)",aspectRatio:"16/8.5",backgroundImage:"linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://braze-images.com/appboy/communication/assets/image_assets/images/6a6abbb54dd79d00842b3b41/original.png?1785379763')",backgroundSize:"cover",backgroundPosition:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{width:64,height:64,borderRadius:"50%",border:"1px solid rgba(255,255,255,.7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff"}}>▶</span>
      </div>
    </div>
  );
}
function TogetherBanner(){
  return (
    <div style={{marginBottom:100,paddingTop:120}}>
      <div style={{backgroundImage:"linear-gradient(rgba(11,13,24,.35),rgba(11,13,24,.75)), url('https://braze-images.com/appboy/communication/assets/image_assets/images/6a63c7ac38dac500a1d9e2f0/original.png?1784924075')",backgroundSize:"cover",backgroundPosition:"center",padding:"110px 24px 70px",textAlign:"center",color:"#fff"}}>
        <h2 style={{margin:"0 0 20px",fontSize:26,fontWeight:500,maxWidth:700,marginLeft:"auto",marginRight:"auto"}}>Together, We're Making the Bible Unstoppable.</h2>
        <p style={{margin:"0 auto",maxWidth:580,fontSize:16,lineHeight:1.7,opacity:0.85}}>When you become a partner with ISM, you help millions experience God's Word in their heart language—encountering Him more deeply and personally. Together, we're breaking barriers so the Bible can reach everyone, everywhere.</p>
      </div>
    </div>
  );
}
function WhyPartner(){
  const items=[["globe.svg","Global Reach","Reaching over 2.5 billion people through radio, digital platforms, and global partner networks."],["download.svg","FaithTech Innovation","Using AI, mobile apps, radio, publishing, and emerging technology to advance Bible distribution."],["folded-hands.svg","Unreached Focus","Prioritizing the world's most unreached people and languages with little or no access to Scripture."],["share-outreach.svg","Collaborative Impact","Partnering with ministries like THRU the BIBLE, KWAVE, KLOVE, and Bible societies to expand reach and impact."]];
  return (
    <section style={{background:"#0b0d18",color:"#fff",padding:"20px 24px 60px",textAlign:"center"}}>
      <div style={{maxWidth:980,margin:"0 auto"}}>
        <span style={{display:"inline-block",marginBottom:20,padding:"6px 10px",border:"1px solid rgba(80,140,255,.8)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",color:"#4474D0",background:"rgba(255,255,255,.08)"}}>Partner With Us</span>
        <h2 style={{margin:"0 0 24px",fontSize:26,fontWeight:500}}>Why Partner with ISM</h2>
        <p style={{margin:"0 0 40px",fontSize:16,lineHeight:1.7,opacity:0.75,maxWidth:720,marginLeft:"auto",marginRight:"auto"}}>Partnering with ISM means joining an expanding, global bible network delivering the Bible without barriers.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:32,justifyContent:"center",textAlign:"left"}}>
          {items.map(([icon,t,d])=>(
            <div key={t} style={{flex:"1 1 360px",minWidth:280,display:"flex",gap:16}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,.06)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><img src={"../../assets/icons/"+icon} style={{width:26,height:26,filter:"brightness(0) invert(1)"}}/></div>
              <div>
                <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:500}}>{t}</h3>
                <p style={{margin:0,fontSize:16,lineHeight:1.8,opacity:0.85}}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function GbnGrid(){
  const cards=[["DOT.BIBLE APPS","ISM Bible Apps","ISM's Bible Apps deliver Scripture and teaching content in hundreds of languages, making it easy to read, listen, and share with others."],["RADIO BROADCASTS","ISM Radio: The Sojourner Project","Through HD radio and streaming broadcasts, ISM Radio delivers the Bible 24/7 in multiple languages—even where apps cannot go."],["PUBLICATIONS","ISM Publishing","Distributing Bibles and resources via Amazon, Kindle, and global print-on-demand—preserving indigenous languages and strengthening communities of faith."],["TAP & PROCLAIM","ISM TAP Cards","With a single tap, our Tap Cards connect to the Global Bible Network, with access to available languages in multiple formats."]];
  return (
    <section style={{background:"#05060c",padding:"70px 24px",color:"#fff"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
        {cards.map(([tag,title,body])=>(
          <div key={title} style={{position:"relative",height:340,borderRadius:16,overflow:"hidden",backgroundImage:"linear-gradient(160deg,#141c33,#241d33)",display:"flex",alignItems:"flex-end",padding:28}}>
            <div>
              <span style={{display:"inline-block",marginBottom:14,padding:"7px 12px",border:"1px solid rgba(86,130,255,.75)",borderRadius:4,background:"rgba(10,14,28,.6)",fontSize:12,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase",color:"#6f96f5"}}>{tag}</span>
              <h3 style={{margin:"0 0 10px",fontSize:22,fontWeight:500}}>{title}</h3>
              <p style={{margin:0,fontSize:15,lineHeight:1.7,opacity:0.85,maxWidth:420}}>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function PartnerPathway(){
  const steps=[["1","Engage","Complete a short form and receive additional Partner resources to start the process. We'll connect personally to explore your ministry's vision and how ISM can equip you to reach more people with Scripture."],["2","Equip","As you invest in Bible access, we'll equip you with tools to make impact tangible—TAP Cards, radio resources, Bible apps, and publishing assets that put God's Word directly into the hands of those who've never had it."],["3","Expand","Together, we'll expand Bible access to new languages and regions through technology, innovation, and prayer—breaking barriers so the Bible can go where it's never been."]];
  return (
    <section style={{background:"#0b0d18",color:"#fff",padding:"70px 24px",textAlign:"center"}}>
      <div style={{width:72,height:2,margin:"0 auto 32px",borderRadius:999,backgroundImage:"linear-gradient(90deg,#4a65ff,#7aa2ff 45%,#e3b39a 100%)"}}/>
      <span style={{display:"inline-block",marginBottom:16,padding:"6px 10px",border:"1px solid rgba(80,140,255,.8)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",color:"#4474D0",background:"rgba(255,255,255,.08)"}}>ISM Partner Pathway</span>
      <h2 style={{margin:"0 auto 16px",fontSize:26,fontWeight:600,maxWidth:780}}>A simple three-step journey to join the mission of global Bible access.</h2>
      <p style={{margin:"0 auto 48px",maxWidth:680,fontSize:16,lineHeight:1.7,opacity:0.85}}>Partnering with ISM means combining the heart of the Church with the tools of technology. We merge innovation and the Great Commission—empowering ministries to reach people where traditional methods cannot.</p>
      <div style={{display:"flex",gap:32,maxWidth:1200,margin:"0 auto",flexWrap:"wrap",justifyContent:"center"}}>
        {steps.map(([n,t,d])=>(
          <div key={n} style={{position:"relative",flex:"1 1 320px",border:"1px solid rgba(255,255,255,.12)",borderRadius:24,background:"rgba(255,255,255,.03)",padding:"56px 24px 32px"}}>
            <div style={{position:"absolute",top:-36,left:"50%",transform:"translateX(-50%)",fontSize:35,fontWeight:600,backgroundImage:"linear-gradient(90deg,#4a65ff,#7aa2ff 45%,#e3b39a 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
            <h3 style={{margin:"0 0 16px",fontSize:22,fontWeight:500}}>{t}</h3>
            <p style={{margin:0,fontSize:16,lineHeight:1.75,color:"#a6b1bb"}}>{d}</p>
          </div>
        ))}
      </div>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,border:"1px solid #fff",padding:"12px 20px",borderRadius:9999,fontSize:16,marginTop:56}}>Submit Partner Inquiry ↗</span>
    </section>
  );
}
function Faq(){
  const qs=[["What is ISM's mission?","ISM exists to make Scripture accessible to everyone, everywhere—leveraging modern technology, media, and partnerships to deliver the Bible to every language and every person."],["How does ISM ensure accuracy and faithfulness in its Bible content?","We work with trusted Bible translation and media partners to ensure every broadcast, app, and publication reflects accurate Scripture and sound theology."],["Are you a non-profit organization?","Yes. ISM is a registered 501(c)(3) nonprofit ministry supported by donations, sponsorships, and partnerships that help expand Bible access globally."]];
  return (
    <section style={{background:"#0b0d18",color:"#fff",padding:"0 24px 80px",textAlign:"center"}}>
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{width:72,height:2,margin:"0 auto 32px",borderRadius:999,backgroundImage:"linear-gradient(90deg,#4a65ff,#7aa2ff 45%,#e3b39a 100%)"}}/>
        <span style={{display:"inline-block",marginBottom:16,padding:"6px 10px",border:"1px solid rgba(80,140,255,.8)",fontSize:12,letterSpacing:"0.2em",textTransform:"uppercase",color:"#4474D0",background:"rgba(255,255,255,.08)"}}>FAQs</span>
        <h2 style={{margin:"0 0 32px",fontSize:22,fontWeight:500}}>Questions About ISM?</h2>
        <div style={{textAlign:"left"}}>
          {qs.map(([q,a])=>(
            <details key={q} style={{margin:"0 0 12px",border:"1px solid rgba(255,255,255,.12)",borderRadius:16,background:"rgba(255,255,255,.03)",padding:"16px 20px"}}>
              <summary style={{cursor:"pointer",fontSize:16,fontWeight:600,listStyle:"none"}}>{q}</summary>
              <p style={{margin:"12px 0 0",fontSize:16,lineHeight:1.75,opacity:0.85}}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Hero=Hero; window.VideoBanner=VideoBanner; window.TogetherBanner=TogetherBanner; window.WhyPartner=WhyPartner; window.GbnGrid=GbnGrid; window.PartnerPathway=PartnerPathway; window.Faq=Faq;
