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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans select-none">
      {/* SIDEBAR NAVIGATION (Royal Blue Brand Palette) */}
      <aside className="w-72 bg-blue-600 border-r border-blue-700 flex flex-col justify-between p-6 shrink-0 shadow-2xl text-white">
        <div>
          {/* Logo Badge */}
          <div className="flex flex-col mb-8 px-2 gap-2">
            <div className="bg-white p-1 px-4 rounded-2xl border-2 border-blue-200 shadow-md self-start overflow-hidden">
              <img src="/logo.png" alt="EasyXerox" className="h-10 w-auto object-contain scale-140 transform" />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-100 block pl-1">
              Super Admin Control Portal
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xl'
                      : 'text-blue-100 hover:text-white hover:bg-blue-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-blue-200'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="pt-6 border-t border-blue-500/80">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 border-2 border-blue-200 flex items-center justify-center font-black text-base shadow-sm">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white truncate">{user?.full_name || 'System Super Admin'}</p>
              <p className="text-[11px] font-bold text-blue-200 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-rose-600 text-white font-black rounded-xl text-xs border border-blue-500 transition-all flex items-center justify-center gap-2 shadow-sm btn-touch"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b-2 border-blue-100 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950 font-heading">{title}</h2>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-black rounded-xl border border-blue-200 font-mono shadow-sm">
              System Date: {new Date().toLocaleDateString()}
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
