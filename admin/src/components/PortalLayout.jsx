import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Monitor, Tv, DollarSign, Percent, BarChart3, 
  History, LogOut, ChevronRight
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const PortalLayout = ({ children, title = 'Super Admin Portal' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients Mgt', path: '/clients', icon: Users },
    { name: 'Kiosk Machines', path: '/machines', icon: Monitor },
    { name: 'Print Pricing', path: '/pricing', icon: DollarSign },
    { name: 'GST Settings', path: '/gst', icon: Percent },
    { name: 'Ads Approval', path: '/ads', icon: Tv },
    { name: 'Revenue Reports', path: '/reports', icon: BarChart3 },
    { name: 'Activity Logs', path: '/logs', icon: History }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 shrink-0 shadow-2xl">
        <div>
          {/* Logo */}
          <div className="flex flex-col mb-8 px-2 gap-2">
            <div className="logo-badge self-start py-2 px-4 shadow-cyan-glow border border-cyan-500/40">
              <img src="/logo.png" alt="EasyXerox" className="h-9 w-auto object-contain" />
            </div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-cyan-400 block pl-1">
              Super Admin Control Portal
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-400">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.full_name || 'System Super Admin'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-950 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800/80 text-slate-300 font-semibold rounded-xl text-xs border border-slate-800 transition-all flex items-center justify-center gap-2 btn-touch"
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
            <span className="px-3 py-1 bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800">
              Port 8502 • Admin Service
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
