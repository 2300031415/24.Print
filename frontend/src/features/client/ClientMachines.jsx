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
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md">
          <p className="text-slate-700 font-bold text-sm">
            Manage your kiosk locations and toggle maintenance mode to temporarily pause paper loading or routine maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => {
            const isMaintenance = machine.status === 'maintenance';
            return (
              <div
                key={machine.id}
                className={`p-6 rounded-3xl border-2 transition-all space-y-5 shadow-xl ${
                  isMaintenance
                    ? 'border-amber-300 bg-amber-50/80'
                    : 'border-blue-100 bg-white hover:border-blue-500'
                }`}
              >
                {/* HEADER BADGE & TOGGLE */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-mono font-black shadow-sm">
                    {machine.machine_code}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                        isMaintenance
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isMaintenance ? (
                        <>
                          <Wrench className="w-3.5 h-3.5 animate-spin text-amber-700" />
                          Under Maintenance
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Operational
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* MACHINE NAME & LOCATION */}
                <div>
                  <h3 className="text-xl font-black text-slate-950 font-heading">{machine.name}</h3>
                  <p className="text-xs text-slate-700 font-bold flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{machine.location_address || 'Registered Location'}</span>
                  </p>
                </div>

                {/* MAINTENANCE TOGGLE CONTROL CARD */}
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-950">Board Operational Control</p>
                    <p className="text-[11px] text-slate-600 font-bold">
                      {isMaintenance ? 'Kiosk display is currently stopped' : 'Kiosk is active & taking prints'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleMaintenance(machine)}
                    disabled={loadingId === machine.id}
                    className={`relative w-14 h-8 rounded-full transition-colors p-1 flex items-center shadow-inner ${
                      isMaintenance ? 'bg-amber-500' : 'bg-emerald-500'
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
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-bold">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Printer Hardware Status</span>
                    <span className="text-emerald-700 font-black capitalize">{machine.printer_status || 'ready'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Printer Model</span>
                    <span className="text-slate-950 font-mono font-black">{machine.default_printer_name || 'Brother DCP-T820DW Printer'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientMachines;
