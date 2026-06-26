import React, { useState, useEffect } from 'react';
import { FaBuilding, FaDoorOpen, FaPlane, FaMapMarkerAlt } from 'react-icons/fa';
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

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  const airportInfo = stats.airportInfo || {};

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Airport Manager Dashboard</h2>

      {airportInfo && (
        <div className="alert alert-info d-flex align-items-center mb-4">
          <FaMapMarkerAlt className="me-2" size={20} />
          <span>
            <strong>Your Airport:</strong> {airportInfo.name} ({airportInfo.code}) — {airportInfo.city}, {airportInfo.country}
          </span>
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaBuilding size={40} className="text-primary mb-3" />
              <h3 className="fw-bold">{stats.terminalCount || 0}</h3>
              <p className="text-muted">Terminals</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaDoorOpen size={40} className="text-success mb-3" />
              <h3 className="fw-bold">{stats.gateCount || 0}</h3>
              <p className="text-muted">Gates</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <FaPlane size={40} className="text-warning mb-3" />
              <h3 className="fw-bold">{airportInfo.active ? 'Active' : 'Inactive'}</h3>
              <p className="text-muted">Airport Status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
