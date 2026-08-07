import React, { useEffect, useState } from 'react';
import { Tv, CheckCircle, XCircle, Clock, Video, Image as ImageIcon } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads');
      if (res.data.success) setAds(res.data.ads);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const res = await api.put(`/ads/${id}/status`, { status, rejection_reason: reason });
      if (res.data.success) fetchAds();
    } catch (err) {
      alert('Failed to update ad status.');
    }
  };

  return (
    <PortalLayout title="Advertisements Review & Approval" role="admin">
      <div className="space-y-6">
        <p className="text-slate-400 text-sm">Review client-submitted promotional images, videos, and GIFs before broadcasting to kiosks.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                  {ad.media_type === 'video' ? (
                    <video src={ad.media_url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={ad.media_url} alt={ad.title} className="w-full h-full object-cover" />
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-xs font-bold rounded-lg uppercase">
                    {ad.media_type}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white">{ad.title}</h4>
                <p className="text-xs text-slate-400 mt-1">Submitted by: <span className="text-white font-semibold">{ad.client_name || 'System Admin'}</span></p>
                <p className="text-xs text-slate-400">Duration: <span className="text-cyan-400 font-bold">{ad.duration_seconds || 10} seconds</span></p>
              </div>

              {/* Status & Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ad.status === 'approved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                    ad.status === 'rejected' ? 'bg-rose-950/80 text-rose-400 border border-rose-800' :
                    'bg-amber-950/80 text-amber-400 border border-amber-800'
                  }`}>
                    {ad.status}
                  </span>
                </div>

                {ad.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusUpdate(ad.id, 'approved')}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 btn-touch"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(ad.id, 'rejected', 'Violates policy')}
                      className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 btn-touch"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminAds;
