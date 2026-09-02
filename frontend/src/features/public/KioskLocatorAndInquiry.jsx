import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Building2,
  Printer,
  CheckCircle2,
  Wifi,
  Search,
  Send,
  Sparkles,
  Phone,
  Mail,
  User,
  X,
  ArrowRight,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';

const KIOSK_LOCATIONS = [
  {
    id: 'DEMO01',
    name: 'University Student Union Kiosk',
    category: 'Campus',
    address: 'Main Library Block, Campus Square',
    status: 'online',
    paperLevel: 92,
    model: '15" HD Screen + 500 Sheet Heavy Tray',
    rate: '₹2 / B&W • ₹10 / Color'
  },
  {
    id: 'DEMO02',
    name: 'Central Metro Station Hub',
    category: 'Metro',
    address: 'Concourse Level, Exit Gate 3',
    status: 'online',
    paperLevel: 85,
    model: '15" HD Screen + 500 Sheet Heavy Tray',
    rate: '₹2 / B&W • ₹10 / Color'
  },
  {
    id: 'DEMO03',
    name: 'Tech Park Food Court Outlet',
    category: 'Corporate',
    address: 'Tower B, Ground Floor Arcade',
    status: 'online',
    paperLevel: 78,
    model: '10" Touch Board + 500 Sheet Tray',
    rate: '₹2 / B&W • ₹10 / Color'
  },
  {
    id: 'DEMO04',
    name: 'City Central Public Library',
    category: 'Public',
    address: 'Reading Hall Wing 2',
    status: 'online',
    paperLevel: 95,
    model: '10" Touch Board + 150 Sheet Tray',
    rate: '₹2 / B&W • ₹10 / Color'
  }
];

const KioskLocatorAndInquiry = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  
  // Partner inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    venueName: '',
    venueType: 'College Campus',
    city: '',
    footfall: '1,000+ daily'
  });

  const filteredLocations = KIOSK_LOCATIONS.filter((kiosk) => {
    const matchesSearch =
      kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kiosk.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'All' || kiosk.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setIsInquiryOpen(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        venueName: '',
        venueType: 'College Campus',
        city: '',
        footfall: '1,000+ daily'
      });
    }, 2500);
  };

  return (
    <div className="space-y-16">
      
      {/* ──────────────────────────────────────────────────────────────
          SECTION HEADER: LIVE KIOSK NETWORK LOCATOR
      ────────────────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-xs font-black uppercase tracking-wider mb-4">
          <MapPin className="w-4 h-4" />
          <span>Active Commercial Vending Network</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-950">
          Find An EasyXerox Kiosk Near You
        </h2>
        <p className="mt-3 text-slate-700 text-base md:text-lg font-bold leading-relaxed">
          Locate nearest automated printing vending machines active across university campuses, metro stations, and retail hubs.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="max-w-4xl mx-auto bg-white/95 border-2 border-blue-200 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campus, metro, or city area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {['All', 'Campus', 'Metro', 'Corporate', 'Public'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedCat === cat
                  ? 'bg-blue-600 text-white shadow-blue-glow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Kiosk Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {filteredLocations.map((kiosk) => (
          <motion.div
            key={kiosk.id}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/95 border-2 border-blue-100 rounded-3xl p-6 shadow-lg hover:border-blue-600 transition-all flex flex-col justify-between backdrop-blur-sm group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider rounded-lg border border-blue-200">
                  {kiosk.category} • Code: {kiosk.id}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Online 🟢</span>
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-950 font-heading mb-1 group-hover:text-blue-600 transition-colors">
                {kiosk.name}
              </h3>
              <p className="text-xs text-slate-600 font-bold flex items-center gap-1.5 mb-4">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{kiosk.address}</span>
              </p>

              <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hardware Spec:</span>
                  <span className="font-extrabold text-slate-900">{kiosk.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paper Level:</span>
                  <span className="font-extrabold text-emerald-600">{kiosk.paperLevel}% Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard Pricing:</span>
                  <span className="font-extrabold text-blue-700">{kiosk.rate}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`/upload/${kiosk.id}`}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-blue-glow text-center transition-all flex items-center justify-center gap-2 btn-touch"
              >
                <span>Upload & Print Here</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────────
          HOST / FRANCHISE INQUIRY CTA BANNER
      ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 text-white shadow-2xl flex flex-wrap items-center justify-between gap-6 border border-blue-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-xl relative z-10 space-y-2">
          <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider">
            Host or Franchise an EasyXerox Kiosk
          </span>
          <h3 className="text-2xl md:text-3xl font-black font-heading text-white">
            Want an Automated Print Hub in Your Shop or Campus?
          </h3>
          <p className="text-xs text-blue-100 font-medium leading-relaxed">
            Host location partners earn continuous automated split revenue with ZERO staff cost. Plug power and Ethernet cable to begin.
          </p>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => setIsInquiryOpen(true)}
            className="px-8 py-4 bg-white text-blue-950 hover:bg-blue-50 font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-3 btn-touch"
          >
            <Building2 className="w-5 h-5 text-blue-700" />
            <span>Apply to Host a Kiosk</span>
            <ArrowRight className="w-4 h-4 text-blue-700" />
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────
          PARTNER INQUIRY MODAL FORM
      ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isInquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-blue-200 overflow-hidden text-slate-900 my-8 p-8"
            >
              <div className="flex items-center justify-between border-b border-blue-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-heading text-slate-950">Host Location Inquiry</h3>
                    <p className="text-xs text-slate-500 font-medium">Partner with EasyXerox Self-Printing Network</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsInquiryOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inquirySuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-950 font-heading">Application Submitted!</h4>
                  <p className="text-xs text-slate-600 font-semibold max-w-sm mx-auto">
                    Thank you! Our commercial deployment manager will review your location details and contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs font-bold text-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="partner@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">City / Region *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bangalore / Hyderabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 mb-1">Shop / Venue Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Campus Stationary Hub"
                        value={formData.venueName}
                        onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Venue Type</label>
                      <select
                        value={formData.venueType}
                        onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="College Campus">College Campus / Hostel</option>
                        <option value="Metro Station">Metro / Railway Station</option>
                        <option value="Retail Xerox Shop">Retail Xerox & Stationary Shop</option>
                        <option value="Public Library">Public Library / Cyber Cafe</option>
                        <option value="Corporate Office">Corporate Office Building</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-blue-glow transition-all flex items-center justify-center gap-2 btn-touch"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Partner Location Application</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default KioskLocatorAndInquiry;
