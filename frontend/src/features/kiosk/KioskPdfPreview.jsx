import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, X, Eye, Maximize2, Loader2, Sparkles, AlertCircle, Image as ImageIcon, FileCode } from 'lucide-react';

import api from '../../services/api';
import PDFCanvasViewer from '../../components/PDFCanvasViewer';
import { useSocket } from '../../context/SocketContext';

const KioskPdfPreview = () => {
  const { machineId, uploadToken } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [upload, setUpload] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for new uploaded document (e.g. Upload Another Document)
  useEffect(() => {
    if (!socket) return;
    socket.emit('JOIN_MACHINE', machineId);

    const handleFileUploaded = (payload) => {
      console.log('⚡ Realtime PDF Upload Event Received on Kiosk Preview:', payload);
      if (payload.uploadToken && payload.uploadToken !== uploadToken) {
        navigate(`/kiosk/${machineId}/preview/${payload.uploadToken}`);
      }
    };

    socket.on('FILE_UPLOADED', handleFileUploaded);
    return () => {
      socket.off('FILE_UPLOADED', handleFileUploaded);
    };
  }, [socket, machineId, uploadToken, navigate]);

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
      <div className="w-screen min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-14 h-14 text-blue-600 animate-spin mb-4" />
        <h2 className="text-xl font-black font-heading text-slate-900">Opening Document Preview...</h2>
      </div>
    );
  }

  if (!upload) {
    return (
      <div className="w-screen min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 font-sans">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black font-heading text-slate-950">Upload Record Expired or Invalid</h2>
        <p className="text-slate-600 mt-2 font-bold">Please select a file on the kiosk home screen.</p>
        <button
          onClick={handleCancel}
          className="mt-6 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-blue-glow btn-touch"
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col p-4 md:p-6 select-none overflow-y-auto font-sans">
      {/* HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between bg-white border-2 border-blue-100 rounded-3xl px-6 py-4 mb-4 gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
            {isImage ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-950 font-heading truncate max-w-xs md:max-w-md">
              {upload.original_filename}
            </h1>
            <p className="text-xs text-slate-500 font-bold">Document Uploaded Successfully</p>
          </div>
        </div>

        {/* File Metadata Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs font-bold text-slate-700">
            Total Pages: <span className="text-blue-600 font-black">{upload.total_pages}</span>
          </div>
          <div className="px-4 py-2 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs font-bold text-slate-700">
            File Size: <span className="text-blue-600 font-black">{fileSizeMb} MB</span>
          </div>
        </div>
      </header>

      {/* MAIN DOCUMENT PREVIEW BODY */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 mb-4">
        {/* DOCUMENT / IMAGE / PDF VIEWER */}
        <div className="lg:col-span-8 min-h-[500px] flex flex-col bg-white border-2 border-blue-100 rounded-3xl p-4 items-center justify-center shadow-xl">
          {isImage ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
              <img
                src={fileUrl}
                alt={upload.original_filename}
                className="max-h-[520px] max-w-full object-contain rounded-2xl shadow-xl border border-slate-200"
              />
            </div>
          ) : isPdf ? (
            <PDFCanvasViewer fileUrl={fileUrl} totalPages={upload.total_pages} />
          ) : (
            <div className="flex-1 w-full h-full min-h-[480px] flex flex-col items-center justify-center p-2">
              <iframe
                src={`${fileUrl}#toolbar=0`}
                className="w-full h-full min-h-[480px] rounded-2xl border border-slate-200 bg-white"
                title={upload.original_filename}
              />
            </div>
          )}
        </div>

        {/* SUMMARY & ACTION SIDEBAR */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Step 1 of 3: Document Verification</span>
            </div>

            <h2 className="text-2xl font-black text-slate-950 font-heading">
              Verify Your File
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-bold">
              Review your document pages, check orientation and content clarity before proceeding to print options.
            </p>

            {/* Document Info Card */}
            <div className="mt-6 space-y-3 bg-blue-50/60 p-5 rounded-2xl border border-blue-100 text-sm font-bold">
              <div className="flex justify-between py-1 border-b border-blue-100">
                <span className="text-slate-500">File Name</span>
                <span className="font-black text-slate-950 truncate max-w-[160px]">{upload.original_filename}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-100">
                <span className="text-slate-500">Page Count</span>
                <span className="font-black text-blue-600">{upload.total_pages} Pages</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Format</span>
                <span className="font-black text-emerald-600">{formatLabel}</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Cancel, Continue) */}
          <div className="space-y-3 mt-8">
            <button
              onClick={handleContinue}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 shadow-blue-glow btn-touch"
            >
              <span>Continue to Print Options</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-3.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-sm rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 btn-touch"
            >
              <X className="w-4 h-4" />
              <span>Cancel & Start Over</span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-200">
        <p>© 2026 EasyXerox Kiosk Systems</p>
        <p>Support ID: {machineId}</p>
      </footer>
    </div>
  );
};

export default KioskPdfPreview;
