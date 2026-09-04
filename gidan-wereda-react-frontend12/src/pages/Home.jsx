import { Link } from "react-router-dom";
import { ArrowRight, Search, FileCheck2, Users, ShieldCheck, Clock3, CheckCircle2 } from "lucide-react";
import { news, services } from "../data/siteData";

export default function Home() {
  return <>
    <section className="hero">
      <div className="hero-pattern"/>
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow light">DIGITAL GOVERNANCE • GIDAN WEREDA</span>
          <h1>Public services that work <span>for you.</span></h1>
          <p>Access district information, submit selected applications online, track requests and verify published results from one trusted portal.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/services/apply">Start a Service <ArrowRight size={18}/></Link><Link className="button button-outline" to="/about">Learn About the Portal</Link></div>
          <div className="hero-trust"><span><CheckCircle2 size={17}/> Secure</span><span><Clock3 size={17}/> Transparent</span><span><Users size={17}/> Citizen-focused</span></div>
        </div>
        <div className="track-card">
          <div className="track-card-icon"><Search size={22}/></div>
          <span className="eyebrow">QUICK TRACKING</span><h2>Where is my application?</h2>
          <p>Enter your unique Tracking ID to view the latest status and official remarks.</p>
          <form action="/track" className="tracking-form"><input name="id" placeholder="e.g. APP-89214" required/><button>Track <ArrowRight size={17}/></button></form>
          <small>No account required to track a submitted application.</small>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow">ONE PORTAL</span><h2>Everything citizens need</h2></div><Link to="/services" className="text-link">View all services <ArrowRight size={16}/></Link></div>
        <div className="service-grid">{services.map((s, i) => <Link className="service-card" to={s.id==="tracking"?"/track":s.id==="result"?"/results":`/services/apply?service=${s.id}`} key={s.id}><div className="service-number">0{i+1}</div><div className="service-icon">{i===0?"⌂":i===1?"▣":i===2?"⌕":"◈"}</div><h3>{s.title}</h3><p>{s.description}</p><span>Open service <ArrowRight size={15}/></span></Link>)}</div>
      </div>
    </section>

    <section className="section soft-section">
      <div className="container split-section">
        <div><span className="eyebrow">WHY DIGITAL?</span><h2>A simpler way to engage with your administration.</h2><p>Our portal brings public information and selected citizen services into one accessible digital experience.</p><div className="feature-list"><div><ShieldCheck/><span><b>Built with security in mind</b><small>Protected accounts and controlled administrative access.</small></span></div><div><FileCheck2/><span><b>Transparent application flow</b><small>Track progress from submission to decision.</small></span></div><div><Users/><span><b>Designed for citizens and staff</b><small>Clear workflows for both public and internal users.</small></span></div></div></div>
        <div className="info-panel"><span>PUBLIC SERVICE PROMISE</span><strong>Accessible.</strong><strong>Transparent.</strong><strong>Accountable.</strong><p>Digital tools should make public service easier to understand and easier to access.</p></div>
      </div>
    </section>

    <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">LATEST</span><h2>News & announcements</h2></div><Link to="/news" className="text-link">All news <ArrowRight size={16}/></Link></div><div className="news-grid">{news.map(n=><article className="news-card" key={n.id}><span>{n.category}</span><small>{n.date}</small><h3>{n.title}</h3><p>{n.excerpt}</p><Link to="/news">Read notice <ArrowRight size={15}/></Link></article>)}</div></div></section>
  </>;
}