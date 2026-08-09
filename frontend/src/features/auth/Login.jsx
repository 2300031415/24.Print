import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Printer, ShieldCheck, Building } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const Login = () => {
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

  const handleQuickFill = (roleType) => {
    if (roleType === 'admin') {
      setEmail('admin@printkiosk.com');
      setPassword('Admin@123');
    } else {
      setEmail('owner@metroprints.com');
      setPassword('Client@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none relative overflow-hidden font-sans">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="logo-badge mb-4 py-3 px-6 shadow-blue-glow">
            <img src="/logo.png" alt="EasyXerox" className="h-14 w-auto object-contain" />
          </div>
          <h1 className="text-xl font-bold font-heading text-slate-200">
            Control & Partner Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your Xerox & Printing management dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* DEMO QUICK FILL SELECTOR */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 font-semibold mb-3 text-center">Quick Fill Credentials for Demo:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 btn-touch ${
                email === 'admin@printkiosk.com'
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Super Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('client')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 btn-touch ${
                email === 'owner@metroprints.com'
                  ? 'bg-indigo-950/80 border-indigo-400 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Building className="w-4 h-4 text-indigo-400" />
              <span>Client Owner</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
