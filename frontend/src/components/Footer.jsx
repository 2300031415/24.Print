import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Globe, Award, User, Lock } from 'lucide-react';

export default function Footer({ setActivePage, onOpenPrintModal }) {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-gray-200/80 pt-8 pb-10 px-4 mt-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-gray-100">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#0C3D97] flex items-center justify-center text-white font-black text-lg shadow-sm">
                <span>E</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                <span className="text-[#0C3D97]">Easy</span>Xerox
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-800">
              India's First & Only Self-Service Touchscreen Printing Vending Kiosk
            </p>

            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Engineered and powered by <strong>Future Forbes Private Limited</strong> (Startup India Recognized, DIPP209399). Join the modern self-service revolution.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1 text-[#0C3D97] font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0C3D97]" />
                <span>Patented Smart Kiosk Tech</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-700 font-semibold bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                <Award className="w-3.5 h-3.5 text-gray-700" />
                <span>DPIIT Certified</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              <li>
                <button onClick={() => { setActivePage('xerox-shop'); window.scrollTo(0,0); }} className="hover:text-[#0C3D97] transition-colors">
                  Xerox Shops
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('home'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-[#0C3D97] transition-colors">
                  How it works
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('franchise'); window.scrollTo(0,0); }} className="hover:text-[#0C3D97] transition-colors">
                  Franchise
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); window.scrollTo(0,0); }} className="hover:text-[#0C3D97] transition-colors">
                  About Us (Future Forbes)
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('contact'); window.scrollTo(0,0); }} className="hover:text-[#0C3D97] transition-colors">
                  Contact Us
                </button>
              </li>
              <li className="pt-2 border-t border-gray-100">
                <button onClick={() => navigate('/client/login')} className="font-bold text-[#0C3D97] hover:underline flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Partner Portal Login</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin/login')} className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Parent */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Follow & Connect
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-gray-600">
              <li>
                <a 
                  href="https://x.com/easy_xerox" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0C3D97] flex items-center space-x-2 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center text-gray-700 group-hover:text-[#0C3D97] transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/easy_xerox/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0C3D97] flex items-center space-x-2 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-pink-50 flex items-center justify-center text-gray-700 group-hover:text-pink-600 transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@easy_xerox" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0C3D97] flex items-center space-x-2 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-red-50 flex items-center justify-center text-gray-700 group-hover:text-red-600 transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/company/future-forbes-pvt-ltd/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0C3D97] flex items-center space-x-2 transition-colors group"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center text-gray-700 group-hover:text-[#0A66C2] transition-colors">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <span>LinkedIn (Future Forbes)</span>
                </a>
              </li>
              <li>
                <a 
                  href="http://futureforbes.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#0C3D97] flex items-center space-x-2 transition-colors group font-bold text-gray-900 pt-1"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-[#0C3D97] transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span>futureforbes.in ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
              Office & Support
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#0C3D97] flex-shrink-0" />
                <a href="tel:+918885600899" className="font-bold text-gray-900 hover:text-[#0C3D97]">
                  +91 88856 00899 / 08047363360
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#0C3D97] flex-shrink-0" />
                <a href="mailto:support@easyxerox.in" className="hover:text-[#0C3D97]">
                  support@easyxerox.in
                </a>
              </div>
              <div className="flex items-start space-x-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#0C3D97] flex-shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed">
                  <strong>India HQ:</strong> Gachibowli, Hyderabad, Telangana • <strong>Australia:</strong> Wyndham City, Melbourne
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            © {new Date().getFullYear()} EasyXerox. A product powered by <a href="http://futureforbes.in/" target="_blank" rel="noreferrer" className="text-gray-600 font-bold hover:underline">Future Forbes Private Limited</a>. All rights reserved.
          </div>
          <div className="flex space-x-4 text-gray-500">
            <a href="#terms" className="hover:underline">Terms of Service</a>
            <a href="#privacy" className="hover:underline">Privacy Policy</a>
            <a href="#refund" className="hover:underline">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
