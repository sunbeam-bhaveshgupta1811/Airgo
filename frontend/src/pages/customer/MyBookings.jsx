import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaTimes, FaPlane, FaTicketAlt, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';
import { useNavigate } from 'react-router-dom';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [payingId, setPayingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${config.serverURL}/bookings/my`, getAuthHeaders());
      setBookings(res.data?.data || []);
    } catch (e) { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.patch(`${config.serverURL}/bookings/${id}/cancel`, {}, getAuthHeaders());
      toast.success('Booking cancelled'); fetchBookings();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to cancel'); }
  };

  const handlePayNow = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const res = await axios.post(`${config.serverURL}/payments`, {
        bookingId,
        paymentMethod: 'CREDIT_CARD'
      }, getAuthHeaders());
      const payment = res.data?.data;
      if (payment?.status === 'SUCCESS') {
        toast.success('Payment successful! Booking confirmed.');
        fetchBookings();
      } else {
        toast.error('Payment was declined. Please try again.');
        fetchBookings();
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  const handleDownload = async (id, ref) => {
    try {
      const res = await axios.get(`${config.serverURL}/bookings/${id}/pdf`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.download = `ticket-${ref}.pdf`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); window.URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download ticket'); }
  };

  const filtered = bookings
    .filter(b => filter === 'ALL' || b.status === filter)
    .filter(b => [b.bookingReference, b.flightNumber, b.originCity, b.destinationCity].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  const statusColor = { CONFIRMED: 'bg-success', PENDING: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>My Bookings</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>View and manage your flight bookings</p>
        </div>
        <span className="badge bg-primary" style={{ fontSize: '0.85rem', borderRadius: 8, padding: '8px 16px' }}>{filtered.length} bookings</span>
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Search by reference, flight, or city..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="ALL">All Bookings</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card border-0 text-center py-5" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <FaTicketAlt size={40} className="text-muted mb-3" />
          <h5 className="text-muted">No bookings found</h5>
          <p className="text-muted">Your booking history will appear here.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(b => (
            <div key={b.id} className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: '#eff6ff' }}>
                      <FaPlane size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="fw-bold">{b.flightNumber}</span>
                        <span className="text-muted">&bull;</span>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>{b.airlineName}</span>
                      </div>
                      <div className="fw-semibold">{b.originCity} ({b.originCode}) &rarr; {b.destinationCity} ({b.destinationCode})</div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>{b.journeyDate} &bull; {b.departureTime} - {b.arrivalTime} &bull; {b.numberOfPassengers} passenger(s)</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold fs-5 mb-1">&#8377;{Number(b.totalAmount || 0).toLocaleString()}</div>
                    <span className={`badge ${statusColor[b.status] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{b.status}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                  <span className="text-muted" style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}>{b.bookingReference}</span>
                  <div className="d-flex gap-2">
                    {b.status === 'CONFIRMED' && (
                      <>
                        <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" style={{ borderRadius: 6 }}
                          onClick={() => handleDownload(b.id, b.bookingReference)}><FaDownload size={12} /> Download Ticket</button>
                        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" style={{ borderRadius: 6 }}
                          onClick={() => handleCancel(b.id)}><FaTimes size={12} /> Cancel</button>
                      </>
                    )}
                    {b.status === 'PENDING' && (
                      <>
                        <button className="btn btn-sm btn-success d-flex align-items-center gap-1" style={{ borderRadius: 6 }}
                          disabled={payingId === b.id}
                          onClick={() => handlePayNow(b.id)}>
                          <FaCreditCard size={12} /> {payingId === b.id ? 'Processing...' : 'Pay Now'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" style={{ borderRadius: 6 }}
                          onClick={() => handleCancel(b.id)}><FaTimes size={12} /> Cancel</button>
                      </>
                    )}
                    {b.status === 'COMPLETED' && (
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" style={{ borderRadius: 6 }}
                        onClick={() => handleDownload(b.id, b.bookingReference)}><FaDownload size={12} /> Download Ticket</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
