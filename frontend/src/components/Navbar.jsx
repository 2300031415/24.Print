import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, User, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenPrintModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId, sectionId = null) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    if (sectionId && pageId === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
        scrolled ? 'border-gray-200 shadow-sm' : 'border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo & Future Forbes Attribution */}
          <div className="flex items-center space-x-3.5 flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 group focus:outline-none"
            >
              <img src="/logo.png" alt="EasyXerox" className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
              <div className="flex flex-col items-start text-left border-l border-gray-200 pl-2.5">
                <span className="text-[10px] font-black text-[#0C3D97] tracking-wider uppercase leading-tight">
                  EasyXerox
                </span>
                <span className="text-[9px] font-bold text-slate-500 tracking-wide uppercase leading-tight">
                  By Future Forbes Pvt Ltd
                </span>
              </div>
            </button>

            {/* Future Forbes Badge (XL screens) */}
            <div className="hidden xl:flex items-center space-x-1.5 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 whitespace-nowrap">
              <img src="/future-forbes-logo.png" alt="Future Forbes Pvt Ltd" className="w-4 h-4 object-contain rounded" />
              <span>A Product of <strong className="text-blue-900 font-extrabold">Future Forbes Pvt Ltd</strong></span>
            </div>
          </div>

          {/* Navigation Links (Center - Desktop) */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-[14px] font-medium text-gray-700 whitespace-nowrap">
            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#0C3D97] whitespace-nowrap ${activePage === 'about' ? 'text-[#0C3D97] font-bold' : ''}`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('home', 'features-section')}
              className="transition-colors hover:text-[#0C3D97] whitespace-nowrap"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('franchise')}
              className={`transition-colors hover:text-[#0C3D97] whitespace-nowrap ${activePage === 'franchise' ? 'text-[#0C3D97] font-bold' : ''}`}
            >
              Franchise
            </button>
            <button
              onClick={() => handleNavClick('xerox-shop')}
              className={`transition-colors hover:text-[#0C3D97] whitespace-nowrap ${activePage === 'xerox-shop' ? 'text-[#0C3D97] font-bold' : ''}`}
            >
              Xerox Shops
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#0C3D97] whitespace-nowrap ${activePage === 'contact' ? 'text-[#0C3D97] font-bold' : ''}`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/client/login')}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-blue-50 text-[#0C3D97] hover:bg-blue-100 border border-blue-200 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg transition-all"
            >
              <User className="w-4 h-4 text-[#0C3D97]" />
              <span>Partner Login</span>
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="hidden sm:inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 text-xs font-semibold px-2.5 py-2 rounded-lg transition-all"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin</span>
            </button>

            <button
              onClick={onOpenPrintModal}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-[#0C3D97] hover:bg-[#082e75] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow"
            >
              <span>Print Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#0C3D97]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${activePage === 'home' ? 'bg-blue-50 text-[#0C3D97] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${activePage === 'about' ? 'bg-blue-50 text-[#0C3D97] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('home', 'features-section')}
                className="text-left text-sm font-medium py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Features & Benefits
              </button>
              <button
                onClick={() => handleNavClick('franchise')}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${activePage === 'franchise' ? 'bg-blue-50 text-[#0C3D97] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Franchise & Partner
              </button>
              <button
                onClick={() => handleNavClick('xerox-shop')}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${activePage === 'xerox-shop' ? 'bg-blue-50 text-[#0C3D97] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Xerox Shops
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left text-sm font-medium py-2 px-3 rounded-lg transition-colors ${activePage === 'contact' ? 'bg-blue-50 text-[#0C3D97] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Contact Us
              </button>
              
              <div className="pt-2 border-t border-gray-100 sm:hidden space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/client/login');
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-blue-50 text-[#0C3D97] text-sm font-bold py-2.5 rounded-lg border border-blue-200"
                >
                  <User className="w-4 h-4" />
                  <span>Partner Login</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin/login');
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-slate-100 text-slate-800 text-sm font-semibold py-2 rounded-lg border border-slate-200"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  <span>Admin Portal</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPrintModal();
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#0C3D97] text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm"
                >
                  <span>Print Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Social Channels in Mobile Menu */}
              <div className="pt-3 mt-1 border-t border-gray-100 flex items-center justify-around">
                <a 
                  href="https://x.com/easy_xerox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
                  title="Follow on X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/@easy_xerox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Subscribe on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/easy_xerox/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  title="Follow on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/company/future-forbes-pvt-ltd/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-50 text-gray-700 hover:text-[#0A66C2] hover:bg-blue-50 transition-colors"
                  title="Connect on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

