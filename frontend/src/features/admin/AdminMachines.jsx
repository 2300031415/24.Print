import React, { useEffect, useState } from 'react';
import { Monitor, Plus, QrCode, MapPin, Printer, Wifi, ShieldCheck, X, ExternalLink, Cpu } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminMachines = () => {
  const [machines, setMachines] = useState([]);
  const [clients, setClients] = useState([]);
  const [unregisteredHardware, setUnregisteredHardware] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQrMachine, setSelectedQrMachine] = useState(null);

  const [formData, setFormData] = useState({
    machine_code: 'FFPVT_EasyXerox-001',
    name: 'FFPVT_EasyXerox-001',
    mac_address: '',
    client_id: '',
    location_address: '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    default_printer_name: 'Auto-Detecting Printer...'
  });

  const openRegisterModal = (prefillMac = '') => {
    const nextNum = String(machines.length + 1).padStart(3, '0');
    const defaultCode = `FFPVT_EasyXerox-${nextNum}`;
    setFormData({
      machine_code: defaultCode,
      name: defaultCode,
      mac_address: prefillMac || (unregisteredHardware.length > 0 ? unregisteredHardware[0].mac_address : ''),
      client_id: clients.length > 0 ? clients[0].id : '',
      location_address: '',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      default_printer_name: 'Auto-Detecting Printer...'
    });
    setShowModal(true);
  };

  const fetchData = async () => {
    try {
      const machRes = await api.get('/machines');
      if (machRes.data.success) setMachines(machRes.data.machines);

      const clientRes = await api.get('/clients');
      if (clientRes.data.success) {
        setClients(clientRes.data.clients);
      }

      const unregRes = await api.get('/machines/unregistered');
      if (unregRes.data.success) {
        setUnregisteredHardware(unregRes.data.hardware || []);
      }
    } catch (err) {
      console.error('Error loading machines or hardware status:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/machines', formData);
      if (res.data.success) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering machine.');
    }
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    const publicDomain = import.meta.env.VITE_PUBLIC_DOMAIN || 'https://easyxerox.com';
    const qrUrl = `${publicDomain}/upload/${selectedQrMachine.machine_code}`;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Kiosk QR Code - ${selectedQrMachine.machine_code}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .card { border: 3px solid #000; border-radius: 20px; padding: 30px; display: inline-block; }
            h1 { margin: 0 0 10px 0; font-size: 28px; }
            h2 { color: #0066FF; margin: 0 0 20px 0; font-size: 20px; }
            p { font-size: 14px; margin-top: 15px; color: #555; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="card">
            <h1>SCAN TO PRINT</h1>
            <h2>${selectedQrMachine.machine_code}</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}" width="250" height="250" />
            <p>Scan with Phone Camera or WhatsApp to Upload Document</p>
            <p><strong>${qrUrl}</strong></p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <PortalLayout title="Kiosk Machine Registry & Hardware Pairing" role="admin">
      <div className="w-full max-w-7xl mx-auto space-y-6 select-none font-sans">
        
        {/* DETECTED HARDWARE BANNER */}
        {unregisteredHardware.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl flex items-center justify-between gap-4 text-amber-950 shadow-md">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-black uppercase tracking-wide">Detected Hardware Standby Boards ({unregisteredHardware.length})</h4>
                <p className="text-xs font-bold text-amber-800 mt-0.5">
                  New kiosk hardware detected! MAC: <span className="font-mono font-black">{unregisteredHardware.map(h => h.mac_address).join(', ')}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => openRegisterModal(unregisteredHardware[0].mac_address)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs shadow-md shrink-0 btn-touch"
            >
              Assign & Pair Board ⚡
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-950 font-heading">Registered Hardware Fleet</h3>
            <p className="text-slate-600 font-bold text-xs mt-1">Register new Kiosks, pair hardware MAC addresses, and generate machine QR codes.</p>
          </div>
          <button
            onClick={() => openRegisterModal()}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md flex items-center gap-2 btn-touch text-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Register New Kiosk</span>
          </button>
        </div>

        {/* MACHINES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-mono font-black">
                    {machine.machine_code}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      machine.status === 'online'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {machine.status || 'Online'}
                  </span>
                </div>

                <h4 className="text-xl font-black text-slate-950 font-heading mb-1">{machine.machine_code}</h4>
                <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{machine.location_address || 'Metro Station Entrance #2'}</span>
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Partner Owner</span>
                    <span className="text-slate-950 font-black">{machine.client_name || 'Metro Xerox & Print Zone'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hardware MAC ID</span>
                    <span className="text-blue-700 font-mono font-extrabold">{machine.mac_address || 'Auto-Paired'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Default Printer</span>
                    <span className="text-blue-700 font-mono font-bold truncate max-w-[140px]">{machine.default_printer_name || 'No Printer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Printed Jobs</span>
                    <span className="text-emerald-600 font-mono font-black">{machine.total_jobs_printed || 0}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`/kiosk/${machine.machine_code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black rounded-2xl text-xs border border-emerald-200 flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Open Kiosk Touch Display Screen ↗️</span>
                </a>

                <button
                  onClick={() => setSelectedQrMachine(machine)}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black rounded-2xl text-xs border border-blue-200 flex items-center justify-center gap-2 btn-touch shadow-sm"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>View & Print QR Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MACHINE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-2xl relative text-slate-950">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-950">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-slate-950 font-heading mb-6">Register & Pair Kiosk Hardware</h3>

            <form onSubmit={handleCreateMachine} className="space-y-4">
              {/* MAC ADDRESS SELECTION / DISPLAY */}
              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Hardware MAC Address (Auto-Detected)</label>
                {unregisteredHardware.length > 0 ? (
                  <select
                    value={formData.mac_address}
                    onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-amber-300 rounded-xl p-3.5 text-sm font-mono font-black text-slate-950 focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    <option value="">Manual Entry / Auto-Detect Later</option>
                    {unregisteredHardware.map((h) => (
                      <option key={h.mac_address} value={h.mac_address}>⚡ Detected: {h.mac_address} ({h.ip_address})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. b4:2e:99:a1:c4:8f (or leave blank to auto-pair)"
                    value={formData.mac_address}
                    onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-mono font-bold focus:border-blue-600 focus:bg-white"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Machine Code</label>
                  <input
                    type="text"
                    required
                    value={formData.machine_code}
                    onChange={(e) => setFormData({ ...formData, machine_code: e.target.value.toUpperCase(), name: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-mono font-bold focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Select Client Owner</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.business_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-1">Location Address</label>
                <input
                  type="text"
                  required
                  value={formData.location_address}
                  onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-sm text-slate-950 font-bold focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md btn-touch text-base mt-4"
              >
                Register & Pair Board
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default AdminMachines;
