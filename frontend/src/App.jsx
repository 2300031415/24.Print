import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Public Product Landing Page
import LandingPage from './features/public/LandingPage';

// Kiosk HMI Views
import KioskHome from './features/kiosk/KioskHome';
import KioskPdfPreview from './features/kiosk/KioskPdfPreview';
import KioskPrintOptions from './features/kiosk/KioskPrintOptions';

// Mobile Upload View
import MobileUpload from './features/mobile/MobileUpload';

// Auth Login
import Login from './features/auth/Login';

// Client Portal Views
import ClientDashboard from './features/client/ClientDashboard';
import ClientMachines from './features/client/ClientMachines';
import ClientPricing from './features/client/ClientPricing';
import ClientGst from './features/client/ClientGst';
import ClientAds from './features/client/ClientAds';
import ClientTransactions from './features/client/ClientTransactions';
import ClientSettings from './features/client/ClientSettings';

// Admin Portal Views
import AdminLogin from './features/admin/AdminLogin';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminClients from './features/admin/AdminClients';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/client/dashboard" replace />;
  }
  return children;
};

// Check if running directly on physical kiosk board (localhost or hardware flag)
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '::1'
);

// Guard to block external web browsers from viewing the physical kiosk screen
const LocalKioskGuard = ({ children }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isHardwareBoard = isLocalhost || urlParams.get('hardware') === 'true' || urlParams.get('device') === 'kiosk';

  if (!isHardwareBoard) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="logo-badge mb-4 py-2 px-6 shadow-cyan-glow">
            <img src="/logo.png" alt="EasyXerox" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-black text-cyan-400 mb-2 font-heading">
            Hardware Kiosk Screen Only
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
            This kiosk display screen is restricted and can only be operated directly on the physical kiosk machine hardware.
          </p>
          <a
            href="/"
            className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-cyan-glow inline-block transition-all"
          >
            Go to Product Landing Page
          </a>
        </div>
      </div>
    );
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* 1. PUBLIC PRODUCT LANDING PAGE (easyxerox.com) */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. KIOSK APPLICATION ROUTES (Restricted to Physical Kiosk Hardware Board) */}
          <Route path="/kiosk/:machineId" element={<LocalKioskGuard><KioskHome /></LocalKioskGuard>} />
          <Route path="/kiosk/:machineId/preview/:uploadToken" element={<LocalKioskGuard><KioskPdfPreview /></LocalKioskGuard>} />
          <Route path="/kiosk/:machineId/options/:uploadToken" element={<LocalKioskGuard><KioskPrintOptions /></LocalKioskGuard>} />

          {/* 3. MOBILE UPLOAD WEBSITE (easyxerox.com/upload/:machineCode) */}
          <Route path="/upload/:machineId" element={<MobileUpload />} />

          {/* 4. CLIENT AUTHENTICATION & PORTAL ROUTES */}
          <Route path="/login" element={<Login defaultRole="client" />} />
          <Route path="/client/login" element={<Login defaultRole="client" />} />
          <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/machines" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientMachines /></ProtectedRoute>} />
          <Route path="/client/pricing" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientPricing /></ProtectedRoute>} />
          <Route path="/client/gst" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientGst /></ProtectedRoute>} />
          <Route path="/client/settings" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientSettings /></ProtectedRoute>} />
          <Route path="/client/ads" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientAds /></ProtectedRoute>} />
          <Route path="/client/transactions" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientTransactions /></ProtectedRoute>} />

          {/* 5. SUPER ADMIN CONTROL PORTAL ROUTES (easyxerox.com/admin) */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={['admin']}><AdminClients /></ProtectedRoute>} />

          {/* Fallback Catch-all -> Landing Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
