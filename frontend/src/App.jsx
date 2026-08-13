import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Kiosk HMI Views
import KioskHome from './features/kiosk/KioskHome';
import KioskPdfPreview from './features/kiosk/KioskPdfPreview';
import KioskPrintOptions from './features/kiosk/KioskPrintOptions';

// Mobile Upload View
import MobileUpload from './features/mobile/MobileUpload';

// Universal Login
import Login from './features/auth/Login';

// Admin Portal Views
import AdminDashboard from './features/admin/AdminDashboard';
import AdminClients from './features/admin/AdminClients';
import AdminMachines from './features/admin/AdminMachines';
import AdminPricing from './features/admin/AdminPricing';
import AdminGst from './features/admin/AdminGst';
import AdminReports from './features/admin/AdminReports';
import AdminLogs from './features/admin/AdminLogs';

// Client Portal Views
import ClientDashboard from './features/client/ClientDashboard';
import ClientMachines from './features/client/ClientMachines';
import ClientAds from './features/client/ClientAds';
import ClientTransactions from './features/client/ClientTransactions';
import ClientSettings from './features/client/ClientSettings';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} replace />;
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
      <div className="min-h-screen bg-[#fff9ee] flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md bg-white border-2 border-[#0066FF] rounded-3xl p-8 shadow-2xl">
          <div className="logo-badge mb-4 py-2 px-6 shadow-md">
            <img src="/logo.png" alt="EasyXerox" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-black text-[#0066FF] mb-2 font-heading">
            Hardware Kiosk Screen Only
          </h2>
          <p className="text-xs text-slate-600 font-medium mb-6 leading-relaxed">
            This kiosk display screen is restricted and can only be operated directly on the physical kiosk machine hardware.
          </p>
          <a
            href="/login"
            className="px-6 py-3.5 bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold text-xs rounded-xl shadow-lg inline-block transition-all"
          >
            Go to Partner & Admin Login Portal
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
          {/* Default Route -> On Netlify redirect to /login, on Kiosk Board redirect to /kiosk/KIOSK-001 */}
          <Route path="/" element={<Navigate to={isLocalhost ? "/kiosk/KIOSK-001" : "/login"} replace />} />

          {/* 1. KIOSK APPLICATION ROUTES (Restricted to Physical Kiosk Hardware Board) */}
          <Route path="/kiosk/:machineId" element={<LocalKioskGuard><KioskHome /></LocalKioskGuard>} />
          <Route path="/kiosk/:machineId/preview/:uploadToken" element={<LocalKioskGuard><KioskPdfPreview /></LocalKioskGuard>} />
          <Route path="/kiosk/:machineId/options/:uploadToken" element={<LocalKioskGuard><KioskPrintOptions /></LocalKioskGuard>} />

          {/* 2. MOBILE UPLOAD WEBSITE */}
          <Route path="/upload/:machineId" element={<MobileUpload />} />

          {/* 3. UNIVERSAL LOGIN ROUTE */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/client/login" element={<Navigate to="/login" replace />} />

          {/* 4. ADMIN PORTAL ROUTES */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={['admin']}><AdminClients /></ProtectedRoute>} />
          <Route path="/admin/machines" element={<ProtectedRoute allowedRoles={['admin']}><AdminMachines /></ProtectedRoute>} />
          <Route path="/admin/pricing" element={<ProtectedRoute allowedRoles={['admin']}><AdminPricing /></ProtectedRoute>} />
          <Route path="/admin/gst" element={<ProtectedRoute allowedRoles={['admin']}><AdminGst /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLogs /></ProtectedRoute>} />

          {/* 5. CLIENT PORTAL ROUTES */}
          <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/machines" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientMachines /></ProtectedRoute>} />
          <Route path="/client/pricing" element={<ProtectedRoute allowedRoles={['client', 'admin']}><AdminPricing role="client" /></ProtectedRoute>} />
          <Route path="/client/gst" element={<ProtectedRoute allowedRoles={['client', 'admin']}><AdminGst role="client" /></ProtectedRoute>} />
          <Route path="/client/settings" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientSettings /></ProtectedRoute>} />
          <Route path="/client/ads" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientAds /></ProtectedRoute>} />
          <Route path="/client/transactions" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientTransactions /></ProtectedRoute>} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to={isLocalhost ? "/kiosk/KIOSK-001" : "/login"} replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
