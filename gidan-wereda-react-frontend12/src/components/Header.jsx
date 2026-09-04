import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, Landmark } from "lucide-react";

const links = [
  ["About", "/about"],
  ["News", "/news"],
  ["Leadership", "/leadership"],
  ["E-Services", "/services"],
  ["Track Application", "/track"],
  ["Result Checker", "/results"],
  ["Staff", "/staff"],
  ["Contact", "/contact"]
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>Gidan Wereda Administration</span>
          <span>Official Digital Governance & Service Portal</span>
        </div>
      </div>
      <nav className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark"><Landmark size={22}/></span>
            <span><b>GIDAN</b><small>WEREDA DIGITAL PORTAL</small></span>
          </Link>

          <button className="menu-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
            {open ? <X/> : <Menu/>}
          </button>

          <div className={`nav-links ${open ? "open" : ""}`}>
            {links.map(([label, path]) =>
              label === "E-Services" ? (
                <div className="nav-dropdown" key={label}>
                  <button className="nav-link dropdown-button" onClick={() => setServicesOpen(v => !v)}>
                    E-Services <ChevronDown size={15}/>
                  </button>
                  {servicesOpen && (
                    <div className="dropdown-menu">
                      <Link to="/services" onClick={() => setOpen(false)}>All Services</Link>
                      <Link to="/services/apply?service=residency" onClick={() => setOpen(false)}>Residency Certificate</Link>
                      <Link to="/services/apply?service=support" onClick={() => setOpen(false)}>Support Letter</Link>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={label} to={path} onClick={() => setOpen(false)}
                  className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
                  {label}
                </NavLink>
              )
            )}
            <Link className="nav-cta" to="/login" onClick={() => setOpen(false)}>Login</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}