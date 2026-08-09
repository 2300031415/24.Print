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
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 flex overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-stone-950/95 border-r border-amber-500/20 flex flex-col justify-between p-6 shrink-0 backdrop-blur-xl">
        <div>
          {/* Logo */}
          <div className="flex flex-col mb-8 px-2 gap-2">
            <div className="logo-badge self-start py-2 px-4 shadow-gold-glow">
              <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block pl-1">
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
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-900/30 text-amber-300 border border-amber-500/40 shadow-gold-glow'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="pt-6 border-t border-amber-500/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.full_name || 'System User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800/80 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 btn-touch"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-20 bg-slate-900/60 border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white font-heading">{title}</h2>
          
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
              System Time: {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
