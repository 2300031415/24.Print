import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Building } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

const ClientLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('owner@metroprints.com');
  const [password, setPassword] = useState('Client@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-cyan-glow mx-auto mb-4">
            <Building className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-white">
            Client Owner Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track Revenue, Kiosks & Promotional Ads
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
              Client Account Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In to Portal</span>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-500">
            Demo Client Credentials: <span className="text-cyan-400">owner@metroprints.com</span> / <span className="text-cyan-400">Client@123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientLogin;
