import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Printer, Sparkles, ShieldCheck, Loader2, Wrench } from 'lucide-react';

import api from '../../services/api';

const MobileUpload = () => {
  const { machineId = 'KIOSK-001' } = useParams();

  const [machine, setMachine] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch machine location details
  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const res = await api.get(`/machines/code/${machineId}`);
        if (res.data.success) {
          setMachine(res.data.machine);
        }
      } catch (err) {
        console.error('Error fetching machine details:', err);
      }
    };
    fetchMachine();
  }, [machineId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only PDF files are supported for printing.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 100MB maximum limit.');
      setSelectedFile(null);
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('machineId', machineId);
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      if (res.data.success) {
        setUploadSuccess(true);
      } else {
        setErrorMsg(res.data.message || 'Failed to upload file.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error uploading document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-between p-4 selection:bg-blue-600 selection:text-white font-sans">
      {/* Mobile Top Header */}
      <header className="w-full max-w-md bg-blue-600 border-2 border-blue-700 rounded-2xl p-4 flex items-center justify-between shadow-lg mt-2 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 px-3 rounded-xl border border-blue-200 shadow-md">
            <img src="/logo.png" alt="EasyXerox" className="h-8 w-auto object-contain scale-140 transform" />
          </div>
        </div>

        <div className="px-3 py-1.5 bg-white text-blue-700 rounded-xl text-xs font-mono font-black border border-blue-200 shadow-sm">
          {machineId}
        </div>
      </header>

      {/* Main Upload Body Card */}
      <main className="w-full max-w-md my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-slate-950"
        >
          {/* Machine Info */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Target Kiosk</span>
              <span className={`font-black flex items-center gap-1 ${
                machine?.printer_status === 'paper_out' ? 'text-rose-600' :
                machine?.printer_status === 'offline' ? 'text-amber-600' :
                'text-emerald-600'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {machine?.printer_status === 'paper_out' ? 'Out of Paper' :
                 machine?.printer_status === 'offline' ? 'Printer Offline' :
                 'Printer Ready'}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-950 font-heading mt-1">
              {machine ? machine.name : 'Connecting to Kiosk...'}
            </h2>
            {machine?.location_address && (
              <p className="text-xs text-slate-600 font-bold mt-0.5">{machine.location_address}</p>
            )}
          </div>

          {machine?.status === 'maintenance' ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-600 animate-pulse">
                <Wrench className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-black text-slate-950 font-heading">
                Station Under Maintenance
              </h2>
              <p className="text-sm text-slate-700 max-w-xs mx-auto leading-relaxed bg-amber-50 p-4 rounded-2xl border border-amber-200 font-bold">
                This Xerox printing kiosk is currently undergoing routine maintenance or paper refilling. Uploads are temporarily paused.
              </p>
            </div>
          ) : !uploadSuccess ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-950 font-heading">
                  Upload PDF Document
                </h2>

                <p className="text-xs font-bold text-slate-600 mt-1">
                  Select a document from your phone (Max 100MB)
                </p>
              </div>

              {/* Touch Upload Box */}
              <label className="relative flex flex-col items-center justify-center w-full min-h-[220px] bg-blue-50/50 border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-2xl cursor-pointer p-6 transition-all group">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-all border border-blue-200">
                  <UploadCloud className="w-8 h-8" />
                </div>

                {selectedFile ? (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-black text-blue-700 max-w-[240px] truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-600 font-bold mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-sm font-black text-slate-950 block">Tap to Select PDF</span>
                    <span className="text-xs text-slate-600 font-bold block mt-1">Supports all standard PDF files</span>
                  </div>
                )}
              </label>

              {errorMsg && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Upload Progress Bar */}
              {uploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-black rounded-xl transition-all shadow-blue-glow btn-touch text-base flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading to Kiosk...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Upload to Kiosk Screen</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 font-heading">
                Upload Successful!
              </h2>
              <p className="text-sm font-bold text-slate-700 mt-2 max-w-xs">
                Look at the kiosk screen! Your document has automatically opened.
              </p>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadSuccess(false);
                }}
                className="mt-8 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-xl text-xs btn-touch"
              >
                Upload Another Document
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Footer */}
      <footer className="py-4 text-center text-xs font-bold text-slate-500">
        © 2026 EasyXerox Self-Service Printing Systems
      </footer>
    </div>
  );
};

export default MobileUpload;
