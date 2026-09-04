import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">GIDAN <span>WEREDA</span></div>
          <p className="footer-text">A digital public-service platform for transparent, accessible and citizen-centered district administration.</p>
          <div className="socials"><a href="#facebook"><Facebook size={18}/></a><a href="#telegram"><Send size={18}/></a></div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/about">About</Link><Link to="/news">News</Link><Link to="/leadership">Leadership</Link><Link to="/services">E-Services</Link>
        </div>
        <div>
          <h4>Citizen Services</h4>
          <Link to="/services/apply">Apply Online</Link><Link to="/track">Track Application</Link><Link to="/results">Check Result</Link><Link to="/staff">Staff Availability</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><MapPin size={16}/> Gidan Wereda Administration</p>
          <p><Phone size={16}/> +251 900 000 000</p>
          <p><Mail size={16}/> info@gidan.gov.et</p>
        </div>
      </div>
      <div className="footer-bottom"><div className="container">© 2026 Gidan Wereda Administration. All rights reserved.</div></div>
    </footer>
  );
}