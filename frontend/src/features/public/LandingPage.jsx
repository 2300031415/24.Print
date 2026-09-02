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
  BarChart3,
  Users,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Plug,
  Wifi,
  ExternalLink,
  Layers,
  Check,
  Award,
  Video,
  Activity
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
    ORGANIC JUMBLED FLOATING "EasyXerox" AIR WATERMARK COMPONENT
────────────────────────────────────────────────────────────── */
const OrganicJumbledWatermark = () => {
  // Scattered EasyXerox words with TitleCase (Capital E & Capital X)
  const jumbledWords = [
    { id: 1, top: '6%', left: '6%', size: 'text-sm', rot: 14, opacity: 'text-blue-700/40', animType: 1, duration: 8.5 },
    { id: 2, top: '14%', left: '76%', size: 'text-base', rot: -22, opacity: 'text-blue-700/45', animType: 2, duration: 11 },
    { id: 3, top: '26%', left: '40%', size: 'text-xs', rot: 32, opacity: 'text-blue-600/40', animType: 3, duration: 7.5 },
    { id: 4, top: '36%', left: '12%', size: 'text-lg', rot: -10, opacity: 'text-blue-800/40', animType: 4, duration: 12.5 },
    { id: 5, top: '46%', left: '84%', size: 'text-sm', rot: 22, opacity: 'text-blue-700/40', animType: 5, duration: 9.5 },
    { id: 6, top: '56%', left: '28%', size: 'text-base', rot: -30, opacity: 'text-blue-700/45', animType: 1, duration: 10.5 },
    { id: 7, top: '66%', left: '68%', size: 'text-xs', rot: 18, opacity: 'text-blue-600/40', animType: 2, duration: 8.8 },
    { id: 8, top: '76%', left: '8%', size: 'text-sm', rot: -42, opacity: 'text-blue-700/40', animType: 3, duration: 13 },
    { id: 9, top: '86%', left: '78%', size: 'text-lg', rot: 10, opacity: 'text-blue-800/40', animType: 4, duration: 10 },
    
    { id: 10, top: '10%', left: '44%', size: 'text-xs', rot: -48, opacity: 'text-blue-600/35', animType: 5, duration: 11.2 },
    { id: 11, top: '30%', left: '86%', size: 'text-sm', rot: 24, opacity: 'text-blue-700/40', animType: 1, duration: 13 },
    { id: 12, top: '50%', left: '4%', size: 'text-lg', rot: -18, opacity: 'text-blue-800/40', animType: 2, duration: 9.2 },
    { id: 13, top: '70%', left: '46%', size: 'text-base', rot: 38, opacity: 'text-blue-700/45', animType: 3, duration: 12 },
    { id: 14, top: '90%', left: '20%', size: 'text-xs', rot: -26, opacity: 'text-blue-600/40', animType: 4, duration: 10.5 },
  ];

  const getAnimation = (type) => {
    switch (type) {
      case 1: // Spin & Float
        return {
          animate: {
            rotate: [0, 180, 360],
            y: [0, -30, 15, 0],
            x: [0, 25, -25, 0]
          }
        };
      case 2: // Tilt & Bob
        return {
          animate: {
            rotate: [-30, 30, -30],
            y: [0, 35, -20, 0],
            scale: [0.9, 1.2, 0.9]
          }
        };
      case 3: // Sway & Pulse
        return {
          animate: {
            x: [-30, 30, -30],
            scale: [0.85, 1.25, 0.85],
            rotate: [20, -20, 20]
          }
        };
      case 4: // 3D Tumble
        return {
          animate: {
            rotateY: [0, 180, 360],
            y: [-25, 25, -25],
            x: [20, -20, 20]
          }
        };
      case 5: // Zigzag Drift
      default:
        return {
          animate: {
            x: [0, -35, 25, 0],
            y: [0, -25, 20, 0],
            rotate: [-35, 35, -35]
          }
        };
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {jumbledWords.map((item) => {
        const anim = getAnimation(item.animType);
        return (
          <motion.div
            key={item.id}
            style={{ top: item.top, left: item.left }}
            initial={{ rotate: item.rot }}
            animate={anim.animate}
            transition={{
              repeat: Infinity,
              duration: item.duration,
              ease: "easeInOut"
            }}
            className={`absolute font-black font-heading tracking-tight ${item.size} ${item.opacity}`}
          >
            EasyXerox
          </motion.div>
        );
      })}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedModel, setSelectedModel] = useState('comb4');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden relative">
      
      {/* ──────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR (White Glassmorphic Bar with Zoomed Logo)
      ────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-blue-100/80 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="bg-white p-1 px-4 rounded-2xl border-2 border-blue-600 shadow-blue-glow flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="EasyXerox" className="h-12 md:h-13 w-auto object-contain scale-140 transform" />
            </div>
            <span className="text-2xl font-black font-heading text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">
              EasyXerox
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <a href="#showcase" className="hover:text-blue-600 transition-colors">Product Showcase</a>
            <a href="#models" className="hover:text-blue-600 transition-colors">Kiosk Combinations</a>
            <a href="#plug-and-play" className="hover:text-blue-600 transition-colors">Plug & Play</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/client/login')}
              className="px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-blue-glow transition-all btn-touch"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────────
          HERO SECTION (Rich Electric Blue Background with Soft White Shading)
      ────────────────────────────────────────────────────────────── */}
      <header className="relative pt-36 pb-20 px-6 overflow-hidden text-center bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white z-10">
        {/* White Shading Radial Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-white/15 via-blue-400/20 to-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-cyan-200 shadow-lg backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>★ Commercial Self-Service Xerox & Print Kiosk Network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-tight text-white"
          >
            Meet <span className="bg-gradient-to-r from-cyan-300 via-white to-blue-200 bg-clip-text text-transparent">EasyXerox</span> Kiosk. <br />
            Instant Printing & Xerox Anytime.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-blue-100 font-medium leading-relaxed max-w-3xl mx-auto"
          >
            Transform any retail shop, college campus, or metro station into an automated revenue-generating print hub. Scan QR, upload files, pay via UPI, and receive instant prints.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/client/login')}
              className="px-8 py-4 bg-white text-blue-950 hover:bg-blue-50 font-black text-base rounded-2xl shadow-2xl transition-all flex items-center gap-3 btn-touch"
            >
              <Building2 className="w-5 h-5 text-blue-700" />
              <span>Host a Kiosk / Partner Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────
          PRODUCT SHOWCASE SECTION (Front Kiosk Image + Partner Features Below)
      ────────────────────────────────────────────────────────────── */}
      <section id="showcase" className="py-20 px-6 relative overflow-hidden bg-slate-50 border-b border-blue-100 text-slate-950 z-10">
        
        {/* Organic Jumbled Floating Air Watermarks (White Background Only) */}
        <OrganicJumbledWatermark />

        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-2">Automated Kiosk Showcase</span>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
              The EasyXerox Printing Hardware
            </h2>
            <p className="text-slate-800 text-base md:text-lg font-extrabold mt-3 max-w-2xl mx-auto leading-relaxed">
              Engineered with standing touch display, heavy-duty printer bay, and 24/7 cloud connectivity.
            </p>
          </div>

          {/* Central Showcase Grid: Front View Kiosk + Floating Feature Badges */}
          <div className="relative min-h-[560px] flex items-center justify-center">
            
            {/* Background Ambient Glowing Radial Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-300/30 via-cyan-300/20 to-white/60 rounded-full blur-[110px] pointer-events-none" />

            {/* Left Column Floating Feature Badges */}
            <div className="hidden lg:flex flex-col gap-8 absolute left-8 top-1/2 -translate-y-1/2 z-20 max-w-xs text-left">
              
              {/* Badge 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: 6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:translate-x-1 transition-transform">24/7 Availability</h4>
                  <p className="text-xs text-slate-700 font-bold">Continuous automated operation without staff.</p>
                </div>
              </motion.div>

              {/* Badge 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: 6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:translate-x-1 transition-transform">Instant Silent Print</h4>
                  <p className="text-xs text-slate-700 font-bold">Instant spooler dispatch to high-speed printer.</p>
                </div>
              </motion.div>

              {/* Badge 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: 6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:translate-x-1 transition-transform">Encrypted Files</h4>
                  <p className="text-xs text-slate-700 font-bold">Secure auto-purged document transmission.</p>
                </div>
              </motion.div>
            </div>

            {/* Central Product Kiosk Cutout Image */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-10 max-w-xs md:max-w-sm mx-auto py-6"
            >
              <img
                src="/kiosk-front-only.png"
                alt="EasyXerox Commercial Self-Service Xerox Kiosk Front View"
                className="w-full h-auto object-contain max-h-[520px] filter drop-shadow-[0_25px_45px_rgba(0,102,255,0.25)] transition-transform duration-500 hover:scale-105"
              />
            </motion.div>

            {/* Right Column Floating Feature Badges */}
            <div className="hidden lg:flex flex-col gap-8 absolute right-8 top-1/2 -translate-y-1/2 z-20 max-w-xs text-left">
              
              {/* Badge 4 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: -6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plug className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:-translate-x-1 transition-transform">Plug & Play Setup</h4>
                  <p className="text-xs text-slate-700 font-bold">Just plug power & ethernet cable.</p>
                </div>
              </motion.div>

              {/* Badge 5 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: -6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:-translate-x-1 transition-transform">Seamless UPI QR</h4>
                  <p className="text-xs text-slate-700 font-bold">Instant Razorpay UPI QR payment verification.</p>
                </div>
              </motion.div>

              {/* Badge 6 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.06, x: -6 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/95 border-2 border-blue-200 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 hover:border-blue-600 hover:shadow-blue-500/20 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 font-heading group-hover:-translate-x-1 transition-transform">0 Staff Labor Cost</h4>
                  <p className="text-xs text-slate-700 font-bold">Shop partners earn automated split income.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────
              KEY PARTNER FEATURES & REQUIREMENT CARDS (Right Below Showcase)
          ────────────────────────────────────────────────────────────── */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Feature Card 1: Self-Managed Screen Ads */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6 }}
              className="p-6 bg-white border-2 border-blue-100 rounded-3xl shadow-lg hover:border-blue-600 transition-all group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-4 border border-purple-200 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-slate-950 font-heading mb-1.5 group-hover:translate-x-1 transition-transform">
                Self-Managed Screen Ads
              </h4>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                Host shop partners can upload and rotate their own shop promotions and local video advertisements directly on the touch screen.
              </p>
            </motion.div>

            {/* Feature Card 2: Live Daily Print & Income Monitoring */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6 }}
              className="p-6 bg-white border-2 border-blue-100 rounded-3xl shadow-lg hover:border-blue-600 transition-all group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-4 border border-emerald-200 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-slate-950 font-heading mb-1.5 group-hover:translate-x-1 transition-transform">
                Live Daily Print & Sales Monitor
              </h4>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                Monitor real-time daily print counts, live revenue earnings, paper stock status, and printer health live from your partner dashboard.
              </p>
            </motion.div>

            {/* Feature Card 3: What's Required - Power & Ethernet */}
            <motion.div
              whileHover={{ scale: 1.04, y: -6 }}
              className="p-6 bg-white border-2 border-blue-100 rounded-3xl shadow-lg hover:border-blue-600 transition-all group backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-4 border border-blue-200 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Plug className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black text-slate-950 font-heading mb-1.5 group-hover:translate-x-1 transition-transform">
                Simple Setup: Power & Ethernet
              </h4>
              <p className="text-xs text-slate-700 font-bold leading-relaxed">
                All you need to host or buy this kiosk in your shop is **just a standard power socket** and **an Ethernet cable or WiFi connection**!
              </p>
            </motion.div>
          </div>

        </div>

        {/* Royal Blue & Electric Cyan Animated Marquee Ticker Ribbon */}
        <div className="mt-16 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 -rotate-1 shadow-xl overflow-hidden select-none text-white">
          <div className="flex whitespace-nowrap gap-12 font-black text-sm uppercase tracking-wider animate-marquee">
            <span className="flex items-center gap-2">✦ 1. SCAN QR</span>
            <span className="flex items-center gap-2">✦ 2. UPLOAD FILE</span>
            <span className="flex items-center gap-2">✦ 3. REVIEW PRINT SETTINGS</span>
            <span className="flex items-center gap-2">✦ 4. PAY UPI</span>
            <span className="flex items-center gap-2">✦ 5. INSTANT PRINT DISPATCH</span>
            
            <span className="flex items-center gap-2">✦ 1. SCAN QR</span>
            <span className="flex items-center gap-2">✦ 2. UPLOAD FILE</span>
            <span className="flex items-center gap-2">✦ 3. REVIEW PRINT SETTINGS</span>
            <span className="flex items-center gap-2">✦ 4. PAY UPI</span>
            <span className="flex items-center gap-2">✦ 5. INSTANT PRINT DISPATCH</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          KIOSK HARDWARE VARIANTS & COMBINATIONS (2x2 GRID = 4 PRODUCT COMBINATIONS)
          (Combination 1: 10" / 150 Sheets | Combination 2: 10" / 500 Sheets)
          (Combination 3: 15" / 150 Sheets | Combination 4: 15" / 500 Sheets)
      ────────────────────────────────────────────────────────────── */}
      <section id="models" className="py-20 px-6 bg-white border-b border-blue-100 z-10 relative overflow-hidden">
        
        {/* Organic Jumbled Floating Air Watermark */}
        <OrganicJumbledWatermark />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
              <Layers className="w-4 h-4" />
              <span>4 Hardware Product Combinations</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
              Choose Your Hardware Combination
            </h2>
            <p className="mt-4 text-slate-700 text-base md:text-lg font-bold leading-relaxed">
              Mix and match between 10" or 15" touch boards and 150-page or 500-page printer capacities.
            </p>
          </div>

          {/* 4 Product Combination Cards Grid (2x2 Matrix) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Combination 1: 10" Touch Board + 150 Pages Capacity */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedModel('comb1')}
              className={`p-8 bg-slate-50/90 backdrop-blur-sm border-2 rounded-3xl transition-all duration-300 relative flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl ${
                selectedModel === 'comb1'
                  ? 'border-blue-600 ring-4 ring-blue-500/20 bg-gradient-to-b from-blue-50/80 to-white'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                <span className="px-3.5 py-1 bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-widest rounded-lg border border-slate-300">
                  Combination #1
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-1">EasyXerox Lite</h3>
                <p className="text-xs text-slate-600 font-bold mb-6">10" Compact Touch + 150 Page Tray</p>

                <div className="space-y-4 py-4 border-y border-slate-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Touch Display:</span>
                    <span className="font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-lg text-xs">
                      10" Touch Board
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Printer Capacity:</span>
                    <span className="font-black text-slate-950 bg-slate-200 px-3 py-1 rounded-lg text-xs">
                      150 Pages Capacity
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Print Engine:</span>
                    <span className="font-black text-slate-950">High-Speed Laser</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Best For:</span>
                    <span className="font-black text-emerald-600">Local Retail Shops</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Instant Mobile QR Upload</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Razorpay UPI QR Payment Scanner</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => navigate('/client/login')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 btn-touch"
                >
                  <span>Select 10" / 150 Pages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Combination 2: 10" Touch Board + 500 Pages Capacity */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedModel('comb2')}
              className={`p-8 bg-slate-50/90 backdrop-blur-sm border-2 rounded-3xl transition-all duration-300 relative flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl ${
                selectedModel === 'comb2'
                  ? 'border-blue-600 ring-4 ring-blue-500/20 bg-gradient-to-b from-blue-50/80 to-white'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                <span className="px-3.5 py-1 bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest rounded-lg border border-blue-200">
                  Combination #2
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-1">EasyXerox Compact Heavy</h3>
                <p className="text-xs text-slate-600 font-bold mb-6">10" Compact Touch + 500 Heavy Page Tray</p>

                <div className="space-y-4 py-4 border-y border-slate-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Touch Display:</span>
                    <span className="font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-lg text-xs">
                      10" Touch Board
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Printer Capacity:</span>
                    <span className="font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-lg text-xs">
                      500 Pages Capacity
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Print Engine:</span>
                    <span className="font-black text-slate-950">Heavy-Duty Auto Duplex</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Best For:</span>
                    <span className="font-black text-blue-600">Busy Retail & Xerox Outlets</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Heavy 500-Sheet Paper Bay</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Double-Sided Duplex Fast Print</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => navigate('/client/login')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 btn-touch"
                >
                  <span>Select 10" / 500 Pages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Combination 3: 15" Touch Board + 150 Pages Capacity */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedModel('comb3')}
              className={`p-8 bg-slate-50/90 backdrop-blur-sm border-2 rounded-3xl transition-all duration-300 relative flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl ${
                selectedModel === 'comb3'
                  ? 'border-blue-600 ring-4 ring-blue-500/20 bg-gradient-to-b from-blue-50/80 to-white'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                <span className="px-3.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-black uppercase tracking-widest rounded-lg border border-cyan-200">
                  Combination #3
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-1">EasyXerox Display Max</h3>
                <p className="text-xs text-slate-600 font-bold mb-6">15" HD Screen + 150 Standard Page Tray</p>

                <div className="space-y-4 py-4 border-y border-slate-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Touch Display:</span>
                    <span className="font-black text-cyan-800 bg-cyan-100 px-3 py-1 rounded-lg text-xs">
                      15" Full HD Touch Board
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Printer Capacity:</span>
                    <span className="font-black text-slate-950 bg-slate-200 px-3 py-1 rounded-lg text-xs">
                      150 Pages Capacity
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Ad Monetization:</span>
                    <span className="font-black text-emerald-600">Full Screen Video Ads</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Best For:</span>
                    <span className="font-black text-cyan-600">High-Visual Outlets</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Large 15" HD Screen Video Ad Display</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Self-Managed Shop Promotions</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => navigate('/client/login')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 btn-touch"
                >
                  <span>Select 15" / 150 Pages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Combination 4: 15" Touch Board + 500 Pages Capacity */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => setSelectedModel('comb4')}
              className={`p-8 bg-white/95 backdrop-blur-sm border-2 rounded-3xl transition-all duration-300 relative flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl ${
                selectedModel === 'comb4'
                  ? 'border-blue-600 ring-4 ring-blue-500/25 bg-gradient-to-b from-blue-50/80 to-white scale-105 z-10'
                  : 'border-blue-300 hover:border-blue-600'
              }`}
            >
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-yellow-300" />
                <span>★ Ultimate Commercial Combination</span>
              </div>

              <div>
                <span className="px-3.5 py-1 bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-widest rounded-lg border border-blue-200 inline-block mt-2">
                  Combination #4
                </span>
                <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-1">EasyXerox Pro Ultimate</h3>
                <p className="text-xs text-slate-600 font-bold mb-6">15" HD Screen + 500 Heavy Page Tray</p>

                <div className="space-y-4 py-4 border-y border-blue-100 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Touch Display:</span>
                    <span className="font-black text-blue-700 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg text-xs">
                      15" Full HD Touch Board
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Printer Capacity:</span>
                    <span className="font-black text-blue-800 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg text-xs">
                      500 Pages Capacity
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Print Engine:</span>
                    <span className="font-black text-slate-950">Heavy-Duty Auto Duplex</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-bold">Best For:</span>
                    <span className="font-black text-blue-600">Campuses & Metro Stations</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Large 15" Touch + 500 Sheet Heavy Tray</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Self-Managed Screen Ad Monetization</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-100">
                <button
                  onClick={() => navigate('/client/login')}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 btn-touch"
                >
                  <span>Select 15" / 500 Pages & Onboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          SHOP PARTNERS: ZERO EFFORT PLUG & PLAY SETUP (Light Theme)
      ────────────────────────────────────────────────────────────── */}
      <section id="plug-and-play" className="py-20 px-6 bg-slate-50 border-y border-blue-100 z-10 relative overflow-hidden">
        
        {/* Organic Jumbled Floating Air Watermark */}
        <OrganicJumbledWatermark />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
              <Plug className="w-4 h-4" />
              <span>Zero-Effort Partner Setup</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
              Just Plug Power & Ethernet Cable. <br />
              <span className="text-blue-600">That's All You Need To Start Earning.</span>
            </h2>
            <p className="mt-4 text-slate-700 text-base font-bold leading-relaxed">
              No complex installation, no staff required, and zero operational hassle. Buying or hosting an EasyXerox kiosk requires only two standard connections in your shop!
            </p>
          </div>

          {/* 2 Connections Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Connection 1: Power Socket */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 border-2 border-blue-100 rounded-3xl p-8 hover:border-blue-600 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden group cursor-pointer backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-100 transition-all" />
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-blue-glow group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Plug className="w-8 h-8" />
              </div>
              <span className="px-3.5 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-lg border border-blue-200">
                Requirement #1
              </span>
              <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-2 group-hover:translate-x-1 transition-transform">Power Socket</h3>
              <p className="text-sm text-slate-700 font-bold leading-relaxed">
                Plug the kiosk power cord into any wall power socket. Built-in surge protection keeps it running safely 24/7.
              </p>
            </motion.div>

            {/* Connection 2: Ethernet Cable */}
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 border-2 border-blue-100 rounded-3xl p-8 hover:border-blue-600 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden group cursor-pointer backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-100 transition-all" />
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Wifi className="w-8 h-8" />
              </div>
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-lg border border-emerald-200">
                Requirement #2
              </span>
              <h3 className="text-2xl font-black text-slate-950 font-heading mt-4 mb-2 group-hover:translate-x-1 transition-transform">Ethernet Cable or WiFi</h3>
              <p className="text-sm text-slate-700 font-bold leading-relaxed">
                Connect your router via an Ethernet cable or WiFi. The kiosk automatically syncs print orders and payments.
              </p>
            </motion.div>
          </div>

          {/* Shop Partner Workflow Summary Banner */}
          <div className="mt-12 max-w-5xl mx-auto bg-white/95 border-2 border-blue-200 rounded-3xl p-8 text-center flex flex-wrap items-center justify-between gap-6 shadow-xl backdrop-blur-sm">
            <div className="text-left max-w-xl">
              <h4 className="text-xl font-black text-slate-950 font-heading">Ready to Place a Kiosk in Your Shop?</h4>
              <p className="text-xs text-slate-700 font-bold mt-1">Once plugged in, the machine self-boots, connects to EasyXerox cloud, and starts generating automated daily split revenue.</p>
            </div>
            <button
              onClick={() => navigate('/client/login')}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-blue-glow transition-all btn-touch flex items-center gap-2"
            >
              <span>Onboard Your Shop Location</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          CORE FEATURES GRID (Organic Jumbled Floating Air Watermarks)
      ────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-white border-b border-blue-100 z-10 relative overflow-hidden">
        
        {/* Organic Jumbled Floating Air Watermark */}
        <OrganicJumbledWatermark />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">
              Engineered For Speed & Reliability
            </h2>
            <h3 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
              Complete End-to-End Self-Service Ecosystem
            </h3>
            <p className="text-slate-700 text-base font-bold mt-4">
              Everything needed to operate commercial printing kiosks with zero staff dependency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-blue-100 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <QrCode className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Instant QR Mobile Upload
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Customers scan the on-screen machine QR code to open the responsive upload website. No mobile app download or registration required.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <CreditCard className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Seamless UPI QR Payments
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Integrated Razorpay payment gateway generates dynamic UPI QR codes for GPay, PhonePe, Paytm, and BHIM with live status verification.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-indigo-100 border border-indigo-200 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <Zap className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Windows Silent Print Daemon
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Local background node daemon monitors printer health (Paper Out, Toner Low) and executes silent prints straight to the print spooler.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-purple-100 border border-purple-200 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <Tv className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Self-Managed Video Ads
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Idle kiosk screens auto-rotate high-definition video & image advertising carousels, unlocking an extra passive income stream for host locations.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Partner Earning Analytics
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Comprehensive Client Partner portal tracks total sales, machine pings, paper levels, and automated commission payouts.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              whileHover={{ scale: 1.05, y: -8, rotateY: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-slate-50/90 border-2 border-slate-200 rounded-3xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group shadow-md hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 group-hover:rotate-12 group-hover:bg-white group-hover:text-blue-600 transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-black text-slate-950 group-hover:text-white font-heading mb-3 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">
                Commercial Hardware Guard
              </h4>
              <p className="text-sm text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">
                Physical kiosks enforce strict local hardware guards, blocking external browser access and maintaining uninterrupted kiosk display operation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          INTERACTIVE STEP CARDS WITH ANIMATED WATER FLOW CONNECTOR BEAMS
      ────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-50 border-b border-blue-100 z-10 relative overflow-hidden">
        
        {/* Organic Jumbled Floating Air Watermark */}
        <OrganicJumbledWatermark />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-2">Simple & Intuitive</span>
            <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
              How EasyXerox Works
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-2xl border-2 border-blue-200 inline-flex gap-2 shadow-md">
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeTab === 'customers'
                    ? 'bg-blue-600 text-white shadow-blue-glow'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>For Printing Customers</span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeTab === 'partners'
                    ? 'bg-blue-600 text-white shadow-blue-glow'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>For Shop Partners</span>
              </button>
            </div>
          </div>

          {/* Tab Content 1: Customers */}
          {activeTab === 'customers' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Step Card 01 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-3xl shadow-xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-blue-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">01</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">Scan Machine QR</h4>
                <p className="text-xs text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Scan the unique kiosk QR code using any smartphone camera or WhatsApp to open the instant upload webpage.</p>
              </motion.div>

              {/* Animated Flowing Liquid Water Stream Pipeline 1 */}
              <div className="hidden md:flex flex-1 items-center justify-center relative px-2 py-4">
                <div className="w-full h-4 bg-blue-100/90 rounded-full overflow-hidden relative shadow-inner border border-blue-300">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-3/4 bg-gradient-to-r from-transparent via-cyan-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.9)]"
                  />
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-white z-20">
                  <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Step Card 02 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-3xl shadow-xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-blue-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">02</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">Upload & Select Copies</h4>
                <p className="text-xs text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Choose PDF documents, select B&W or Color, set copies, single or duplex printing, and calculate total price.</p>
              </motion.div>

              {/* Animated Flowing Liquid Water Stream Pipeline 2 */}
              <div className="hidden md:flex flex-1 items-center justify-center relative px-2 py-4">
                <div className="w-full h-4 bg-blue-100/90 rounded-full overflow-hidden relative shadow-inner border border-blue-300">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-3/4 bg-gradient-to-r from-transparent via-cyan-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.9)]"
                  />
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-white z-20">
                  <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Step Card 03 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-3xl shadow-xl hover:border-blue-600 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-blue-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">03</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">Pay UPI & Collect Print</h4>
                <p className="text-xs text-slate-700 group-hover:text-blue-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Scan the dynamic Razorpay UPI QR code on the touchscreen. Once payment verifies, silent printing starts instantly.</p>
              </motion.div>
            </div>
          )}

          {/* Tab Content 2: Partners */}
          {activeTab === 'partners' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Partner Step Card 01 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-3xl shadow-xl hover:border-emerald-600 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-emerald-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">01</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">Host Machine Hardware</h4>
                <p className="text-xs text-slate-700 group-hover:text-emerald-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Place our kiosk in your retail shop, metro station, college campus, or venue. Plug in power & Ethernet cable.</p>
              </motion.div>

              {/* Animated Flowing Liquid Water Stream Pipeline 1 (Emerald) */}
              <div className="hidden md:flex flex-1 items-center justify-center relative px-2 py-4">
                <div className="w-full h-4 bg-emerald-100/90 rounded-full overflow-hidden relative shadow-inner border border-emerald-300">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-3/4 bg-gradient-to-r from-transparent via-teal-300 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.9)]"
                  />
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white z-20">
                  <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Partner Step Card 02 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-3xl shadow-xl hover:border-emerald-600 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-emerald-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">02</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">100% Revenue & 1 Year Free Software</h4>
                <p className="text-xs text-slate-700 group-hover:text-emerald-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Buy the product and keep 100% print earnings! Get 1 Year FREE EasyXerox Cloud Software. After 1 year, simply pay an annual software fee with zero per-print commissions.</p>
              </motion.div>

              {/* Animated Flowing Liquid Water Stream Pipeline 2 (Emerald) */}
              <div className="hidden md:flex flex-1 items-center justify-center relative px-2 py-4">
                <div className="w-full h-4 bg-emerald-100/90 rounded-full overflow-hidden relative shadow-inner border border-emerald-300">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-3/4 bg-gradient-to-r from-transparent via-teal-300 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.9)]"
                  />
                </div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 border-2 border-white z-20">
                  <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </div>

              {/* Partner Step Card 03 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex-1 w-full p-8 bg-white/95 backdrop-blur-sm border-2 border-emerald-200 rounded-3xl shadow-xl hover:border-emerald-600 hover:bg-gradient-to-br hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl font-black font-heading text-emerald-600/30 group-hover:text-white/40 mb-4 transition-colors group-hover:scale-110 transform origin-left">03</div>
                <h4 className="text-xl font-black text-slate-950 group-hover:text-white mb-2 group-hover:translate-x-1.5 group-hover:tracking-wide transition-all duration-300">Track on Dashboard</h4>
                <p className="text-xs text-slate-700 group-hover:text-emerald-50 font-bold leading-relaxed group-hover:translate-x-1 transition-all duration-300">Log into your Client Partner portal to view real-time daily earnings, paper status, and transaction history.</p>
              </motion.div>
            </div>
          )}
        </div>
      </section>



      {/* ──────────────────────────────────────────────────────────────
          PARTNER CTA BANNER (Royal Blue Gradient Banner)
      ────────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-6 z-10 relative">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 border-2 border-blue-400 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white max-w-3xl mx-auto leading-tight">
            Ready to Monetize Your Space with Self-Service Printing?
          </h2>
          <p className="mt-4 text-blue-100 text-base md:text-lg max-w-2xl mx-auto font-medium">
            Join hundreds of shop owners and venue partners earning passive daily income. Just plug power & Ethernet to start.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/client/login')}
              className="px-8 py-4 bg-white text-blue-950 hover:bg-blue-50 font-black text-base rounded-xl shadow-2xl transition-all flex items-center gap-2 btn-touch"
            >
              <span>Log In to Partner Portal</span>
              <ArrowRight className="w-5 h-5 text-blue-700" />
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          FOOTER SECTION (Dark Royal Blue & Slate Black with Zoomed White Logo)
      ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 bg-slate-950 pt-20 pb-12 px-8 text-sm text-slate-300 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-slate-800">
          
          {/* Column 1: Brand & Instagram */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 px-5 rounded-2xl border-2 border-blue-500 shadow-blue-glow flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
                <img src="/logo.png" alt="EasyXerox" className="h-14 md:h-16 w-auto object-contain scale-140 transform" />
              </div>
              <span className="text-2xl font-black font-heading text-white tracking-tight">
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
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white text-sm font-black rounded-2xl shadow-xl transition-all btn-touch group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>Follow @easy_xerox on Instagram</span>
                <ExternalLink className="w-4 h-4 opacity-90" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 font-heading border-b border-slate-800 pb-3">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <a href="#showcase" className="hover:text-blue-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span>Product Showcase</span>
                </a>
              </li>
              <li>
                <a href="#models" className="hover:text-blue-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span>Kiosk Models</span>
                </a>
              </li>
              <li>
                <a href="#plug-and-play" className="hover:text-blue-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span>Plug & Play Setup</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors flex items-center gap-2.5">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                  <span>How It Works</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6 font-heading border-b border-slate-800 pb-3">
              Contact & Support
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-start gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="leading-snug">Flat 202, Gandham Nest, Police Battalion Colony, Kondapur, Hyderabad, Telangana 500084</span>
              </li>
              <li className="flex items-start gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="leading-snug">
                  <a href="tel:+918885600899" className="hover:text-emerald-400 transition-colors block">+91 88856 00899</a>
                  <a href="tel:+919908849889" className="hover:text-emerald-400 transition-colors block">+91 99088 49889</a>
                </div>
              </li>
              <li className="flex items-center gap-3.5 text-slate-200">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:support@easyxerox.com" className="hover:text-cyan-400 transition-colors">support@easyxerox.com</a>
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
            <a href="#terms" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="https://www.instagram.com/easy_xerox" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-2 text-pink-400 font-bold">
              <Instagram className="w-4 h-4" />
              <span>@easy_xerox</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Kiosk Print Simulator Modal */}
      <InteractivePrintSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
