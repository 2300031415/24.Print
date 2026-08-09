import React, { useEffect, useState } from 'react';
import { Monitor, Printer, QrCode, MapPin, Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientMachines = () => {
  const [machines, setMachines] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchClientMachines = async () => {
    try {
      const res = await api.get('/machines');
      if (res.data.success) setMachines(res.data.machines);
    } catch (err) {
      console.error('Error fetching client machines:', err);
    }
  };

  useEffect(() => {
    fetchClientMachines();
  }, []);

  const handleToggleMaintenance = async (machine) => {
    const newStatus = machine.status === 'maintenance' ? 'online' : 'maintenance';
    setLoadingId(machine.id);
    try {
      const res = await api.put(`/machines/${machine.id}/status`, { status: newStatus });
      if (res.data.success) {
        setMachines((prev) =>
          prev.map((m) => (m.id === machine.id ? { ...m, status: newStatus } : m))
        );
      }
    } catch (err) {
      alert('Error updating machine operational status.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <PortalLayout title="My Registered Kiosks & Printers" role="client">
      <div className="space-y-4 mb-6">
        <p className="text-slate-400 text-sm">
          Manage your kiosk locations and toggle maintenance mode to temporarily pause paper loading or routine maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const isMaintenance = machine.status === 'maintenance';
          return (
            <div
              key={machine.id}
              className={`glass-panel p-6 rounded-3xl border transition-all space-y-5 ${
                isMaintenance ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              {/* HEADER BADGE & TOGGLE */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-mono font-bold">
                  {machine.machine_code}
                </span>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isMaintenance
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {isMaintenance ? (
                      <>
                        <Wrench className="w-3.5 h-3.5 animate-spin" />
                        Under Maintenance
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Operational
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* MACHINE NAME & LOCATION */}
              <div>
                <h3 className="text-xl font-bold text-white font-heading">{machine.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{machine.location_address || 'Registered Location'}</span>
                </p>
              </div>

              {/* MAINTENANCE TOGGLE CONTROL CARD */}
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Board Operational Control</p>
                  <p className="text-[11px] text-slate-400">
                    {isMaintenance ? 'Kiosk display is currently stopped' : 'Kiosk is active & taking prints'}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleMaintenance(machine)}
                  disabled={loadingId === machine.id}
                  className={`relative w-14 h-8 rounded-full transition-colors p-1 flex items-center ${
                    isMaintenance ? 'bg-amber-600' : 'bg-emerald-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center ${
                      isMaintenance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {isMaintenance ? (
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </button>
              </div>

              {/* PRINTER DETAILS */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Printer Hardware Status</span>
                  <span className="text-emerald-400 font-bold capitalize">{machine.printer_status || 'ready'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Printer Model</span>
                  <span className="text-white font-mono">{machine.default_printer_name || 'Brother DCP-T820DW Printer'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PortalLayout>
  );
};

export default ClientMachines;

