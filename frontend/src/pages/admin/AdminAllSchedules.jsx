import React, { useState, useEffect } from 'react';
import { FaSearch, FaBan, FaClock, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const AdminAllSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${config.serverURL}/admin/schedules`, getAuthHeaders());
      setSchedules(res.data?.data || []);
    } catch (e) { toast.error('Failed to load schedules'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchSchedules(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      if (status === 'CANCEL') {
        await axios.patch(`${config.serverURL}/admin/schedules/${id}/cancel`, {}, getAuthHeaders());
      } else {
        await axios.patch(`${config.serverURL}/admin/schedules/${id}/status?status=${status}`, {}, getAuthHeaders());
      }
      toast.success('Status updated'); fetchSchedules();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const filtered = schedules
    .filter(s => statusFilter === 'ALL' || s.status === statusFilter)
    .filter(s => [s.flightNumber, s.airlineName, s.originCity, s.destinationCity, s.originAirportCode, s.destinationAirportCode]
      .some(v => (v || '').toLowerCase().includes(search.toLowerCase())));

  const statusColor = { SCHEDULED: 'bg-success', DELAYED: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  const stats = {
    total: schedules.length,
    scheduled: schedules.filter(s => s.status === 'SCHEDULED').length,
    delayed: schedules.filter(s => s.status === 'DELAYED').length,
    cancelled: schedules.filter(s => s.status === 'CANCELLED').length,
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">All Schedules</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Global view of all flight schedules (override control)</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total', value: stats.total, color: '#3b82f6' },
          { label: 'Scheduled', value: stats.scheduled, color: '#10b981' },
          { label: 'Delayed', value: stats.delayed, color: '#f59e0b' },
          { label: 'Cancelled', value: stats.cancelled, color: '#ef4444' },
        ].map((s, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 text-center p-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div className="fw-bold fs-4" style={{ color: s.color }}>{s.value}</div>
              <div className="text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Search by flight, airline, or city..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="DELAYED">Delayed</option>
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
            <thead><tr style={{ background: '#f8fafc' }}>
              <th className="ps-4">#</th><th>Flight</th><th>Airline</th><th>Route</th><th>Date</th><th>Time</th><th>Price</th><th>Seats</th><th>Status</th><th>Override</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="10" className="text-center text-muted py-5">No schedules found.</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{s.flightNumber}</td>
                  <td>{s.airlineName}</td>
                  <td>{s.originCity} → {s.destinationCity}</td>
                  <td>{s.journeyDate}</td>
                  <td>{s.departureTime} - {s.arrivalTime}</td>
                  <td>₹{Number(s.price || 0).toLocaleString()}</td>
                  <td>{s.availableSeats}/{s.totalSeats}</td>
                  <td><span className={`badge ${statusColor[s.status] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{s.status}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      {s.status === 'SCHEDULED' && (
                        <>
                          <button className="btn btn-sm btn-outline-warning" style={{ borderRadius: 6, fontSize: '0.75rem' }} onClick={() => handleStatusChange(s.id, 'DELAYED')} title="Mark Delayed"><FaClock size={11} className="me-1" />Delay</button>
                          <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6, fontSize: '0.75rem' }} onClick={() => handleStatusChange(s.id, 'CANCEL')} title="Cancel"><FaBan size={11} className="me-1" />Cancel</button>
                        </>
                      )}
                      {s.status === 'DELAYED' && (
                        <>
                          <button className="btn btn-sm btn-outline-success" style={{ borderRadius: 6, fontSize: '0.75rem' }} onClick={() => handleStatusChange(s.id, 'SCHEDULED')} title="Reschedule"><FaCheckCircle size={11} className="me-1" />Reschedule</button>
                          <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6, fontSize: '0.75rem' }} onClick={() => handleStatusChange(s.id, 'CANCEL')} title="Cancel"><FaBan size={11} className="me-1" />Cancel</button>
                        </>
                      )}
                      {s.status === 'CANCELLED' && (
                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>No actions</span>
                      )}
                      {s.status === 'COMPLETED' && (
                        <span className="text-muted" style={{ fontSize: '0.78rem' }}>Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAllSchedules;
