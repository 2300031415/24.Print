import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="logo-badge mb-4 py-3 px-6 shadow-cyan-glow mx-auto inline-flex border border-cyan-500/40">
            <img src="/logo.png" alt="EasyXerox" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-white">
            Super Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Dedicated Kiosk Fleet Control & Platform Analytics
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-300 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-medium transition-all"
                placeholder="admin@printkiosk.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-medium transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Sign In to Super Admin Dashboard</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Button */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@printkiosk.com');
              setPassword('Admin@123');
            }}
            className="w-full p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-2 btn-touch hover:bg-cyan-900/50"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Fill Super Admin Credentials (admin@printkiosk.com)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
