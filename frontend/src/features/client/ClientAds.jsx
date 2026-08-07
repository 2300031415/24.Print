import React, { useEffect, useState } from 'react';
import { Tv, Upload, Plus, CheckCircle, Clock } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const ClientAds = () => {
  const [ads, setAds] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchAds = async () => {
    try {
      const res = await api.get('/ads');
      if (res.data.success) setAds(res.data.ads);
    } catch (err) {
      console.error('Error loading ads:', err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', title);
    formData.append('duration_seconds', 10);

    try {
      const res = await api.post('/ads/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setTitle('');
        setFile(null);
        fetchAds();
        alert('Advertisement uploaded successfully! Pending Admin approval.');
      }
    } catch (err) {
      alert('Failed to upload ad media.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <PortalLayout title="Promotional Advertisement Management" role="client">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* UPLOAD FORM */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
          <h3 className="text-xl font-bold text-white font-heading mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-cyan-400" />
            <span>Upload Promotional Ad</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">Upload Images, Videos, or GIFs to display on kiosk screens.</p>

          <form onSubmit={handleUploadAd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Ad Title / Campaign Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                placeholder="e.g. 20% Discount for Students"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Media File (JPG, PNG, GIF, MP4)</label>
              <input
                type="file"
                required
                accept="image/*,video/mp4"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-cyan-glow btn-touch text-sm"
            >
              {uploading ? 'Uploading...' : 'Submit for Approval'}
            </button>
          </form>
        </div>

        {/* ADS LIST */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xl font-bold text-white font-heading">Submitted Advertisements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div key={ad.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  {ad.media_type === 'video' ? (
                    <video src={ad.media_url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={ad.media_url} alt={ad.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{ad.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">Duration: {ad.duration_seconds}s</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    ad.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    ad.status === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ad.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ClientAds;
