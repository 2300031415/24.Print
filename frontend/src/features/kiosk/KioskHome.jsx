import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Wifi, WifiOff, Sparkles, Clock, ShieldCheck } from 'lucide-react';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const KioskHome = () => {
  const { machineId = 'KIOSK-001' } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const [machine, setMachine] = useState(null);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [printerStatus, setPrinterStatus] = useState('ready');

  // Load Machine Info & Ads
  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const res = await api.get(`/machines/code/${machineId}`);
        if (res.data.success) {
          setMachine(res.data.machine);
          setPrinterStatus(res.data.machine.printer_status || 'ready');
        }
      } catch (err) {
        console.error('Error fetching machine details:', err);
      }
    };

    const fetchMachineAds = async () => {
      try {
        const res = await api.get(`/machines/code/${machineId}/ads`);
        if (res.data.success && res.data.ads.length > 0) {
          setAds(res.data.ads);
        } else {
          // Fallback vibrant promotional slides
          setAds([
            {
              id: 'fallback-1',
              title: 'Metro Prints - Fast High-Speed Printing',
              media_url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80',
              media_type: 'image',
              bg_gradient: 'from-cyan-900/80 to-slate-900'
            },
            {
              id: 'fallback-2',
              title: 'Scan QR Code to Print Instantly from Mobile',
              media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
              media_type: 'image',
              bg_gradient: 'from-indigo-900/80 to-slate-900'
            },
            {
              id: 'fallback-3',
              title: 'Special Student Discount on Bulk Document Printing',
              media_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
              media_type: 'image',
              bg_gradient: 'from-purple-900/80 to-slate-900'
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading ads:', err);
      }
    };

    fetchMachineDetails();
    fetchMachineAds();
  }, [machineId]);

  // Live Digital Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Advertisement 10-Second Auto Slider
  useEffect(() => {
    if (ads.length <= 1) return;
    const adInterval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 10000);
    return () => clearInterval(adInterval);
  }, [ads]);

  // Listen to Socket.IO for Machine Events & Direct Upload Notification
  useEffect(() => {
    if (!socket) return;

    socket.emit('JOIN_MACHINE', machineId);

    const handleFileUploaded = (payload) => {
      console.log('⚡ Realtime PDF Upload Event Received on Kiosk:', payload);
      // Auto open document preview screen
      navigate(`/kiosk/${machineId}/preview/${payload.uploadToken}`);
    };

    const handlePrinterStatusChange = (data) => {
      if (data.status) setPrinterStatus(data.status);
    };

    socket.on('FILE_UPLOADED', handleFileUploaded);
    socket.on('PRINTER_STATUS_CHANGE', handlePrinterStatusChange);

    return () => {
      socket.off('FILE_UPLOADED', handleFileUploaded);
      socket.off('PRINTER_STATUS_CHANGE', handlePrinterStatusChange);
    };
  }, [socket, machineId, navigate]);

  const uploadUrl = `${window.location.origin}/upload/${machineId}`;

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between p-6 select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR */}
      <header className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-4 shadow-xl">
        {/* Company Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-cyan-glow">
            <Printer className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
              Print<span className="text-cyan-400">Pulse</span>
            </h1>
            <p className="text-xs font-medium text-slate-400">Self-Service Xerox & Print Kiosk</p>
          </div>
        </div>

        {/* Center Live Clock */}
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-5 py-2.5 rounded-xl shadow-inner">
          <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-2xl font-bold tracking-wider font-mono text-cyan-300">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3 ml-1">
            {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* System Status Badges */}
        <div className="flex items-center gap-4">
          {/* Printer Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            printerStatus === 'ready'
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
              : printerStatus === 'paper_out' || printerStatus === 'toner_low'
              ? 'bg-amber-950/60 text-amber-400 border-amber-800/80'
              : 'bg-rose-950/60 text-rose-400 border-rose-800/80'
          }`}>
            <Printer className="w-4 h-4" />
            <span>
              {printerStatus === 'ready' && 'Printer Ready'}
              {printerStatus === 'paper_out' && 'Paper Low / Empty'}
              {printerStatus === 'toner_low' && 'Toner Low'}
              {printerStatus === 'offline' && 'Printer Offline'}
            </span>
          </div>

          {/* Internet Connectivity Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
            isConnected
              ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/80'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isConnected ? <Wifi className="w-4 h-4 text-cyan-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
            <span>{isConnected ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT SPLIT (Ad Slider Left + Large QR Right) */}
      <main className="relative z-10 grid grid-cols-12 gap-8 my-auto h-[calc(100vh-170px)] py-4">
        {/* LEFT COLUMN: Advertisement Slider */}
        <div className="col-span-7 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80">
            <AnimatePresence mode="wait">
              {ads.length > 0 && (
                <motion.div
                  key={ads[currentAdIndex]?.id || currentAdIndex}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {ads[currentAdIndex]?.media_type === 'video' ? (
                    <video
                      src={ads[currentAdIndex].media_url}
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <img
                      src={ads[currentAdIndex]?.media_url}
                      alt={ads[currentAdIndex]?.title}
                      className="w-full h-full object-cover rounded-2xl brightness-95"
                    />
                  )}

                  {/* Gradient Overlay for Text Readability at Bottom 40% */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none rounded-b-2xl" />
                  
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className="px-3 py-1 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-md mb-2 inline-block shadow-cyan-glow">
                      Featured Offer
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-snug drop-shadow-xl font-heading">
                      {ads[currentAdIndex]?.title}
                    </h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ad Dots Indicator */}
          {ads.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {ads.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAdIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    idx === currentAdIndex ? 'w-8 bg-cyan-400 shadow-cyan-glow' : 'w-2.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Touch QR Scan Banner */}
        <div className="col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 shadow-2xl relative text-center">
          <div className="absolute -top-3 px-4 py-1.5 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-cyan-glow flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Instant Self-Service</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mt-4 font-heading">
            Scan QR to Print
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            Open mobile camera or scanner app to upload your document directly.
          </p>

          {/* Prominent Touch QR Box */}
          <div className="relative my-6 p-6 bg-white rounded-3xl shadow-2xl shadow-cyan-500/20 border-4 border-cyan-400 group cursor-pointer transition-all transform hover:scale-105">
            <QRCodeSVG
              value={uploadUrl}
              size={240}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-cyan-300 font-mono tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Machine ID: {machineId}</span>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-4">
        <p>© 2026 PrintPulse Commercial Xerox Kiosks. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Max File Upload: 100MB</span>
          <span>•</span>
          <span>Formats: PDF</span>
          <span>•</span>
          <span>Support: 1800-123-456</span>
        </div>
      </footer>
    </div>
  );
};

export default KioskHome;
