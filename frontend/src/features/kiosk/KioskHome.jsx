import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer, Wifi, WifiOff, Sparkles, Clock, ShieldCheck, Hand,
  ArrowLeft, Wrench, Monitor, Copy, Smartphone, Usb, ScanLine,
  CheckCircle, Globe
} from 'lucide-react';

import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useLanguage } from '../../context/LanguageContext';
import USBDriveModal from './USBDriveModal';
import CopyModal from './CopyModal';
import AdminModeModal from './AdminModeModal';

/* ─────────────────────────────────────────────────────────────
   SERVICE TILES
   ───────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'copy',
    icon: Copy,
    color: '#0066FF',
    bg: 'from-blue-600 to-blue-700',
    glow: 'rgba(0,102,255,0.35)',
    titleKey: 'services.copy',
    descKey: 'services.copy_desc',
  },
  {
    id: 'print_qr',
    icon: Smartphone,
    color: '#7c3aed',
    bg: 'from-violet-600 to-purple-700',
    glow: 'rgba(124,58,237,0.35)',
    titleKey: 'services.print_qr',
    descKey: 'services.print_qr_desc',
  },
  {
    id: 'print_usb',
    icon: Usb,
    color: '#0891b2',
    bg: 'from-cyan-600 to-teal-700',
    glow: 'rgba(8,145,178,0.35)',
    titleKey: 'services.print_usb',
    descKey: 'services.print_usb_desc',
  },
  {
    id: 'scan',
    icon: ScanLine,
    color: '#059669',
    bg: 'from-emerald-600 to-green-700',
    glow: 'rgba(5,150,105,0.35)',
    titleKey: 'services.scan',
    descKey: 'services.scan_desc',
  },
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────── */
const KioskHome = () => {
  const { machineId = 'FFPVT_EasyXerox-001' } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { t, currentLanguage, changeLanguage, languages } = useLanguage();

  /* ── State ── */
  const [machine, setMachine]           = useState(null);
  const [ads, setAds]                   = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentTime, setCurrentTime]   = useState(new Date());
  const [printerStatus, setPrinterStatus] = useState('ready');
  const [machineNotFound, setMachineNotFound] = useState(false);

  // kiosk screen mode: 'standby_ad' | 'home' | 'qr_scan'
  const [kioskState, setKioskState]     = useState('home');

  // Modal visibility
  const [copyModalOpen, setCopyModalOpen]   = useState(false);
  const [usbModalOpen, setUsbModalOpen]     = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  // 5-tap logo counter for admin
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef(null);

  /* ── Media URL helper ── */
  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const backendBase = (hostname === 'localhost' || hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : (port === '5173' || port === '8501' ? `http://${hostname}:5000` : `${protocol}//${hostname}`);
    return `${backendBase}${url}`;
  };

  /* ── Fetch ads ── */
  const fetchMachineAds = async () => {
    try {
      const res = await api.get(`/machines/code/${machineId}/ads`);
      if (res.data.success && res.data.ads && res.data.ads.length > 0) {
        setAds(res.data.ads);
        setCurrentAdIndex(0);
        setKioskState('standby_ad');
      } else {
        setAds([]);
        setKioskState('home');
      }
    } catch {
      setAds([]);
      setKioskState('home');
    }
  };

  /* ── Load machine & ads ── */
  useEffect(() => {
    const fetchMachineDetails = async () => {
      try {
        const res = await api.get(`/machines/code/${machineId}`);
        if (res.data.success && res.data.machine) {
          setMachine(res.data.machine);
          setPrinterStatus(res.data.machine.printer_status || 'ready');
          setMachineNotFound(false);
        } else {
          setMachineNotFound(true);
        }
      } catch {
        setMachineNotFound(true);
      }
    };
    fetchMachineDetails();
    fetchMachineAds();
  }, [machineId]);

  /* ── Live clock ── */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ── Ad auto-advance ── */
  useEffect(() => {
    if (ads.length <= 1) return;
    const id = setInterval(() => setCurrentAdIndex(p => (p + 1) % ads.length), 10000);
    return () => clearInterval(id);
  }, [ads]);

  /* ── Inactivity: home → standby_ad if ads exist ── */
  useEffect(() => {
    if (kioskState !== 'home' || ads.length === 0) return;
    const id = setTimeout(() => setKioskState('standby_ad'), 60000);
    return () => clearTimeout(id);
  }, [kioskState, ads]);

  /* ── Socket.IO events ── */
  useEffect(() => {
    if (!socket) return;
    socket.emit('JOIN_MACHINE', machineId);

    const onFileUploaded = (payload) => {
      const targetCode = payload.machineCode || payload.machineId;
      const isMatch = !targetCode || targetCode === machineId || targetCode?.toUpperCase() === machineId?.toUpperCase();
      if (isMatch && payload.uploadToken) {
        navigate(`/kiosk/${machineId}/preview/${payload.uploadToken}`);
      }
    };

    const onMachineStatus = (data) => {
      if (data.status) setMachine(prev => prev ? { ...prev, status: data.status } : { status: data.status });
    };

    const onPrinterStatus = (data) => {
      if (data.status) setPrinterStatus(data.status);
    };

    const onAdsUpdated = () => fetchMachineAds();

    const onRemoteCommand = ({ command, payload }) => {
      console.log('📡 REMOTE_COMMAND received:', command, payload);
      switch (command) {
        case 'CMD_RELOAD_APP':
          window.location.reload();
          break;
        case 'CMD_REBOOT_MACHINE':
          fetch('http://localhost:5050/api/system/reboot', { method: 'POST' }).catch(() => {});
          break;
        case 'CMD_SET_MAINTENANCE':
          setMachine(prev => prev ? { ...prev, status: 'maintenance' } : { status: 'maintenance' });
          break;
        case 'CMD_CLEAR_MAINTENANCE':
          setMachine(prev => prev ? { ...prev, status: 'online' } : { status: 'online' });
          break;
        case 'CMD_SET_PRICING':
          // pricing updates arrive via socket; machine context can be refreshed
          break;
        case 'CMD_PING':
          console.log('🏓 Kiosk PONG — alive at', new Date().toISOString());
          break;
        default:
          console.warn('Unknown remote command:', command);
      }
    };

    socket.on('FILE_UPLOADED', onFileUploaded);
    socket.on('MACHINE_STATUS_CHANGE', onMachineStatus);
    socket.on('PRINTER_STATUS_CHANGE', onPrinterStatus);
    socket.on('ADS_UPDATED', onAdsUpdated);
    socket.on('REMOTE_COMMAND', onRemoteCommand);

    return () => {
      socket.off('FILE_UPLOADED', onFileUploaded);
      socket.off('MACHINE_STATUS_CHANGE', onMachineStatus);
      socket.off('PRINTER_STATUS_CHANGE', onPrinterStatus);
      socket.off('ADS_UPDATED', onAdsUpdated);
      socket.off('REMOTE_COMMAND', onRemoteCommand);
    };
  }, [socket, machineId, navigate]);

  const uploadUrl = `${window.location.origin}/upload/${machineId}`;

  /* ── Logo 5-tap → admin ── */
  const handleLogoTap = () => {
    logoTapCount.current += 1;
    clearTimeout(logoTapTimer.current);
    if (logoTapCount.current >= 5) {
      logoTapCount.current = 0;
      setAdminModalOpen(true);
    } else {
      logoTapTimer.current = setTimeout(() => { logoTapCount.current = 0; }, 3000);
    }
  };

  /* ── Service button handler ── */
  const handleService = (id) => {
    if (id === 'copy')     setCopyModalOpen(true);
    if (id === 'print_qr') setKioskState('qr_scan');
    if (id === 'print_usb') setUsbModalOpen(true);
    if (id === 'scan')     setKioskState('qr_scan'); // re-use QR screen for scan too
  };

  /* ────────────────────────────────── SPECIAL SCREENS ──────── */

  if (machineNotFound) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-8 select-none font-sans">
        <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mb-6">
          <Monitor className="w-12 h-12 text-rose-500" />
        </div>
        <span className="px-4 py-1.5 bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-4">
          Fleet Registry Notice • {machineId}
        </span>
        <h1 className="text-3xl font-black text-white text-center mb-3">Unregistered Kiosk Board</h1>
        <p className="text-slate-400 font-bold max-w-md text-sm text-center mb-8 leading-relaxed">
          Kiosk Machine Code <code className="text-blue-400 font-mono font-black">{machineId}</code> is not registered in the EasyXerox fleet database.
        </p>
        <div className="px-6 py-3 bg-slate-900 text-slate-400 font-mono font-bold text-xs rounded-2xl border border-slate-800">
          Status: Hardware Unassigned / No Board Active
        </div>
      </div>
    );
  }

  if (machine?.status === 'maintenance') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-8 select-none">
        <div className="w-28 h-28 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center animate-pulse mb-8">
          <Wrench className="w-14 h-14 text-amber-400 animate-spin" />
        </div>
        <span className="px-4 py-1.5 bg-amber-950/80 text-amber-300 border border-amber-800/80 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-4">
          Station Notice • {machineId}
        </span>
        <h1 className="text-4xl font-extrabold text-white text-center max-w-xl">
          {t('maintenance.title', 'Kiosk Under Maintenance')}
        </h1>
        <p className="text-slate-300 text-lg mt-3 text-center max-w-md font-medium leading-relaxed">
          {t('maintenance.subtitle')}
        </p>
        <div className="mt-8 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-slate-400 text-sm">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <span>{t('maintenance.resuming')}</span>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────── SHARED HEADER ──────────── */
  const Header = ({ showBackAds = false }) => (
    <header className="relative z-10 flex items-center justify-between bg-[#0066FF] backdrop-blur-xl border-2 border-white/40 rounded-2xl px-5 py-3.5 shadow-blue-glow text-white">
      {/* Left: back-to-ads + logo */}
      <div className="flex items-center gap-3">
        {showBackAds && ads.length > 0 && (
          <button
            onClick={() => setKioskState('standby_ad')}
            className="p-2.5 bg-[#0052CC] hover:bg-[#0040A8] text-white rounded-xl active:scale-95 transition-all flex items-center gap-2 font-bold text-xs border border-white/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ads</span>
          </button>
        )}
        <button onClick={handleLogoTap} className="logo-badge ml-1 active:scale-95 transition-transform" title="EasyXerox">
          <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
        </button>
      </div>

      {/* Center: clock */}
      <div className="flex items-center gap-2 bg-[#0052CC] border border-white/30 px-4 py-2 rounded-xl">
        <Clock className="w-4 h-4 text-white animate-pulse" />
        <span className="text-xl font-bold tracking-wider font-mono text-white">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-xs text-blue-100 border-l border-white/20 pl-3 ml-1 hidden sm:inline">
          {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Right: status badges + language */}
      <div className="flex items-center gap-2">
        {/* Printer status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
          printerStatus === 'ready'
            ? 'bg-emerald-600 text-white border-white/40'
            : 'bg-amber-500 text-slate-950 border-white/40'
        }`}>
          <Printer className="w-3.5 h-3.5" />
          <span>{printerStatus === 'ready' ? t('status.printer_ready') : t('status.printer_busy')}</span>
        </div>

        {/* Network status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
          isConnected ? 'bg-[#0052CC] text-white border-white/40' : 'bg-slate-700 text-slate-200 border-slate-600'
        }`}>
          {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
          <span>{isConnected ? t('status.online') : t('status.offline')}</span>
        </div>

        {/* Language picker */}
        <div className="relative">
          <button
            onClick={() => setLangPickerOpen(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/10 text-white border-white/30 active:scale-95 transition-transform"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">{currentLanguage}</span>
          </button>
          <AnimatePresence>
            {langPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[130px]"
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setLangPickerOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors ${
                      currentLanguage === lang.code ? 'text-blue-400' : 'text-slate-200'
                    }`}
                  >
                    <span>{lang.native}</span>
                    {currentLanguage === lang.code && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );

  /* ────────────────────────────────── AD STANDBY SCREEN ───────── */
  const showStandbyAds = kioskState === 'standby_ad' && ads.length > 0;

  /* ────────────────────────────────── RENDER ───────────────────── */
  return (
    <div className="relative w-screen h-screen bg-slate-50 text-slate-800 overflow-hidden select-none font-sans">

      {/* ═══ 1. FULL-SCREEN AD STANDBY ═══ */}
      <AnimatePresence mode="wait">
        {showStandbyAds && (
          <motion.div
            key="standby_ad_view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            onClick={() => setKioskState('home')}
            className="absolute inset-0 z-30 cursor-pointer flex flex-col justify-between p-6 bg-slate-50"
          >
            {/* Full-screen media */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ads[currentAdIndex]?.id || currentAdIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-full h-full"
                >
                  {ads[currentAdIndex]?.media_type === 'video' ? (
                    <video src={getMediaUrl(ads[currentAdIndex]?.media_url)} autoPlay muted loop className="w-full h-full object-cover" />
                  ) : (
                    <img src={getMediaUrl(ads[currentAdIndex]?.media_url)} alt={ads[currentAdIndex]?.title || 'Ad'} className="w-full h-full object-cover brightness-95" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0040A8]/90 via-black/40 to-[#0066FF]/50" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Header overlay */}
            <div className="relative z-10">
              <Header />
            </div>

            {/* Bottom CTA */}
            <div className="relative z-10 flex items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="px-3.5 py-1.5 bg-[#0066FF] text-white text-xs font-extrabold uppercase tracking-widest rounded-lg mb-3 inline-block shadow-blue-glow border border-white/30">
                  Promotional Offer
                </span>
                <h2 className="text-4xl font-extrabold text-white leading-tight font-heading drop-shadow-2xl">
                  {ads[currentAdIndex]?.title || 'Promotional Advertisement'}
                </h2>
              </div>

              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-[#0066FF] p-1 rounded-3xl shadow-blue-glow shrink-0"
              >
                <div className="bg-[#0052CC] rounded-[23px] px-7 py-4 flex items-center justify-center gap-4 border border-white/40">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-lg animate-bounce">
                    <Hand className="w-6 h-6 text-[#0066FF]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white font-heading tracking-wide">TOUCH TO START</h3>
                    <p className="text-xs text-blue-100 font-semibold">Tap anywhere to select a service</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. HOME — SERVICE GRID ═══ */}
      <AnimatePresence mode="wait">
        {kioskState === 'home' && (
          <motion.div
            key="home_view"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full h-full flex flex-col gap-5 p-5"
          >
            <Header showBackAds />

            {/* Tagline */}
            <div className="text-center -mb-1">
              <h1 className="text-2xl font-black text-slate-800 font-heading">
                {t('services.title', 'Select a Service')}
              </h1>
              <p className="text-sm text-slate-500 font-medium">{t('touch_subtitle', 'Tap a tile below to begin')}</p>
            </div>

            {/* Service grid */}
            <div className="grid grid-cols-2 gap-5 flex-1 max-h-[calc(100vh-190px)]">
              {SERVICES.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.button
                    key={svc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleService(svc.id)}
                    className={`relative flex flex-col items-start justify-between rounded-3xl p-7 text-white shadow-2xl overflow-hidden bg-gradient-to-br ${svc.bg} border border-white/20 cursor-pointer active:brightness-90 transition-all`}
                    style={{ boxShadow: `0 10px 40px ${svc.glow}` }}
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 mb-4 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Label */}
                    <div>
                      <h3 className="text-xl font-black font-heading leading-tight">{t(svc.titleKey)}</h3>
                      <p className="text-xs text-white/80 mt-1 font-medium leading-relaxed">{t(svc.descKey)}</p>
                    </div>

                    {/* Decorative glow circle */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5 blur-md pointer-events-none" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#0066FF]/70 font-semibold border-t border-[#0066FF]/20 pt-2">
              <p>© 2026 EasyXerox Commercial Kiosks. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <span>Max: 100MB</span>
                <span>•</span>
                <span>PDF, Word, Images</span>
                <span>•</span>
                <span>Support: 1800-123-456</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 3. QR SCAN SCREEN ═══ */}
      <AnimatePresence mode="wait">
        {kioskState === 'qr_scan' && (
          <motion.div
            key="qr_scan_view"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full h-full flex flex-col gap-5 p-5"
          >
            <Header showBackAds />

            <main className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Ad mini panel if ads exist */}
              {ads.length > 0 && (
                <div className="absolute left-5 top-[90px] bottom-[60px] w-[calc(50%-28px)] hidden lg:flex flex-col rounded-3xl overflow-hidden border-2 border-blue-200 shadow-xl bg-white">
                  <div className="relative w-full h-full">
                    <img
                      src={getMediaUrl(ads[currentAdIndex]?.media_url)}
                      alt={ads[currentAdIndex]?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0066FF] via-[#0066FF]/70 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <span className="px-2 py-0.5 bg-[#0066FF] text-white text-xs font-extrabold uppercase tracking-wider rounded mb-1.5 inline-block border border-white/30">
                        Featured Offer
                      </span>
                      <h3 className="text-xl font-extrabold text-white font-heading leading-snug">{ads[currentAdIndex]?.title}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* QR card */}
              <div className="relative flex flex-col items-center justify-center bg-white border-[3px] border-[#0066FF] rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
                <div className="absolute -top-4 px-5 py-1.5 bg-[#0066FF] text-white text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-white/40 shadow-blue-glow">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('scan_qr.heading', 'Scan QR to Print')}</span>
                </div>

                <h2 className="text-2xl font-extrabold text-[#0066FF] mt-4 font-heading">{t('scan_qr.heading')}</h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xs font-medium">{t('scan_qr.subheading')}</p>

                <div className="relative my-6 p-5 bg-white rounded-3xl shadow-2xl border-4 border-[#0066FF]">
                  <QRCodeSVG value={uploadUrl} size={220} level="H" includeMargin />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#E6F0FF] rounded-xl border border-[#0066FF]/30 text-xs text-[#0066FF] font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('scan_qr.machine_id')}: {machineId}</span>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 font-medium">{t('scan_qr.waiting')}</p>
              </div>
            </main>

            {/* Back button */}
            <div className="flex justify-center">
              <button
                onClick={() => setKioskState('home')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition-colors active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </button>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#0066FF]/70 font-semibold border-t border-[#0066FF]/20 pt-2">
              <p>© 2026 EasyXerox Commercial Kiosks. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <span>{t('scan_qr.max_size')}</span>
                <span>•</span>
                <span>{t('scan_qr.formats')}</span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODALS ═══ */}
      <AnimatePresence>
        {copyModalOpen && (
          <CopyModal
            isOpen={copyModalOpen}
            onClose={() => setCopyModalOpen(false)}
            machine={machine}
            pricing={machine?.pricing || {}}
            onPrintSuccess={() => setCopyModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {adminModalOpen && (
          <AdminModeModal
            isOpen={adminModalOpen}
            onClose={() => setAdminModalOpen(false)}
            machine={machine}
            isConnected={isConnected}
          />
        )}
      </AnimatePresence>

      {/* USB Pendrive Detection overlay */}
      <USBDriveModal
        machineId={machineId}
        isOpen={usbModalOpen}
        onClose={() => setUsbModalOpen(false)}
      />
    </div>
  );
};

export default KioskHome;
