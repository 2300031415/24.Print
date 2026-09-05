import React from 'react';
import { Quote, Sparkles, Target, Zap, Award, Users, ShieldCheck, Heart, ArrowUpRight, Globe, Building, CheckCircle2 } from 'lucide-react';

export default function AboutPage({ onOpenFranchise }) {
  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      


      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
        {/* Left Quote Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-50 to-blue-100/60 rounded-3xl p-8 sm:p-10 border-2 border-blue-500/30 shadow-lg relative">
          <div className="text-[#0C3D97]/30 mb-4">
            <Quote className="w-16 h-16" />
          </div>
          <p className="text-gray-900 text-base sm:text-lg font-medium italic leading-relaxed mb-6">
            “At Future Forbes, we believe in building technologies that create tangible impact. If groceries, cabs, and food reach us in minutes, why should printing still remain stuck in queues and outdated shops? EasyXerox is our answer to modern, autonomous convenience.”
          </p>
          <div className="border-t border-blue-200/80 pt-4 flex items-center space-x-3">
            <img 
              src="/team/arjun_uddagiri_ceo.jpg" 
              alt="Arjun Uddagiri" 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#0C3D97]"
            />
            <div>
              <span className="font-extrabold text-sm sm:text-base text-gray-950 block">Arjun Uddagiri</span>
              <span className="text-xs text-[#0C3D97] font-semibold">Founder & CEO, Future Forbes Pvt Ltd</span>
            </div>
          </div>
        </div>

        {/* Right Story Description */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/30 text-[#0C3D97] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#0C3D97]" />
            <span>Our Origin & Mission</span>
          </div>

          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight">
              About <span className="text-[#0C3D97]">EasyXerox</span>
            </h1>
            <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
              <img src="/future-forbes-logo.png" alt="Future Forbes Pvt Ltd" className="h-7 w-auto object-contain rounded" />
              <span className="text-xs font-black text-blue-950">A Product of Future Forbes Pvt Ltd</span>
            </div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            <strong>EasyXerox</strong> is India's pioneer in self-service smart printing kiosks, engineered and powered by <strong>Future Forbes Private Limited</strong> (a recognized #StartupIndia venture) to make document printing instant, secure, and available 24/7.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            Developed under the visionary technology ecosystem of Future Forbes, EasyXerox eliminates the traditional hassle of standing in lines, dealing with closed xerox shops during late hours, or transferring sensitive personal documents to third-party computers.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            With 100% on-screen touchscreen operation, rapid QR & USB uploads, single/double-sided duplex printing, and instant memory auto-wiping, we are reshaping public printing infrastructure across India.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="http://futureforbes.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Explore Future Forbes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onOpenFranchise}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0C3D97] hover:bg-[#082e75] text-white text-xs font-bold transition-all"
            >
              <span>Partner as a Franchise</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Leadership & Founders Section */}
      <div className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0C3D97] text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Executive Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
            The Visionaries Behind <span className="text-[#0C3D97]">Future Forbes</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            Meet the leadership driving hardware, AI, and IoT innovation at Future Forbes Pvt. Ltd.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          {/* Arjun Uddagiri - Founder & CEO */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
              <img 
                src="/team/arjun_uddagiri_ceo.jpg" 
                alt="Arjun Uddagiri - Founder & CEO"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">Arjun Uddagiri</h3>
                <p className="text-xs font-bold text-[#0C3D97] uppercase tracking-wide mt-0.5">
                  Founder & CEO • Machine Learning Scientist
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Future Forbes Private Limited
                </p>
                <p className="text-xs text-gray-600 leading-relaxed pt-1.5">
                  Technology entrepreneur specializing in AI/ML, IoT architectures, and smart hardware kiosk systems.
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">Hyderabad HQ</span>
                <a 
                  href="https://www.linkedin.com/in/arjun-uddagiri-8585891b3/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white text-xs font-bold transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Pragada Eswar - Co-Founder & Partner */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
              <img 
                src="/team/pragada_eswar_cofounder.jpg" 
                alt="Pragada Eswar - Co-Founder & Partner"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between h-full space-y-2 text-center sm:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">Pragada Eswar</h3>
                <p className="text-xs font-bold text-[#0C3D97] uppercase tracking-wide mt-0.5">
                  Co-Founder & Partner
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  Future Forbes Private Limited
                </p>
                <p className="text-xs text-gray-600 leading-relaxed pt-1.5">
                  Technology leader driving hardware engineering, operations, institutional deployments, and kiosk scaling.
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">Melbourne & India</span>
                <a 
                  href="https://www.linkedin.com/in/pragada-eswar-8a927b263/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white text-xs font-bold transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Future Forbes Company Credentials Banner */}
      <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-[#0C3D97]/90 rounded-3xl p-8 sm:p-12 text-white shadow-2xl mb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-blue-300" />
              <span>DPIIT Recognized Startup • #StartupIndia</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Future Forbes Private Limited
            </h2>
            
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
              Specializing in Enterprise AI, Embedded Systems, IoT Kiosk Automation, Blockchain Architecture, and Advanced Data Science solutions. Where Vision Meets Innovation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Certificate No: <strong>DIPP209399</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Global Presence: India & Australia</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-stretch">
            <a 
              href="http://futureforbes.in/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white text-gray-950 hover:bg-gray-100 font-bold text-xs sm:text-sm text-center flex items-center justify-center space-x-2 transition-all shadow-lg"
            >
              <span>Visit futureforbes.in</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Official Social Channels Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold mb-2 text-center">
                Follow & Connect
              </p>
              <div className="flex items-center justify-center gap-2">
                <a 
                  href="https://www.linkedin.com/company/easy-xerox/"
                  target="_blank"
                  rel="noreferrer"
                  title="Connect on LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[#0A66C2] flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/@easy_xerox"
                  target="_blank"
                  rel="noreferrer"
                  title="Subscribe on YouTube"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/easy_xerox/"
                  target="_blank"
                  rel="noreferrer"
                  title="Follow on Instagram"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/easy_xerox"
                  target="_blank"
                  rel="noreferrer"
                  title="Follow on X"
                  className="w-8 h-8 rounded-lg bg-white/15 hover:bg-black flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 text-center mb-10">
          What Drives Us Forward
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0C3D97] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Speed & Simplicity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We eliminate friction. No apps to install, no OTPs, no accounts. Just scan the on-screen QR or plug in your USB / Type-C drive, pay via UPI, and collect your prints.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0C3D97] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Uncompromising Privacy</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your confidential documents, certificates, and medical records are permanently wiped instantly upon printing.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0C3D97] flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Accessibility for All</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Democratizing affordable, quality printing across colleges, hospitals, transit stations, and hostels across India.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
