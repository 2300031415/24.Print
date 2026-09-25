import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Wrench, Wifi, Printer, Server, RefreshCw, Power, X, Check, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const AdminModeModal = ({ isOpen, onClose, machine, isConnected }) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Default security PIN (can be verified against backend/local config)
    if (pin === '1234' || pin === '9999') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid Security PIN. Access Denied.');
      setPin('');
    }
  };

  const handleTestPrint = async () => {
    setActionLoading(true);
    setActionNotice('Dispatched hardware test print to spooler...');
    try {
      await api.post(`/machines/code/${machine?.machine_code || 'KIOSK-001'}/test-print`);
    } catch (_) {}
    setTimeout(() => {
      setActionLoading(false);
    }, 2000);
  };

  const handleToggleMaintenance = async () => {
    setActionLoading(true);
    const newStatus = machine?.status === 'maintenance' ? 'online' : 'maintenance';
    try {
      await api.put(`/machines/${machine?.id}/status`, { status: newStatus });
      setActionNotice(`Machine status switched to ${newStatus.toUpperCase()}`);
    } catch (err) {
      setActionNotice(`Status update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReboot = () => {
    if (window.confirm('Are you sure you want to reboot this Kiosk Appliance?')) {
      fetch('http://localhost:5050/api/system/reboot', { method: 'POST' }).catch(() => {});
      alert('Reboot sequence initiated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg select-none font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-heading tracking-wide">
                Technician & Admin Mode
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Hardware ID: {machine?.machine_code || 'KIOSK-001'} • v2.1-Appliance
              </p>
            </div>
          </div>
          <button
            onClick={() => { setIsUnlocked(false); setPin(''); onClose(); }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* PIN Screen */}
        {!isUnlocked ? (
          <form onSubmit={handlePinSubmit} className="p-10 flex flex-col items-center justify-center text-center">
            <Wrench className="w-12 h-12 text-amber-400 mb-4 animate-pulse" />
            <h3 className="text-xl font-bold mb-2">Restricted Access</h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Enter the 4-digit technician security PIN to access system diagnostics.
            </p>

            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
              className="w-48 text-center text-3xl font-mono tracking-widest py-3 px-4 bg-slate-950 border-2 border-slate-700 rounded-2xl text-white outline-none focus:border-amber-400 transition-all mb-4"
            />

            {errorMsg && (
              <span className="text-xs font-bold text-rose-400 mb-4">{errorMsg}</span>
            )}

            <button
              type="submit"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition-all"
            >
              Unlock Console
            </button>
          </form>
        ) : (
          /* Diagnostic Dashboard */
          <div className="p-8 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Machine Health Box */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Machine Status
                </span>
                <span className={`text-lg font-black font-mono ${
                  machine?.status === 'online' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {(machine?.status || 'ONLINE').toUpperCase()}
                </span>
              </div>

              {/* Network Box */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Backend Link
                </span>
                <span className={`text-lg font-black font-mono ${
                  isConnected ? 'text-blue-400' : 'text-rose-400'
                }`}>
                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 flex flex-col gap-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Printer Target:</span>
                <span className="font-bold text-white">{machine?.default_printer_name || 'System Default CUPS Spooler'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location Address:</span>
                <span className="font-bold text-white">{machine?.location_address || 'Main Branch Floor 1'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Public Domain:</span>
                <span className="font-bold text-white">https://easyxerox.com</span>
              </div>
            </div>

            {actionNotice && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-mono font-bold">
                ℹ️ {actionNotice}
              </div>
            )}

            {/* Admin Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleTestPrint}
                disabled={actionLoading}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Test Print</span>
              </button>

              <button
                onClick={handleToggleMaintenance}
                disabled={actionLoading}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Maintenance</span>
              </button>

              <button
                onClick={handleReboot}
                className="py-3 px-4 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold text-xs rounded-xl border border-rose-800 flex items-center justify-center gap-2"
              >
                <Power className="w-4 h-4 text-rose-400" />
                <span>Reboot PC</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminModeModal;
