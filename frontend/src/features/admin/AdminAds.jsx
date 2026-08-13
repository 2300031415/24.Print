import React, { useEffect, useState } from 'react';
import { Tv, CheckCircle, XCircle, Clock, Video, Image as ImageIcon, Filter, Plus, Upload } from 'lucide-react';

import PortalLayout from '../../components/PortalLayout';
import api from '../../services/api';

const AdminAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  
  // Quick Upload Form for Super Admin
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
    return `${backendUrl}${url}`;
  };


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

  const handleAdminUploadAd = async (e) => {
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
        setShowUploadModal(false);
        fetchAds();
        alert('Advertisement created & approved successfully!');
      }
    } catch (err) {
      alert('Failed to upload advertisement.');
    } finally {
      setUploading(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    if (activeTab === 'pending') return ad.status === 'pending';
    if (activeTab === 'approved') return ad.status === 'approved';
    if (activeTab === 'rejected') return ad.status === 'rejected';
    return true;
  });

  const pendingCount = ads.filter(a => a.status === 'pending').length;

  return (
    <PortalLayout title="Advertisements Review & Approval" role="admin">
      <div className="space-y-6">
        {/* TOP CONTROLS & FILTER TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-glow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Ads ({ads.length})
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-glow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-950 text-amber-300 text-[10px] font-extrabold rounded-full border border-amber-600">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'approved'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Approved ({ads.filter(a => a.status === 'approved').length})
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'rejected'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Rejected ({ads.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(!showUploadModal)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-cyan-glow btn-touch"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Ad</span>
          </button>
        </div>

        {/* UPLOAD FORM MODAL / PANEL */}
        {showUploadModal && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>Create System Advertisement</span>
            </h3>

            <form onSubmit={handleAdminUploadAd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Ad Title / Campaign Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  placeholder="e.g. Festival Printing Offer 30% Off"
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

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-cyan-glow btn-touch"
                >
                  {uploading ? 'Uploading...' : 'Upload & Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ADS LIST GRID */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-300">No advertisements found in this status.</h4>
            <p className="text-xs text-slate-500 mt-1">Client submitted ads will appear here for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div key={ad.id} className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                    {ad.media_type === 'video' ? (
                      <video src={getMediaUrl(ad.media_url)} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={getMediaUrl(ad.media_url)} alt={ad.title} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-xs font-bold rounded-lg uppercase">
                      {ad.media_type}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white">{ad.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted by: <span className="text-white font-semibold">{ad.client_name || 'System Admin'}</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Duration: <span className="text-cyan-400 font-bold">{ad.duration_seconds || 10} seconds</span>
                  </p>
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

                  {ad.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(ad.id, 'rejected', 'Revoked by admin')}
                      className="w-full py-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 font-bold rounded-xl text-xs border border-slate-700 transition-all"
                    >
                      Revoke Approval
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default AdminAds;
