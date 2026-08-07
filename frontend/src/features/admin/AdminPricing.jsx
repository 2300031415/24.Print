import React, { useEffect, useState } from 'react';
import { DollarSign, Save, Percent } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminPricing = () => {
  const [pricingList, setPricingList] = useState([]);
  const [formData, setFormData] = useState({
    bw_single_page_price: 2.00,
    color_single_page_price: 10.00,
    bw_duplex_page_price: 3.50,
    color_duplex_page_price: 18.00,
    paper_size: 'A4'
  });

  const fetchPricing = async () => {
    try {
      const res = await api.get('/settings/pricing');
      if (res.data.success && res.data.pricingList.length > 0) {
        setPricingList(res.data.pricingList);
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/settings/pricing', formData);
      if (res.data.success) {
        alert('Pricing rules updated successfully!');
        fetchPricing();
      }
    } catch (err) {
      alert('Error updating pricing rules.');
    }
  };

  return (
    <PortalLayout title="Print Pricing Rate Management" role="admin">
      <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white font-heading mb-6 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-cyan-400" />
          <span>Global Print Rates Configuration</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-400 block mb-2">B&W Single Side (₹/Page)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.bw_single_page_price}
                onChange={(e) => setFormData({ ...formData, bw_single_page_price: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-lg font-bold text-white font-mono"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-400 block mb-2">Color Single Side (₹/Page)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.color_single_page_price}
                onChange={(e) => setFormData({ ...formData, color_single_page_price: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-lg font-bold text-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-400 block mb-2">B&W Duplex Both Sides (₹/Sheet)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.bw_duplex_page_price}
                onChange={(e) => setFormData({ ...formData, bw_duplex_page_price: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-lg font-bold text-white font-mono"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-400 block mb-2">Color Duplex Both Sides (₹/Sheet)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.color_duplex_page_price}
                onChange={(e) => setFormData({ ...formData, color_duplex_page_price: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-lg font-bold text-cyan-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Global Rates</span>
          </button>
        </form>
      </div>
    </PortalLayout>
  );
};

export default AdminPricing;
