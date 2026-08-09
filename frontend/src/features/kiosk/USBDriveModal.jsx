import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Usb, FolderOpen, FileText, Image, X, Loader2,
  CheckCircle, AlertCircle, Upload, ChevronRight, HardDrive, File
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

/**
 * USBDriveModal — shown on the kiosk screen when a USB pendrive is inserted.
 *
 * Flow:
 *   1. USB plugged in → backend relays USB_DRIVE_CONNECTED → show toast
 *   2. User taps "Open Drive" → request file list via USB_LIST_FILES
 *   3. Daemon responds USB_FILES_LIST → show file explorer
 *   4. User taps a file → emit USB_SELECT_FILE
 *   5. Daemon reads & uploads → emits USB_UPLOAD_PROGRESS (reading → uploading → done)
 *   6. Backend emits FILE_UPLOADED → KioskHome navigates to preview automatically
 */

const FILE_ICONS = {
  PDF:  { icon: FileText, color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  JPG:  { icon: Image,    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  JPEG: { icon: Image,    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  PNG:  { icon: Image,    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  DOC:  { icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  DOCX: { icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  TXT:  { icon: File,     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
};

export default function USBDriveModal({ machineId }) {
  const { socket } = useSocket();

  // Drive state
  const [activeDrive, setActiveDrive]       = useState(null);   // { driveLetter, volumeName, totalSize, freeSpace }
  const [showToast, setShowToast]           = useState(false);
  const [showExplorer, setShowExplorer]     = useState(false);
  const [files, setFiles]                   = useState([]);
  const [loadingFiles, setLoadingFiles]     = useState(false);

  // Upload state
  const [uploadState, setUploadState]       = useState(null);  // null | { status, fileName, error }
  const [selectedFile, setSelectedFile]     = useState(null);

  // ─── Socket event listeners ────────────────────────────────

  const handleDriveConnected = useCallback((data) => {
    console.log('🔌 Kiosk UI received USB_DRIVE_CONNECTED event:', data);
    const drive = data?.drive || data;
    if (drive && drive.driveLetter) {
      setActiveDrive(drive);
      setShowToast(true);
      setShowExplorer(false);
      setFiles([]);
      setUploadState(null);
      setSelectedFile(null);
    }
  }, []);

  const handleDriveDisconnected = useCallback((data) => {
    console.log('🔌 Kiosk UI received USB_DRIVE_DISCONNECTED event:', data);
    setActiveDrive(null);
    setShowToast(false);
    setShowExplorer(false);
    setFiles([]);
    setUploadState(null);
    setSelectedFile(null);
  }, []);


  const handleFilesList = useCallback((data) => {
    setLoadingFiles(false);
    setFiles(data.files || []);
  }, []);

  const handleUploadProgress = useCallback((data) => {
    setUploadState({ status: data.status, fileName: data.fileName, error: data.error });
    if (data.status === 'done') {
      // Preview will auto-launch via FILE_UPLOADED event → KioskHome navigates
      // Close modal after a short success display
      setTimeout(() => {
        setShowExplorer(false);
        setShowToast(false);
        setActiveDrive(null);
        setUploadState(null);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('USB_DRIVE_CONNECTED',    handleDriveConnected);
    socket.on('USB_DRIVE_DISCONNECTED', handleDriveDisconnected);
    socket.on('USB_FILES_LIST',         handleFilesList);
    socket.on('USB_UPLOAD_PROGRESS',    handleUploadProgress);
    return () => {
      socket.off('USB_DRIVE_CONNECTED',    handleDriveConnected);
      socket.off('USB_DRIVE_DISCONNECTED', handleDriveDisconnected);
      socket.off('USB_FILES_LIST',         handleFilesList);
      socket.off('USB_UPLOAD_PROGRESS',    handleUploadProgress);
    };
  }, [socket, handleDriveConnected, handleDriveDisconnected, handleFilesList, handleUploadProgress]);

  // ─── Actions ───────────────────────────────────────────────

  const openDrive = () => {
    if (!socket || !activeDrive) return;
    setShowToast(false);
    setShowExplorer(true);
    setLoadingFiles(true);
    socket.emit('USB_LIST_FILES', { machineCode: machineId, driveLetter: activeDrive.driveLetter });
  };

  const selectFile = (file) => {
    if (!socket || !activeDrive) return;
    if (uploadState && uploadState.status !== 'error') return; // prevent double-click while uploading
    setSelectedFile(file);
    setUploadState({ status: 'reading', fileName: file.name });
    socket.emit('USB_SELECT_FILE', {
      machineCode: machineId,
      filePath: file.path,
      fileName: file.name,
      driveLetter: activeDrive.driveLetter
    });
  };

  const closeAll = () => {
    setShowToast(false);
    setShowExplorer(false);
    setUploadState(null);
    setSelectedFile(null);
  };

  // ─── Sub-renders ───────────────────────────────────────────

  const FileIcon = ({ ext }) => {
    const cfg = FILE_ICONS[ext] || FILE_ICONS['TXT'];
    const IconComp = cfg.icon;
    return (
      <div style={{ background: cfg.bg, borderRadius: 10, padding: 8, flexShrink: 0 }}>
        <IconComp size={22} color={cfg.color} />
      </div>
    );
  };

  const UploadProgress = () => {
    if (!uploadState) return null;
    const { status, fileName, error } = uploadState;

    const statusConfig = {
      reading:   { icon: <Loader2 size={20} className="animate-spin text-cyan-400" />,    label: 'Reading file from USB…',  color: '#22d3ee' },
      uploading: { icon: <Upload   size={20} style={{ color: '#818cf8' }} />,               label: 'Uploading to kiosk…',     color: '#818cf8' },
      done:      { icon: <CheckCircle size={20} style={{ color: '#34d399' }} />,            label: 'Upload complete! Opening preview…', color: '#34d399' },
      error:     { icon: <AlertCircle size={20} style={{ color: '#f87171' }} />,            label: error || 'Upload failed', color: '#f87171' },
    };

    const cfg = statusConfig[status] || statusConfig.reading;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: '#0f172a', border: `1px solid ${cfg.color}40`,
          borderRadius: 20, padding: '16px 28px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: `0 0 30px ${cfg.color}20`,
          zIndex: 9999, minWidth: 340
        }}
      >
        {cfg.icon}
        <div>
          <div style={{ color: cfg.color, fontWeight: 700, fontSize: 14 }}>{cfg.label}</div>
          <div style={{ color: '#64748b', fontSize: 12 }}>{fileName}</div>
        </div>
      </motion.div>
    );
  };

  // ─── Render ────────────────────────────────────────────────

  return (
    <>
      {/* ── USB INSERT TOAST ─────────────────────────────── */}
      <AnimatePresence>
        {showToast && activeDrive && (
          <motion.div
            key="usb-toast"
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            style={{
              position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
              zIndex: 9998, minWidth: 420,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              border: '1px solid rgba(6,182,212,0.4)',
              borderRadius: 24, padding: '20px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(6,182,212,0.12)',
              display: 'flex', alignItems: 'center', gap: 16
            }}
          >
            {/* USB Icon pulsing */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'rgba(6,182,212,0.15)',
                border: '1px solid rgba(6,182,212,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}
            >
              <Usb size={26} color="#22d3ee" />
            </motion.div>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#22d3ee', fontWeight: 800, fontSize: 16, fontFamily: 'inherit' }}>
                USB Drive Detected!
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
                {activeDrive.volumeName} • {activeDrive.driveLetter} • {activeDrive.totalSize}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={openDrive}
                style={{
                  padding: '10px 20px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 15px rgba(6,182,212,0.35)'
                }}
              >
                <FolderOpen size={16} />
                Open Drive
              </button>
              <button
                onClick={closeAll}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
                  color: '#64748b', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FILE EXPLORER MODAL ───────────────────────────── */}
      <AnimatePresence>
        {showExplorer && (
          <motion.div
            key="usb-explorer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9997,
              background: 'rgba(2,6,23,0.88)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32
            }}
          >
            <motion.div
              initial={{ scale: 0.93, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              style={{
                width: '100%', maxWidth: 680, maxHeight: '82vh',
                background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
                border: '1px solid rgba(6,182,212,0.3)',
                borderRadius: 28,
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(6,182,212,0.08)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(6,182,212,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <HardDrive size={22} color="#22d3ee" />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
                      {activeDrive?.volumeName || 'USB Drive'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>
                      {activeDrive?.driveLetter} • {activeDrive?.freeSpace} • Tap a file to print it
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeAll}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
                    color: '#94a3b8', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* File List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                {loadingFiles ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '60px 0', gap: 16
                  }}>
                    <Loader2 size={36} color="#22d3ee" className="animate-spin" />
                    <div style={{ color: '#64748b', fontSize: 14 }}>Reading USB drive…</div>
                  </div>
                ) : files.length === 0 ? (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '60px 0', gap: 12
                  }}>
                    <FolderOpen size={48} color="#334155" />
                    <div style={{ color: '#475569', fontSize: 15, fontWeight: 600 }}>No printable files found</div>
                    <div style={{ color: '#334155', fontSize: 13 }}>
                      Supported: PDF, JPG, PNG, DOCX, TXT
                    </div>
                  </div>
                ) : (
                  files.map((file, idx) => {
                    const isSelected = selectedFile?.path === file.path;
                    const isUploading = isSelected && uploadState && uploadState.status !== 'done' && uploadState.status !== 'error';
                    return (
                      <motion.button
                        key={file.path}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => !isUploading && selectFile(file)}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 16, marginBottom: 6,
                          background: isSelected
                            ? 'rgba(6,182,212,0.12)'
                            : 'rgba(255,255,255,0.03)',
                          border: isSelected
                            ? '1px solid rgba(6,182,212,0.35)'
                            : '1px solid rgba(255,255,255,0.06)',
                          cursor: isUploading ? 'not-allowed' : 'pointer',
                          textAlign: 'left', transition: 'background 0.2s, border 0.2s'
                        }}
                      >
                        <FileIcon ext={file.extension} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            color: '#f1f5f9', fontWeight: 600, fontSize: 14,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>
                            {file.name}
                          </div>
                          <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                            {file.folder ? `📁 ${file.folder} • ` : ''}{file.size}
                            {file.extension === 'PDF' && <span style={{ color: '#f97316', marginLeft: 8, fontWeight: 700 }}>PDF</span>}
                          </div>
                        </div>

                        <div style={{ flexShrink: 0 }}>
                          {isUploading ? (
                            <Loader2 size={18} color="#22d3ee" className="animate-spin" />
                          ) : (
                            <ChevronRight size={18} color="#334155" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Footer hint */}
              <div style={{
                padding: '14px 28px', borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.15)'
              }}>
                <div style={{ color: '#475569', fontSize: 12, textAlign: 'center' }}>
                  Tap any file to automatically upload and open print preview.
                  PDFs go directly to the print flow.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── UPLOAD PROGRESS TOAST ─────────────────────────── */}
      <AnimatePresence>
        {uploadState && showExplorer && <UploadProgress key="upload-prog" />}
      </AnimatePresence>
    </>
  );
}
