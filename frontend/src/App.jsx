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

// Admin Portal Views
import AdminLogin from './features/admin/AdminLogin';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminClients from './features/admin/AdminClients';
import AdminMachines from './features/admin/AdminMachines';
import AdminAds from './features/admin/AdminAds';
import AdminPricing from './features/admin/AdminPricing';
import AdminGst from './features/admin/AdminGst';
import AdminReports from './features/admin/AdminReports';
import AdminLogs from './features/admin/AdminLogs';

// Client Portal Views
import ClientLogin from './features/client/ClientLogin';
import ClientDashboard from './features/client/ClientDashboard';
import ClientMachines from './features/client/ClientMachines';
import ClientAds from './features/client/ClientAds';
import ClientTransactions from './features/client/ClientTransactions';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Default Route -> Redirect to Kiosk-001 Home */}
          <Route path="/" element={<Navigate to="/kiosk/KIOSK-001" replace />} />

          {/* 1. KIOSK APPLICATION ROUTES */}
          <Route path="/kiosk/:machineId" element={<KioskHome />} />
          <Route path="/kiosk/:machineId/preview/:uploadToken" element={<KioskPdfPreview />} />
          <Route path="/kiosk/:machineId/options/:uploadToken" element={<KioskPrintOptions />} />

          {/* 2. MOBILE UPLOAD WEBSITE */}
          <Route path="/upload/:machineId" element={<MobileUpload />} />

          {/* 3. ADMIN PORTAL ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={['admin']}><AdminClients /></ProtectedRoute>} />
          <Route path="/admin/machines" element={<ProtectedRoute allowedRoles={['admin']}><AdminMachines /></ProtectedRoute>} />
          <Route path="/admin/ads" element={<ProtectedRoute allowedRoles={['admin']}><AdminAds /></ProtectedRoute>} />
          <Route path="/admin/pricing" element={<ProtectedRoute allowedRoles={['admin']}><AdminPricing /></ProtectedRoute>} />
          <Route path="/admin/gst" element={<ProtectedRoute allowedRoles={['admin']}><AdminGst /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminLogs /></ProtectedRoute>} />

          {/* 4. CLIENT PORTAL ROUTES */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/machines" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientMachines /></ProtectedRoute>} />
          <Route path="/client/ads" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientAds /></ProtectedRoute>} />
          <Route path="/client/transactions" element={<ProtectedRoute allowedRoles={['client', 'admin']}><ClientTransactions /></ProtectedRoute>} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/kiosk/KIOSK-001" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
