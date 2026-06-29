import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getManagerBookings } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { (async () => { try { setBookings(await getManagerBookings()); } catch (e) { /* empty data */ } finally { setLoading(false); } })(); }, []);

  const filtered = bookings.filter(b => [b.bookingReference, b.userName, b.flightNumber].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));
  const statusColor = { CONFIRMED: 'bg-success', PENDING: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Airport Bookings</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Bookings for flights at your airport</p></div>
        <span className="badge bg-primary" style={{ fontSize: '0.85rem', borderRadius: 8, padding: '8px 16px' }}>{filtered.length} bookings</span>
      </div>

      <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
            <input type="text" className="form-control border-start-0" placeholder="Search by reference, passenger, or flight..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Reference</th><th>Flight</th><th>Route</th><th>Date</th><th>Pax</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted py-5">No bookings found.</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td><span className="fw-semibold" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{b.bookingReference}</span></td>
                  <td>{b.flightNumber}</td>
                  <td>{b.originCity} → {b.destinationCity}</td>
                  <td>{b.journeyDate}</td>
                  <td>{b.numberOfPassengers}</td>
                  <td className="fw-semibold">₹{b.totalAmount?.toLocaleString()}</td>
                  <td><span className={`badge ${statusColor[b.status] || 'bg-secondary'}`} style={{ borderRadius: 6, fontWeight: 500 }}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerBookings;
