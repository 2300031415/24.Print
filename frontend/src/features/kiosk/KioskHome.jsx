import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Wifi, WifiOff, Sparkles, Clock, ShieldCheck, Hand, ArrowLeft, Wrench } from 'lucide-react';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import USBDriveModal from './USBDriveModal';

const KioskHome = () => {
  const { machineId = 'KIOSK-001' } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const [machine, setMachine] = useState(null);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [printerStatus, setPrinterStatus] = useState('ready');

  // Kiosk Mode State: 'standby_ad' (Full-screen ad) vs 'qr_interactive' (QR Scan screen)
  const [kioskState, setKioskState] = useState('standby_ad');

  // Helper to construct full media URL for ad images/videos
  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (window.location.hostname === 'localhost') return `http://localhost:5000${url}`;
    // Always use the production domain for images (Nginx proxies /uploads/ to backend)
    return `https://lowcostfreedom.com${url}`;
  };


  // Hoisted so it can be called from both useEffect and the socket ADS_UPDATED handler
  const fetchMachineAds = async () => {
    try {
      const res = await api.get(`/machines/code/${machineId}/ads`);
      if (res.data.success && res.data.ads && res.data.ads.length > 0) {
        setAds(res.data.ads);
        setCurrentAdIndex(0);
        setKioskState('standby_ad'); // Ads exist → show ad slideshow
      } else {
        // No ads at all → show QR code screen directly
        setAds([]);
        setKioskState('qr_interactive');
      }
    } catch (err) {
      console.error('Error loading ads:', err);
      setAds([]);
      setKioskState('qr_interactive');
    }
  };

  // Load Machine Details & Advertisements
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

  // 60-Second Inactivity Auto-Return to Standby Ads Screen
  useEffect(() => {
    if (kioskState !== 'qr_interactive') return;
    const idleTimer = setTimeout(() => {
      setKioskState('standby_ad');
    }, 60000); // Exactly 60 seconds (1 minute)
    return () => clearTimeout(idleTimer);
  }, [kioskState]);


  // Listen to Socket.IO for Machine Events & Direct Upload Notification
  useEffect(() => {
    if (!socket) return;

    socket.emit('JOIN_MACHINE', machineId);

    const handleFileUploaded = (payload) => {
      console.log('⚡ Realtime PDF Upload Event Received on Kiosk:', payload);
      navigate(`/kiosk/${machineId}/preview/${payload.uploadToken}`);
    };

    const handleMachineStatusChange = (data) => {
      console.log('⚡ Realtime Machine Status Change:', data);
      if (data.status) {
        setMachine((prev) => (prev ? { ...prev, status: data.status } : { status: data.status }));
      }
    };

    const handlePrinterStatusChange = (data) => {
      if (data.status) setPrinterStatus(data.status);
    };

    const handleAdsUpdated = () => {
      console.log('⚡ Realtime Ads Update — refreshing board slideshow');
      fetchMachineAds();
    };

    socket.on('FILE_UPLOADED', handleFileUploaded);
    socket.on('MACHINE_STATUS_CHANGE', handleMachineStatusChange);
    socket.on('PRINTER_STATUS_CHANGE', handlePrinterStatusChange);
    socket.on('ADS_UPDATED', handleAdsUpdated);

    return () => {
      socket.off('FILE_UPLOADED', handleFileUploaded);
      socket.off('MACHINE_STATUS_CHANGE', handleMachineStatusChange);
      socket.off('PRINTER_STATUS_CHANGE', handlePrinterStatusChange);
      socket.off('ADS_UPDATED', handleAdsUpdated);
    };
  }, [socket, machineId, navigate, fetchMachineAds]);

  const publicDomain = 'https://lowcostfreedom.com';
  const uploadUrl = `${publicDomain}/upload/${machineId}`;


  // Handle Touch Screen Anywhere on Ad to reveal QR Screen
  const handleAdTouchScreen = () => {
    setKioskState('qr_interactive');
  };

  // FULL-SCREEN KIOSK MAINTENANCE OVERLAY
  if (machine?.status === 'maintenance') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-8 select-none">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center animate-pulse">
            <Wrench className="w-14 h-14 text-amber-400 animate-spin" />
          </div>
        </div>

        <span className="px-4 py-1.5 bg-amber-950/80 text-amber-300 border border-amber-800/80 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-4">
          Station Notice • {machineId}
        </span>

        <h1 className="text-4xl font-extrabold text-white font-heading text-center max-w-xl">
          Kiosk Under Maintenance
        </h1>

        <p className="text-slate-300 text-lg mt-3 text-center max-w-md font-medium leading-relaxed">
          This self-service Xerox printing station is currently undergoing routine service or paper loading.
        </p>

        <div className="mt-8 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-slate-400 text-sm">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <span>Operations will resume automatically shortly. Thank you for your patience!</span>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden select-none font-sans">
      {/* 1. FULL-PAGE STANDBY ADVERTISEMENT MODE */}
      <AnimatePresence mode="wait">
        {kioskState === 'standby_ad' && (
          <motion.div
            key="standby_ad_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            onClick={handleAdTouchScreen}
            className="absolute inset-0 z-30 cursor-pointer flex flex-col justify-between p-8 bg-slate-950"
          >
            {/* Full Screen Media Display */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                {ads.length > 0 && (
                  <motion.div
                    key={ads[currentAdIndex]?.id || currentAdIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-full"
                  >
                    {ads[currentAdIndex]?.media_type === 'video' ? (
                      <video
                        src={getMediaUrl(ads[currentAdIndex]?.media_url)}
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={getMediaUrl(ads[currentAdIndex]?.media_url)}
                        alt={ads[currentAdIndex]?.title}
                        className="w-full h-full object-cover brightness-90"
                      />
                    )}
                    {/* Gradient Overlay for Readable Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standby Header Bar */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="logo-badge">
                  <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
                </div>
              </div>

              {/* Live Clock & Printer Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-5 py-2.5 rounded-xl">
                  <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="text-xl font-bold font-mono text-cyan-300">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  printerStatus === 'ready'
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950/80 text-amber-400 border-amber-800'
                }`}>
                  {printerStatus === 'ready' ? 'Printer Ready' : 'Printer Status Check'}
                </div>
              </div>
            </div>

            {/* Featured Ad Headline at Bottom Left */}
            <div className="relative z-10 max-w-2xl">
              <span className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest rounded-lg mb-3 inline-block shadow-cyan-glow">
                Promotional Offer
              </span>
              <h2 className="text-4xl font-extrabold text-white leading-tight font-heading drop-shadow-2xl">
                {ads[currentAdIndex]?.title}
              </h2>
            </div>

            {/* Prominent TOUCH SCREEN TO PRINT Banner */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative z-10 w-full max-w-xl mx-auto bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 p-0.5 rounded-3xl shadow-cyan-glow"
            >
              <div className="bg-slate-950/90 backdrop-blur-2xl rounded-[23px] px-8 py-5 flex items-center justify-center gap-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-cyan-glow animate-bounce">
                  <Hand className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-white font-heading tracking-wide">
                    TOUCH SCREEN TO PRINT
                  </h3>
                  <p className="text-xs text-cyan-300 font-semibold">
                    Tap anywhere on screen to scan QR code & upload files
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. INTERACTIVE QR CODE SCREEN MODE */}
      <AnimatePresence mode="wait">
        {kioskState === 'qr_interactive' && (
          <motion.div
            key="qr_interactive_view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full h-full flex flex-col justify-between p-6"
          >
            {/* Background Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* HEADER BAR */}
            <header className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-6 py-4 shadow-xl">
              <div className="flex items-center gap-3">
                {/* Only show Back to Ads button if there are active ads */}
                {ads.length > 0 && (
                  <button
                    onClick={() => setKioskState('standby_ad')}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl active:scale-95 transition-all flex items-center gap-2 font-bold text-xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-cyan-400" />
                    <span>Back to Ads</span>
                  </button>
                )}

                <div className="logo-badge ml-2">
                  <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
                </div>
              </div>

              {/* Center Live Clock */}
              <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-5 py-2.5 rounded-xl">
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
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
                  printerStatus === 'ready'
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950/60 text-amber-400 border-amber-800'
                }`}>
                  <Printer className="w-4 h-4" />
                  <span>{printerStatus === 'ready' ? 'Printer Ready' : 'Check Printer'}</span>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${
                  isConnected
                    ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isConnected ? <Wifi className="w-4 h-4 text-cyan-400" /> : <WifiOff className="w-4 h-4 text-rose-400" />}
                  <span>{isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </header>

            {/* MAIN QR SCAN CONTENT */}
            <main className="relative z-10 grid gap-8 my-auto h-[calc(100vh-170px)] py-4"
              style={{ gridTemplateColumns: ads.length > 0 ? 'repeat(12, minmax(0, 1fr))' : '1fr' }}>
              {/* LEFT SIDE: Mini Ad Panel — only visible when ads exist */}
              {ads.length > 0 && (
              <div className="col-span-6 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
                  <img
                    src={getMediaUrl(ads[currentAdIndex]?.media_url)}
                    alt={ads[currentAdIndex]?.title}
                    className="w-full h-full object-cover brightness-90"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <span className="px-3 py-1 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider rounded-md mb-2 inline-block shadow-cyan-glow">
                      Featured Offer
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-snug font-heading">
                      {ads[currentAdIndex]?.title}
                    </h3>
                  </div>
                </div>
              </div>
              )}

              {/* RIGHT SIDE (or full width if no ads): Prominent Touch QR Code Box */}
              <div className={`${ads.length > 0 ? 'col-span-6' : 'col-span-12 max-w-xl mx-auto w-full'} flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/40 rounded-3xl p-8 shadow-2xl relative text-center`}>
                <div className="absolute -top-3 px-4 py-1.5 bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest rounded-full shadow-cyan-glow flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Self-Service</span>
                </div>

                <h2 className="text-3xl font-extrabold text-white mt-4 font-heading">
                  Scan QR Code to Print
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">
                  Open your mobile camera or scanner app to upload your document directly.
                </p>

                {/* Prominent QR Code SVG */}
                <div className="relative my-6 p-6 bg-white rounded-3xl shadow-2xl shadow-cyan-500/20 border-4 border-cyan-400">
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
              <p>© 2026 EasyXerox Commercial Kiosks. All rights reserved.</p>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Max File Upload: 100MB</span>
                <span>•</span>
                <span>Formats: PDF, Word, Images, Text</span>
                <span>•</span>
                <span>Support: 1800-123-456</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USB Pendrive Detection — toast + file explorer overlay */}
      <USBDriveModal machineId={machineId} />
    </div>
  );
};


export default KioskHome;
