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
      <div className="w-full max-w-7xl mx-auto space-y-8 select-none font-sans">
        <div className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl space-y-6">
          <h3 className="text-2xl font-black text-slate-950 font-heading flex items-center gap-3 border-b border-blue-100 pb-4">
            <Percent className="w-7 h-7 text-blue-600" />
            <span>Active GST Rate Setup</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Tax Display Label</label>
              <input
                type="text"
                required
                value={formData.tax_name}
                onChange={(e) => setFormData({ ...formData, tax_name: e.target.value })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-base font-black text-slate-950 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-blue-700 uppercase tracking-wider block mb-2">Total GST Percentage (%)</label>
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
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3.5 text-xl font-black text-emerald-600 font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider block">CGST Share</span>
                <span className="text-lg font-black text-slate-950">{formData.cgst_percentage}%</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider block">SGST Share</span>
                <span className="text-lg font-black text-slate-950">{formData.sgst_percentage}%</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-xl transition-all shadow-blue-glow btn-touch flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5 text-white" />
                <span>Update GST Rate</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientGst;
