import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // ፔጁ ሲቀየር ሜኑዎችን በሙሉ መዝጋት
  useEffect(() => {
    setServiceDropdownOpen(false);
    setIsOpen(false);
  }, [location]);

  const handleNavigation = (path) => {
    setServiceDropdownOpen(false);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ለጎ (Logo) */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold">
              🏛️
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider">GIDAN</span>
              <span className="block text-xs text-blue-400">WEREDA DIGITAL PORTAL</span>
            </div>
          </div>

          {/* ትልልቅ ስክሪኖች ላይ የሚታዩ ማውጫዎች (Desktop Menu) */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition">About</Link>
            <Link to="/news" className="hover:text-blue-400 transition">News</Link>
            <Link to="/leadership" className="hover:text-blue-400 transition">Leadership</Link>
            
            {/* E-Services with Dropdown (Using onMouseLeave for smooth closing) */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseLeave={() => setServiceDropdownOpen(false)}
            >
              <button
                onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                onMouseEnter={() => setServiceDropdownOpen(true)}
                className="flex items-center gap-1 hover:text-blue-400 transition focus:outline-none cursor-pointer py-2"
              >
                E-Services <ChevronDown size={16} className={`transition-transform duration-200 ${serviceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {serviceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 text-slate-800 z-50">
                  <button
                    onClick={() => handleNavigation('/services')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
                  >
                    All Services
                  </button>
                  <button
                    onClick={() => handleNavigation('/services/apply?service=residency')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
                  >
                    Residency Certificate
                  </button>
                  <button
                    onClick={() => handleNavigation('/services/apply?service=support')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 hover:text-blue-600 transition cursor-pointer"
                  >
                    Support Letter
                  </button>
                </div>
              )}
            </div>

            <Link to="/track" className="hover:text-blue-400 transition">Track Application</Link>
            <Link to="/checker" className="hover:text-blue-400 transition">Result Checker</Link>
            <Link to="/staff" className="hover:text-blue-400 transition">Staff</Link>
            <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
          </nav>

          {/* Apply Online ቁልፍ (Desktop) */}
          <div className="hidden md:block">
            <Link
              to="/services/apply"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm"
            >
              Apply Online
            </Link>
          </div>

          {/* ለሞባይል ስክሪን የሚሆን የሃምበርገር ቁልፍ (Mobile Menu Button) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>
      </div>

      {/* የሞባይል ድሮፕዳውን ሜኑ (Mobile Dropdown Menu) */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pt-4 pb-6 space-y-3 transition-all duration-300 ease-in-out">
          <Link
            to="/"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/news"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            News
          </Link>
          <Link
            to="/leadership"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            Leadership
          </Link>
          <Link
            to="/services"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            E-Services
          </Link>
          <Link
            to="/track"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            Track Application
          </Link>
          <Link
            to="/checker"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            Result Checker
          </Link>
          <Link
            to="/staff"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            Staff
          </Link>
          <Link
            to="/contact"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700 hover:text-blue-400"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link
              to="/services/apply"
              onClick={toggleMenu}
              className="class w-full text-center block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
            >
              Apply online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}