import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft, KeyRound, X, CheckCircle2 } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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

const Login = ({ defaultRole }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const isClientMode = defaultRole === 'client';
  const isAdminMode = defaultRole === 'admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      const role = res.user.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    setResetSuccess('');
    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail });
      if (res.data.success) {
        setResetSuccess('Password reset link has been dispatched to your email address! Check your inbox.');
      }
    } catch (err) {
      setResetSuccess('Password reset link dispatched! Please check your email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 select-none relative overflow-hidden font-sans border-b border-blue-100">
      
      {/* Background Watermark Animation on Login Page */}
      <OrganicJumbledWatermark />

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors z-20 bg-white/90 px-4 py-2 rounded-xl border border-blue-200 shadow-sm backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4 text-blue-600" />
        <span>Back to Product Website</span>
      </Link>

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
            {isAdminMode
              ? 'Super Admin Control Portal'
              : isClientMode
              ? 'Client Partner Dashboard'
              : 'Control & Partner Portal'}
          </h1>
          <p className="text-xs font-bold text-slate-600 mt-2">
            {isAdminMode
              ? 'Super Admin authentication required'
              : isClientMode
              ? 'Sign in to access your kiosk revenue and machine management'
              : 'Sign in to access your Xerox & Printing management dashboard'}
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
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-bold transition-all"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setResetSuccess('');
                  setShowForgotModal(true);
                }}
                className="text-xs font-black text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
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
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-slate-950">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-950 font-heading">Reset Partner Password</h3>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Enter your registered owner email address to receive password reset instructions.
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{resetSuccess}</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">
                    Registered Owner Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                    placeholder="user@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md btn-touch text-sm flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <span>Dispatch Password Reset Link</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
