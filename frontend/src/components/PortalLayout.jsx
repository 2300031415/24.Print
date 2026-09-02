import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Monitor, Tv, DollarSign, Percent, BarChart3, 
  History, LogOut, Printer, Shield, ChevronRight, FileText, Key
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const PortalLayout = ({ children, title = 'Dashboard', role = 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Clients Mgt', path: '/admin/clients', icon: Users },
    { name: 'Kiosk Machines', path: '/admin/machines', icon: Monitor },
    { name: 'Print Pricing', path: '/admin/pricing', icon: DollarSign },
    { name: 'GST Settings', path: '/admin/gst', icon: Percent },
    { name: 'Revenue Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Activity Logs', path: '/admin/logs', icon: History }
  ];

  const clientNav = [
    { name: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
    { name: 'My Machines', path: '/client/machines', icon: Monitor },
    { name: 'Print Pricing', path: '/client/pricing', icon: DollarSign },
    { name: 'GST Settings', path: '/client/gst', icon: Percent },
    { name: 'Payment API Keys', path: '/client/settings', icon: Key },
    { name: 'Promotional Ads', path: '/client/ads', icon: Tv },
    { name: 'Transactions', path: '/client/transactions', icon: FileText }
  ];

  const navItems = role === 'admin' ? adminNav : clientNav;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION (Royal Blue Theme) */}
      <aside className="w-72 bg-blue-600 border-r-2 border-blue-700 flex flex-col justify-between p-6 shrink-0 shadow-2xl">
        <div>
          {/* Logo Badge */}
          <div className="flex flex-col mb-8 px-2 gap-2">
            <div className="bg-white p-1.5 px-4 rounded-2xl border-2 border-blue-700 shadow-xl self-start overflow-hidden">
              <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain scale-140 transform" />
            </div>
            <span className="text-[11px] uppercase font-black tracking-widest text-blue-100 block pl-1">
              {role === 'admin' ? 'Super Admin Portal' : 'Client Owner Portal'}
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-extrabold transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-lg border-2 border-blue-200'
                      : 'text-white/90 hover:text-white hover:bg-blue-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-blue-100'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="pt-6 border-t border-blue-500/60">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center font-black text-blue-600 shadow-md">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{user?.full_name || 'System User'}</p>
              <p className="text-[11px] text-blue-100 font-bold truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-blue-900/60 hover:bg-rose-600 hover:text-white text-white font-extrabold rounded-xl text-xs border border-blue-400/30 transition-all flex items-center justify-center gap-2 btn-touch shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA (Light Ice White Background) */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        {/* Top Navbar Header */}
        <header className="h-20 bg-white/95 border-b border-blue-100 px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md shadow-sm">
          <h2 className="text-2xl font-black font-heading text-slate-950">{title}</h2>
          
          <div className="flex items-center gap-4">
            <span className="px-3.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-extrabold rounded-xl border border-blue-200 shadow-sm">
              System Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
