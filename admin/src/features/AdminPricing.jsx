import React, { useEffect, useState } from 'react';
import { DollarSign, Save, Monitor } from 'lucide-react';

import PortalLayout from '../components/PortalLayout';
import api from '../services/api';

const AdminPricing = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState('all');
  const [formData, setFormData] = useState({
    bw_single_page_price: 2.00,
    color_single_page_price: 10.00,
    bw_duplex_page_price: 3.50,
    color_duplex_page_price: 18.00,
    paper_size: 'A4'
  });

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await api.get('/machines');
        if (res.data.success) {
          setMachines(res.data.machines || []);
        }
      } catch (err) {
        console.error('Error loading machines list:', err);
      }
    };
    fetchMachines();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await api.get('/settings/pricing');
      if (res.data.success && res.data.pricingList.length > 0) {
        const def = res.data.pricingList[0];
        setFormData({
          id: def.id,
          bw_single_page_price: parseFloat(def.bw_single_page_price || 2.00),
          color_single_page_price: parseFloat(def.color_single_page_price || 10.00),
          bw_duplex_page_price: parseFloat(def.bw_duplex_page_price || 3.50),
          color_duplex_page_price: parseFloat(def.color_duplex_page_price || 18.00),
          paper_size: def.paper_size || 'A4'
        });
      }
    } catch (err) {
      console.error('Error loading pricing:', err);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [selectedMachineId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        bw_single_page_price: Number(formData.bw_single_page_price) || 0,
        color_single_page_price: Number(formData.color_single_page_price) || 0,
        bw_duplex_page_price: Number(formData.bw_duplex_page_price) || 0,
        color_duplex_page_price: Number(formData.color_duplex_page_price) || 0,
        machine_id: selectedMachineId
      };
      const res = await api.post('/settings/pricing', payload);
      if (res.data.success) {
        alert(`Pricing rates updated successfully for ${selectedMachineId === 'all' ? 'All Kiosk Boards' : 'Selected Kiosk Board'}!`);
        fetchPricing();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating pricing rules.');
    }
  };

  return (
    <PortalLayout title="Global Print Pricing Rate Management">
      <div className="w-full max-w-4xl mx-auto space-y-6 select-none font-sans">
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-6 text-slate-950">
          <h3 className="text-2xl font-black text-slate-950 font-heading border-b border-blue-100 pb-4 flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-blue-600" />
            <span>Configure Kiosk Print Pricing</span>
          </h3>

          {/* KIOSK MACHINE / PRODUCT SELECTION */}
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-blue-100 shadow-sm">
            <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span>Select Target Product / Kiosk Machine</span>
            </label>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-base font-black text-slate-950 cursor-pointer focus:border-blue-600 focus:outline-none shadow-sm transition-all"
            >
              <option value="all">All Kiosk Boards</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.machine_code || m.name || 'FFPVT_EasyXerox-001'}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">B&W Single Side (₹/Page)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={isNaN(formData.bw_single_page_price) ? '' : formData.bw_single_page_price}
                  onChange={(e) => setFormData({ ...formData, bw_single_page_price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-mono font-black text-slate-950 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Color Single Side (₹/Page)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={isNaN(formData.color_single_page_price) ? '' : formData.color_single_page_price}
                  onChange={(e) => setFormData({ ...formData, color_single_page_price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-mono font-black text-blue-600 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">B&W Duplex Both Sides (₹/Sheet)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={isNaN(formData.bw_duplex_page_price) ? '' : formData.bw_duplex_page_price}
                  onChange={(e) => setFormData({ ...formData, bw_duplex_page_price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-mono font-black text-slate-950 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Color Duplex Both Sides (₹/Sheet)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={isNaN(formData.color_duplex_page_price) ? '' : formData.color_duplex_page_price}
                  onChange={(e) => setFormData({ ...formData, color_duplex_page_price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-mono font-black text-blue-600 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-md btn-touch text-base flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Kiosk Rates</span>
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminPricing;
