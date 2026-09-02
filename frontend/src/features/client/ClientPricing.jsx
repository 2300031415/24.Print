import React, { useEffect, useState } from 'react';
import { DollarSign, Save, Monitor } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientPricing = () => {
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
          bw_single_page_price: def.bw_single_page_price,
          color_single_page_price: def.color_single_page_price,
          bw_duplex_page_price: def.bw_duplex_page_price,
          color_duplex_page_price: def.color_duplex_page_price,
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
      const res = await api.post('/settings/pricing', { ...formData, machine_id: selectedMachineId });
      if (res.data.success) {
        alert('Print rates updated successfully!');
        fetchPricing();
      }
    } catch (err) {
      alert('Error updating pricing rates.');
    }
  };

  return (
    <PortalLayout title="My Kiosk Print Rates Configuration" role="client">
      <div className="w-full max-w-7xl mx-auto space-y-8 select-none font-sans">
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-8">
          <h3 className="text-2xl font-black text-slate-950 font-heading flex items-center gap-3 border-b border-blue-100 pb-4">
            <DollarSign className="w-7 h-7 text-blue-600" />
            <span>Configure Kiosk Print Pricing</span>
          </h3>

          {/* Target Kiosk Selection */}
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
              <option value="all">All Kiosks (Default Rate)</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.machine_code || m.name || 'FFPVT_EasyXerox-001'}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
                  B&W Single Side (₹/Page)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.bw_single_page_price}
                  onChange={(e) => setFormData({ ...formData, bw_single_page_price: parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-black text-slate-950 font-mono focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
                  Color Single Side (₹/Page)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.color_single_page_price}
                  onChange={(e) => setFormData({ ...formData, color_single_page_price: parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-black text-blue-700 font-mono focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
                  B&W Duplex Both Sides (₹/Sheet)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.bw_duplex_page_price}
                  onChange={(e) => setFormData({ ...formData, bw_duplex_page_price: parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-black text-slate-950 font-mono focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">
                  Color Duplex Both Sides (₹/Sheet)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={formData.color_duplex_page_price}
                  onChange={(e) => setFormData({ ...formData, color_duplex_page_price: parseFloat(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl p-3.5 text-xl font-black text-blue-700 font-mono focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl transition-all shadow-blue-glow btn-touch flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5 text-white" />
                <span>Save Kiosk Rates</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientPricing;
