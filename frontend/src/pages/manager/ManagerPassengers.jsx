import React, { useState, useEffect } from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const ManagerPassengers = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${config.serverURL}/manager/passengers`, getAuthHeaders());
        setPassengers(res.data?.data || []);
      } catch (e) { /* empty data handled gracefully */ }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = passengers
    .filter(p => statusFilter === 'ALL' || p.bookingStatus === statusFilter)
    .filter(p => [p.firstName, p.lastName, p.bookingReference, p.flightNumber].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  const statusColor = { CONFIRMED: 'bg-success', PENDING: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Passengers</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>All passengers on flights at your airport</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <FaUsers className="text-primary" />
          <span className="badge bg-primary" style={{ fontSize: '0.85rem', borderRadius: 8, padding: '8px 16px' }}>{filtered.length} passengers</span>
        </div>
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Search by name, booking ref, or flight..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Name</th><th>Gender</th><th>Seat</th><th>Booking Ref</th><th>Flight</th><th>Route</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted py-5">No passengers found.</td></tr>
              ) : filtered.map((p, i) => (
                <tr key={i}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{p.firstName} {p.lastName}</td>
                  <td>{p.gender}</td>
                  <td>{p.seatNumber || '-'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{p.bookingReference}</td>
                  <td>{p.flightNumber}</td>
                  <td>{p.route}</td>
                  <td>{p.journeyDate}</td>
                  <td><span className={`badge ${statusColor[p.bookingStatus] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{p.bookingStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerPassengers;
