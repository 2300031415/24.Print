import React, { useEffect, useState } from 'react';
import { Percent, Save } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientGst = () => {
  const [formData, setFormData] = useState({
    tax_name: 'GST 18%',
    percentage: 18.00,
    cgst_percentage: 9.00,
    sgst_percentage: 9.00,
    igst_percentage: 18.00
  });

  useEffect(() => {
    const fetchGst = async () => {
      try {
        const res = await api.get('/settings/gst');
        if (res.data.success && res.data.gstList.length > 0) {
          const active = res.data.gstList[0];
          setFormData({
            tax_name: active.tax_name,
            percentage: parseFloat(active.percentage),
            cgst_percentage: parseFloat(active.cgst_percentage),
            sgst_percentage: parseFloat(active.sgst_percentage),
            igst_percentage: parseFloat(active.igst_percentage)
          });
        }
      } catch (err) {
        console.error('Error fetching GST rates:', err);
      }
    };
    fetchGst();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/settings/gst', formData);
      if (res.data.success) {
        alert('GST rate updated successfully!');
      }
    } catch (err) {
      alert('Error updating GST settings.');
    }
  };

  return (
    <PortalLayout title="GST Tax Configuration" role="client">
      <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold text-white font-heading mb-6 flex items-center gap-2">
          <Percent className="w-6 h-6 text-cyan-400" />
          <span>Active GST Rate Setup</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Tax Display Label</label>
            <input
              type="text"
              required
              value={formData.tax_name}
              onChange={(e) => setFormData({ ...formData, tax_name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Total GST Percentage (%)</label>
            <input
              type="number"
              step="0.1"
              required
              value={formData.percentage}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({
                  ...formData,
                  percentage: val,
                  cgst_percentage: val / 2,
                  sgst_percentage: val / 2,
                  igst_percentage: val
                });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-lg font-bold text-emerald-400 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">CGST Share</span>
              <span className="text-sm font-bold text-white">{formData.cgst_percentage}%</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">SGST Share</span>
              <span className="text-sm font-bold text-white">{formData.sgst_percentage}%</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-base flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" />
            <span>Update GST Rate</span>
          </button>
        </form>
      </div>
    </PortalLayout>
  );
};

export default ClientGst;
