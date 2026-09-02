import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

/* ──────────────────────────────────────────────────────────────
    ORGANIC JUMBLED FLOATING "EasyXerox" AIR WATERMARK COMPONENT
────────────────────────────────────────────────────────────── */
const OrganicJumbledWatermark = () => {
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
      case 1:
        return { animate: { rotate: [0, 180, 360], y: [0, -30, 15, 0], x: [0, 25, -25, 0] } };
      case 2:
        return { animate: { rotate: [-30, 30, -30], y: [0, 35, -20, 0], scale: [0.9, 1.2, 0.9] } };
      case 3:
        return { animate: { x: [-30, 30, -30], scale: [0.85, 1.25, 0.85], rotate: [20, -20, 20] } };
      case 4:
        return { animate: { rotateY: [0, 180, 360], y: [-25, 25, -25], x: [20, -20, 20] } };
      case 5:
      default:
        return { animate: { x: [0, -35, 25, 0], y: [0, -25, 20, 0], rotate: [-35, 35, -35] } };
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
            transition={{ repeat: Infinity, duration: item.duration, ease: "easeInOut" }}
            className={`absolute font-black font-heading tracking-tight ${item.size} ${item.opacity}`}
          >
            EasyXerox
          </motion.div>
        );
      })}
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@printkiosk.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        setErrorMsg('Access denied. Super Admin role required.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 select-none relative overflow-hidden font-sans border-b border-blue-100">
      
      {/* Background Watermark Animation on Login Page */}
      <OrganicJumbledWatermark />

      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-300/30 via-cyan-300/20 to-white/60 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-2xl border-2 border-blue-200 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 text-slate-950"
      >
        <div className="text-center mb-8">
          <div className="bg-white p-2 px-5 rounded-2xl border-2 border-blue-600 shadow-blue-glow inline-flex items-center justify-center mb-5 overflow-hidden">
            <img src="/logo.png" alt="EasyXerox" className="h-12 w-auto object-contain scale-140 transform" />
          </div>
          <h1 className="text-2xl font-black font-heading text-slate-950">
            Super Admin Control Portal
          </h1>
          <p className="text-xs font-bold text-slate-600 mt-2">
            Dedicated Kiosk Fleet Control & Platform Analytics
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-extrabold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                placeholder="admin@printkiosk.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-blue-glow btn-touch text-base flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <span>Sign In to Super Admin Dashboard</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Button */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@printkiosk.com');
              setPassword('Admin@123');
            }}
            className="w-full p-3.5 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-black transition-all flex items-center justify-center gap-2 btn-touch"
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Fill Super Admin Credentials (admin@printkiosk.com)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
