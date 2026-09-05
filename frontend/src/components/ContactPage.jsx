import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import FranchiseForm from './FranchiseForm';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Contact <span className="text-[#0C3D97]">EasyXerox</span>
        </h1>
        <p className="mt-3 text-base text-gray-600 font-medium">
          Have questions about kiosk hosting, franchise opportunities, or customer support? We’re here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* Contact Info Cards (Compact & Clean) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Phone Card */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0C3D97]/40 transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0C3D97] flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone Support</h3>
                <div className="flex flex-wrap items-center gap-x-2">
                  <a href="tel:+918885600899" className="text-sm font-black text-gray-900 hover:text-[#0C3D97] transition-colors">
                    +91 88856 00899
                  </a>
                  <span className="text-gray-300 font-bold">/</span>
                  <a href="tel:08047363360" className="text-sm font-black text-gray-900 hover:text-[#0C3D97] transition-colors">
                    08047363360
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-medium pl-11">
              *Direct Line & Helpdesk • Available 24/7
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0C3D97]/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0C3D97] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Enquiries</h3>
                <a href="mailto:support@easyxerox.in" className="text-sm font-black text-gray-900 hover:text-[#0C3D97] transition-colors">
                  support@easyxerox.in
                </a>
              </div>
            </div>
          </div>

          {/* Registered Office Card */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0C3D97]/40 transition-all">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0C3D97] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Registered Office</h3>
                <p className="text-xs font-bold text-gray-900 mt-0.5">
                  Future Forbes Private Limited
                </p>
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-1">
                  <strong>India HQ:</strong> Gachibowli, Hyderabad, Telangana<br />
                  <strong>Australia:</strong> Wyndham City, Melbourne, VIC
                </p>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0C3D97]/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0C3D97] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Operating Hours</h3>
                <p className="text-xs text-gray-900 font-bold mt-0.5">Kiosks: 24/7/365 Non-Stop</p>
                <p className="text-[10px] text-gray-500">Franchise Helpdesk: 9:00 AM - 8:00 PM IST</p>
              </div>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="bg-white p-4 sm:p-4.5 rounded-2xl border border-gray-200/90 shadow-xs hover:border-[#0C3D97]/40 transition-all">
            <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-2">
              Official Social Channels
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {/* X (Twitter) */}
              <a 
                href="https://x.com/easy_xerox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-800 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 truncate">X (Twitter)</p>
                </div>
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@easy_xerox"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl border border-gray-200 hover:border-red-600 hover:bg-red-50/40 text-gray-800 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 truncate">YouTube</p>
                </div>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/easy_xerox/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-50/40 text-gray-800 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 truncate">Instagram</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/future-forbes-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded-xl border border-gray-200 hover:border-[#0A66C2] hover:bg-blue-50/40 text-gray-800 transition-all group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-gray-900 truncate">LinkedIn</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Lead & Query Form */}
        <div className="lg:col-span-8">
          <FranchiseForm embedded={true} />
        </div>

      </div>
    </div>
  );
}
