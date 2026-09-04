import PageHero from "../components/PageHero";
import { Target, Eye, ShieldCheck, Accessibility } from "lucide-react";

export default function About() {
  return <>
    <PageHero eyebrow="ABOUT THE PORTAL" title="Digital governance for a more connected Gidan Wereda" text="A centralized public-service experience for information, selected digital services and transparent application tracking."/>
    <section className="section"><div className="container narrow"><span className="eyebrow">OUR PURPOSE</span><h2>Making public services clearer, faster and more accessible.</h2><p className="large-text">The Gidan Wereda Digital Governance & Service Portal is designed to connect citizens with district information and selected administrative services through a single, responsive web experience.</p><div className="about-cards"><div><Target/><h3>Mission</h3><p>Deliver citizen-centered digital services with clear processes and reliable information.</p></div><div><Eye/><h3>Vision</h3><p>Build a transparent local administration where digital access supports better public service.</p></div><div><ShieldCheck/><h3>Trust</h3><p>Use role-based access and secure application workflows to protect administrative information.</p></div><div><Accessibility/><h3>Accessibility</h3><p>Provide a responsive interface that works across desktop, tablet and mobile devices.</p></div></div></div></section>
  </>;
}