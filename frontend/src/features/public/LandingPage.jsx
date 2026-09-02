import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Printer,
  QrCode,
  Smartphone,
  CreditCard,
  Tv,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Building2,
  Clock,
  Lock,
  Layers,
  BarChart3,
  Users,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* ──────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR
      ────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="logo-badge py-2 px-4 shadow-cyan-glow">
              <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
            </div>
            <span className="text-xl font-extrabold font-heading text-white tracking-tight group-hover:text-cyan-400 transition-colors">
              EasyXerox
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-cyan-400 transition-colors">Partner Benefits</a>
            <a href="#network" className="hover:text-cyan-400 transition-colors">Network</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/client/login')}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-cyan-glow transition-all btn-touch"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────────
          HERO SECTION
      ────────────────────────────────────────────────────────────── */}
      <header className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/90 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-400 mb-6 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Commercial Self-Service Xerox Kiosks</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-5xl mx-auto"
          >
            Touchless, Automated <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              24/7 Document Printing & Xerox
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Transform any retail space into a smart, revenue-generating printing hub. Customers scan a QR code, upload documents from their phones, pay via UPI, and receive instant silent prints.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/client/login')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-cyan-glow transition-all flex items-center gap-3 btn-touch"
            >
              <Building2 className="w-5 h-5 text-slate-950" />
              <span>Host a Kiosk / Partner Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-2xl border border-slate-700/80 transition-all flex items-center gap-2 btn-touch"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </a>
          </motion.div>

          {/* Quick Metrics Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-left backdrop-blur-md">
              <div className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-heading">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Self-Service Touch HMI</div>
            </div>
            <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-left backdrop-blur-md">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-heading">&lt; 5 sec</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Silent Print Dispatch</div>
            </div>
            <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-left backdrop-blur-md">
              <div className="text-2xl md:text-3xl font-extrabold text-blue-400 font-heading">Razorpay</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Instant UPI Payments</div>
            </div>
            <div className="p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-left backdrop-blur-md">
              <div className="text-2xl md:text-3xl font-extrabold text-purple-400 font-heading">24/7</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Automated Operations</div>
            </div>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────
          CORE FEATURES GRID
      ────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Engineered For Speed & Reliability
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
              Complete End-to-End Self-Service Ecosystem
            </h3>
            <p className="text-slate-400 text-base mt-4">
              Everything needed to operate commercial printing kiosks with zero staff dependency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <QrCode className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Instant QR Mobile Upload</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Customers scan the on-screen machine QR code to open the responsive upload website. No mobile app download or registration required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Seamless UPI QR Payments</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Integrated Razorpay payment gateway generates dynamic UPI QR codes for GPay, PhonePe, Paytm, and BHIM with live status verification.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Windows Silent Print Daemon</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Local background node daemon monitors printer health (Paper Out, Toner Low) and executes silent prints straight to the print spooler.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-purple-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Dynamic Ad Monetization</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Idle kiosk screens auto-rotate high-definition video & image advertising carousels, unlocking an extra passive income stream for host locations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-amber-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Live Revenue Split Engine</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automated commission calculator splits transaction earnings in real time between machine hosts and platform admins with transparent daily logs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-rose-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading mb-3">Automated File Privacy</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Uploaded PDFs and documents are automatically shredded and deleted immediately following print completion, ensuring 100% user data confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          HOW IT WORKS (TABBED WALKTHROUGH)
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              Simple & Intuitive
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold font-heading text-white">
              How EasyXerox Works
            </h3>
          </div>

          {/* Toggle Tabs */}
          <div className="flex items-center justify-center mb-16">
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-2">
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'customers'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>For Printing Customers</span>
              </button>
              <button
                onClick={() => setActiveTab('partners')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'partners'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Shop Partners</span>
              </button>
            </div>
          </div>

          {/* Steps Content */}
          {activeTab === 'customers' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative">
                <div className="text-4xl font-extrabold font-heading text-cyan-500/40 mb-4">01</div>
                <h4 className="text-lg font-bold text-white mb-2">Scan QR Code</h4>
                <p className="text-xs text-slate-400">Scan the QR code displayed on the touchscreen kiosk using any smartphone camera.</p>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative">
                <div className="text-4xl font-extrabold font-heading text-cyan-500/40 mb-4">02</div>
                <h4 className="text-lg font-bold text-white mb-2">Upload Document</h4>
                <p className="text-xs text-slate-400">Select any PDF or image up to 100MB directly from your phone's browser.</p>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative">
                <div className="text-4xl font-extrabold font-heading text-cyan-500/40 mb-4">03</div>
                <h4 className="text-lg font-bold text-white mb-2">Customize & Pay</h4>
                <p className="text-xs text-slate-400">Choose B&W/Color, single/duplex, page count, and scan the Razorpay UPI QR code.</p>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl relative">
                <div className="text-4xl font-extrabold font-heading text-cyan-500/40 mb-4">04</div>
                <h4 className="text-lg font-bold text-white mb-2">Collect Prints</h4>
                <p className="text-xs text-slate-400">Your documents print silently and instantly. File is purged immediately after.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div className="text-4xl font-extrabold font-heading text-emerald-500/40 mb-4">01</div>
                <h4 className="text-lg font-bold text-white mb-2">Host Machine Hardware</h4>
                <p className="text-xs text-slate-400">Place our touch kiosk in your shop, metro station, college campus, or retail outlet.</p>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div className="text-4xl font-extrabold font-heading text-emerald-500/40 mb-4">02</div>
                <h4 className="text-lg font-bold text-white mb-2">Earn Passive Revenue</h4>
                <p className="text-xs text-slate-400">Receive automated split commissions on every single print job and ad impression.</p>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div className="text-4xl font-extrabold font-heading text-emerald-500/40 mb-4">03</div>
                <h4 className="text-lg font-bold text-white mb-2">Track on Dashboard</h4>
                <p className="text-xs text-slate-400">Log into your Client Partner portal to view daily earnings, paper status, and transaction history.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          NETWORK KIOSK LOCATIONS SECTION
      ────────────────────────────────────────────────────────────── */}
      <section id="network" className="py-20 px-6 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <MapPin className="w-4 h-4" />
              <span>Live Kiosk Deployment Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white">
              Self-Service Xerox Kiosks Across High-Footfall Hubs
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Find EasyXerox automated print stations operating 24/7 at transit hubs, university campuses, tech parks, and commercial markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                    KIOSK-001
                  </span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online 24/7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Metro Gate #2 Kiosk</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Connaught Place Metro Complex, New Delhi</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
                <span>Features</span>
                <span className="text-cyan-300 font-semibold">B&W + Color Xerox</span>
              </div>
            </div>

            {/* Location 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                    KIOSK-002
                  </span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online 24/7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">IIT Campus Library Kiosk</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Central Library Lobby, IIT Delhi Campus</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
                <span>Features</span>
                <span className="text-cyan-300 font-semibold">High-Speed Duplex</span>
              </div>
            </div>

            {/* Location 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                    KIOSK-003
                  </span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online 24/7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">Cyber City Tech Hub</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Building 10 Tower B, DLF Cyber City</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
                <span>Features</span>
                <span className="text-cyan-300 font-semibold">UPI + Mobile Scan</span>
              </div>
            </div>

            {/* Location 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                    KIOSK-004
                  </span>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online 24/7
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-heading">North Campus Market</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Kamla Nagar Main Market, Delhi University</span>
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between">
                <span>Features</span>
                <span className="text-cyan-300 font-semibold">A4 Fast Thermal Print</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          PARTNER CTA BANNER
      ────────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border-2 border-cyan-500/30 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white max-w-3xl mx-auto leading-tight">
            Ready to Monetize Your Space with Self-Service Printing?
          </h2>
          <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
            Join hundreds of shop owners and venue partners earning passive daily income.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/client/login')}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-base rounded-xl shadow-cyan-glow transition-all flex items-center gap-2 btn-touch"
            >
              <span>Log In to Partner Portal</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          FOOTER SECTION
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 pt-20 pb-12 px-8 text-sm text-slate-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Instagram (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="logo-badge py-2 px-4 shadow-cyan-glow border border-cyan-500/30">
                <img src="/logo.png" alt="EasyXerox" className="h-10 w-auto object-contain" />
              </div>
              <span className="text-2xl font-extrabold font-heading text-white tracking-tight">
                EasyXerox
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md font-medium">
              India's leading commercial self-service Xerox & document printing kiosk network. Automated, touchless 24/7 printing powered by Windows silent print daemons and Razorpay UPI.
            </p>

            {/* Instagram Link Button */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/easy_xerox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white text-sm font-extrabold rounded-2xl shadow-xl transition-all btn-touch group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>Follow @easy_xerox on Instagram</span>
                <ExternalLink className="w-4 h-4 opacity-90" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 font-heading border-b border-slate-800/80 pb-3">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <a href="#features" className="hover:text-cyan-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-cyan-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  <span>How It Works</span>
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-cyan-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  <span>Partner Benefits</span>
                </a>
              </li>
              <li>
                <a href="#network" className="hover:text-cyan-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  <span>Network</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 font-heading border-b border-slate-800/80 pb-3">
              Contact & Support
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="leading-snug pt-1">EasyXerox Systems Pvt Ltd, Connaught Place, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+91 98765 43210 (Toll Free / Support)</span>
              </li>
              <li className="flex items-center gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <span>support@easyxerox.com</span>
              </li>
              <li className="flex items-center gap-3.5 text-slate-400 text-xs">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-purple-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span>24/7 Automated Machine Monitoring</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-10 flex flex-wrap items-center justify-between gap-6 text-sm text-slate-400 font-medium">
          <p>© 2026 EasyXerox Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#terms" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="https://www.instagram.com/easy_xerox" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-2 text-pink-400 font-bold">
              <Instagram className="w-4 h-4" />
              <span>@easy_xerox</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
