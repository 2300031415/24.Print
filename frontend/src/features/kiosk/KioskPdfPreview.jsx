import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, X, Eye, Maximize2, Loader2, Sparkles, AlertCircle, Image as ImageIcon, FileCode } from 'lucide-react';

import api from '../../services/api';
import PDFCanvasViewer from '../../components/PDFCanvasViewer';

const KioskPdfPreview = () => {
  const { machineId, uploadToken } = useParams();
  const navigate = useNavigate();

  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchUploadDetails = async () => {
      try {
        const res = await api.get(`/uploads/${uploadToken}`);
        if (res.data.success) {
          setUpload(res.data.upload);
        }
      } catch (err) {
        console.error('Error loading uploaded file:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadDetails();
  }, [uploadToken]);

  // 60-Second Inactivity Auto-Reset to Standby Ads Home Screen
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      navigate(`/kiosk/${machineId}`);
    }, 60000);
    return () => clearTimeout(idleTimer);
  }, [machineId, navigate]);

  const handleCancel = () => {
    navigate(`/kiosk/${machineId}`);
  };

  const handleContinue = () => {
    navigate(`/kiosk/${machineId}/options/${uploadToken}`);
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <Loader2 className="w-14 h-14 text-cyan-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold font-heading text-slate-200">Opening Document Preview...</h2>
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="w-screen min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold font-heading text-white">Upload Record Expired or Invalid</h2>
        <p className="text-slate-400 mt-2">Please select a file on the kiosk home screen.</p>
        <button
          onClick={handleCancel}
          className="mt-6 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl btn-touch"
        >
          Return to Home Screen
        </button>
      </div>
    );
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;

  const backendBase = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : (port === '5173' ? `http://${hostname}:5000` : `${protocol}//${hostname}`);
  const fileUrl = `${backendBase}${upload.file_path}`;
  const fileSizeMb = (upload.file_size_bytes / (1024 * 1024)).toFixed(2);

  const fileExt = (upload.original_filename.split('.').pop() || '').toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'tiff'].includes(fileExt);
  const isPdf = fileExt === 'pdf';
  const formatLabel = isPdf ? 'PDF Document' : isImage ? 'Image Document' : `${fileExt.toUpperCase()} Document`;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col p-4 md:p-6 select-none overflow-y-auto font-sans">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-6 py-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            {isImage ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-heading truncate max-w-xs md:max-w-md">
              {upload.original_filename}
            </h1>
            <p className="text-xs text-slate-400">Document Uploaded Successfully</p>
          </div>
        </div>

        {/* File Metadata Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            Total Pages: <span className="text-cyan-400 font-bold">{upload.total_pages}</span>
          </div>
          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            File Size: <span className="text-cyan-400 font-bold">{fileSizeMb} MB</span>
          </div>
        </div>
      </header>

      {/* MAIN DOCUMENT PREVIEW BODY */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 mb-4">
        {/* DOCUMENT / IMAGE / PDF VIEWER */}
        <div className="lg:col-span-8 min-h-[500px] flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl p-4 items-center justify-center">
          {isImage ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
              <img
                src={fileUrl}
                alt={upload.original_filename}
                className="max-h-[520px] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
          ) : isPdf ? (
            <PDFCanvasViewer fileUrl={fileUrl} totalPages={upload.total_pages} />
          ) : (
            <div className="flex-1 w-full h-full min-h-[480px] flex flex-col items-center justify-center p-2">
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full min-h-[480px] rounded-xl border border-slate-800 bg-white"
                title={upload.original_filename}
              />
            </div>
          )}
        </div>

        {/* SUMMARY & ACTION SIDEBAR */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Step 1 of 3: Document Verification</span>
            </div>

            <h2 className="text-2xl font-bold text-white font-heading">
              Verify Your File
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Review your document pages, check orientation and content clarity before proceeding to print options.
            </p>

            {/* Document Info Card */}
            <div className="mt-4 space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">File Name</span>
                <span className="font-semibold text-white truncate max-w-[160px]">{upload.original_filename}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Page Count</span>
                <span className="font-bold text-cyan-400">{upload.total_pages} Pages</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Format</span>
                <span className="font-semibold text-emerald-400">{formatLabel}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Cancel, Review, Continue) */}
          <div className="space-y-3 mt-6">
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 active:scale-98 text-slate-950 font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-cyan-glow btn-touch text-lg"
            >
              <span>Continue to Print Options</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-3 bg-slate-800/80 hover:bg-rose-600/20 hover:text-rose-400 text-slate-400 font-bold rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 btn-touch text-sm"
            >
              <X className="w-4 h-4" />
              <span>Cancel & Start Over</span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-900">
        <p>© 2026 EasyXerox Kiosk Systems</p>
        <p>Support ID: {machineId}</p>
      </footer>
    </div>
  );
};

export default KioskPdfPreview;
