import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${config.serverURL}/admin/bookings`, getAuthHeaders());
      setBookings(res.data?.data || []);
    } catch (e) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.patch(`${config.serverURL}/admin/bookings/${id}/cancel`, {}, getAuthHeaders());
      toast.success('Booking cancelled'); fetchBookings();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const filtered = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b => [b.bookingReference, b.userName, b.flightNumber, b.originCity, b.destinationCity].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  const statusColor = { CONFIRMED: 'bg-success', PENDING: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    revenue: bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + Number(b.totalAmount || 0), 0)
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">Booking Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>View and manage all system bookings</p></div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { label: 'Total', value: stats.total, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Confirmed', value: stats.confirmed, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Cancelled', value: stats.cancelled, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Revenue', value: '\u20B9' + stats.revenue.toLocaleString(), color: '#8b5cf6', bg: '#f5f3ff' },
        ].map((s, i) => (
          <div className="col" key={i}>
            <div className="card border-0 text-center p-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div className="fw-bold fs-5" style={{ color: s.color }}>{s.value}</div>
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
              <input type="text" className="form-control border-start-0" placeholder="Search by reference, user, flight, or city..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
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
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Reference</th><th>User</th><th>Flight</th><th>Route</th><th>Date</th><th>Pax</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="10" className="text-center text-muted py-5">No bookings found.</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.bookingReference}</td>
                  <td className="fw-semibold">{b.userName}</td>
                  <td>{b.flightNumber}</td>
                  <td>{b.originCity} &rarr; {b.destinationCity}</td>
                  <td>{b.journeyDate}</td>
                  <td>{b.numberOfPassengers}</td>
                  <td className="fw-semibold">&#8377;{Number(b.totalAmount || 0).toLocaleString()}</td>
                  <td><span className={`badge ${statusColor[b.status] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{b.status}</span></td>
                  <td>
                    {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                      <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6 }} onClick={() => handleCancel(b.id)} title="Cancel"><FaTimes size={12} /></button>
                    )}
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

export default BookingManagement;
