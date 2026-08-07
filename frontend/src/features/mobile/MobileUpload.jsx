import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Printer, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';

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
    formData.append('file', selectedFile);
    formData.append('machineId', machineId);

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 selection:bg-cyan-500">
      {/* Mobile Top Header */}
      <header className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-cyan-glow">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white font-heading">PrintPulse Mobile</h1>
            <p className="text-xs text-slate-400">Self-Service Document Upload</p>
          </div>
        </div>

        <div className="px-3 py-1 bg-cyan-950/80 border border-cyan-800 rounded-lg text-xs text-cyan-300 font-mono font-semibold">
          {machineId}
        </div>
      </header>

      {/* Main Upload Body Card */}
      <main className="w-full max-w-md my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Machine Info */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target Kiosk</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Machine
              </span>
            </div>
            <p className="text-base font-bold text-white mt-1">
              {machine?.name || `Kiosk ${machineId}`}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {machine?.location_address || 'Connected Printing Station'}
            </p>
          </div>

          {!uploadSuccess ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white font-heading">
                  Upload PDF Document
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select a document from your phone (Max 100MB)
                </p>
              </div>

              {/* Drag and Drop / Touch Upload Box */}
              <label className="relative flex flex-col items-center justify-center w-full min-h-[220px] bg-slate-950/90 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl cursor-pointer p-6 transition-all group">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-all">
                  <UploadCloud className="w-8 h-8" />
                </div>

                {selectedFile ? (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-sm font-bold text-cyan-300 max-w-[240px] truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-sm font-bold text-slate-200 block">Tap to Select PDF</span>
                    <span className="text-xs text-slate-500 block mt-1">Supports all standard PDF files</span>
                  </div>
                )}
              </label>

              {errorMsg && (
                <div className="mt-4 p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Upload Progress Bar */}
              {uploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Uploading file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 text-white font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2"
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
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Upload Successful!
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-xs">
                Look at the kiosk screen! Your document has automatically opened.
              </p>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadSuccess(false);
                }}
                className="mt-8 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs btn-touch"
              >
                Upload Another Document
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Footer */}
      <footer className="w-full max-w-md text-center text-xs text-slate-500 py-3">
        © 2026 PrintPulse Self-Service Printing Systems
      </footer>
    </div>
  );
};

export default MobileUpload;
