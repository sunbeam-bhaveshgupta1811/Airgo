import React, { useState, useEffect } from 'react';
import { FaBuilding, FaDoorOpen, FaPlane, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { getManagerDashboardStats } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getManagerDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  );

  const airportInfo = stats.airportInfo || {};

  const cards = [
    { icon: FaBuilding, label: 'Terminals', value: stats.terminalCount || 0, color: '#3b82f6', bg: '#eff6ff' },
    { icon: FaDoorOpen, label: 'Gates', value: stats.gateCount || 0, color: '#10b981', bg: '#ecfdf5' },
    { icon: FaPlane, label: 'Status', value: airportInfo.active ? 'Active' : 'Inactive', color: airportInfo.active ? '#10b981' : '#ef4444', bg: airportInfo.active ? '#ecfdf5' : '#fef2f2' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Airport Dashboard</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Manage your airport operations</p>
        </div>
      </div>

      {airportInfo.name && (
        <div className="card border-0 mb-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 12 }}>
          <div className="card-body d-flex align-items-center p-4">
            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)' }}>
              <FaMapMarkerAlt size={24} className="text-white" />
            </div>
            <div className="text-white">
              <h5 className="fw-bold mb-1">{airportInfo.name} ({airportInfo.code})</h5>
              <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>{airportInfo.city}, {airportInfo.country}</span>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        {cards.map((card, i) => (
          <div className="col-md-4" key={i}>
            <div className="card border-0 h-100" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div className="card-body d-flex align-items-center p-4">
                <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 52, height: 52, background: card.bg }}>
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{card.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>{card.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
