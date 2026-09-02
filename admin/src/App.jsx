import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './features/AdminLogin';
import AdminDashboard from './features/AdminDashboard';
import AdminClients from './features/AdminClients';
import AdminMachines from './features/AdminMachines';
import AdminPricing from './features/AdminPricing';
import AdminGst from './features/AdminGst';
import AdminReports from './features/AdminReports';
import AdminLogs from './features/AdminLogs';
import AdminAds from './features/AdminAds';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-rose-500 mb-2">Access Denied</h2>
          <p className="text-xs text-slate-400 mb-6">Super Admin permissions required to access this portal.</p>
          <a href="/login" className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs inline-block">
            Sign In as Admin
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
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
        <Route path="/machines" element={<ProtectedRoute><AdminMachines /></ProtectedRoute>} />
        <Route path="/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
        <Route path="/gst" element={<ProtectedRoute><AdminGst /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><AdminLogs /></ProtectedRoute>} />
        <Route path="/ads" element={<ProtectedRoute><AdminAds /></ProtectedRoute>} />

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
