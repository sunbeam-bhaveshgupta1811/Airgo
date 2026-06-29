import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaPlane, FaUserTie, FaTicketAlt, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const AirportHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${config.serverURL}/admin/airports/${id}/history`, getAuthHeaders());
        setData(res.data?.data || null);
      } catch (e) { toast.error('Failed to load airport history'); }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!data) return <div className="alert alert-danger m-4">Airport not found.</div>;

  const airport = data.airport || {};
  const manager = data.manager;
  const statusColor = { CONFIRMED: 'bg-success', PENDING: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/admin/airports')}><FaArrowLeft className="me-1" /> Back to Airports</button>

      {/* Airport Info Card */}
      <div className="card border-0 mb-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 14 }}>
        <div className="card-body p-4 text-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.15)' }}>
                <FaMapMarkerAlt size={26} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">{airport.name}</h4>
                <span style={{ opacity: 0.8 }}>{airport.code} — {airport.city}, {airport.country}</span>
              </div>
            </div>
            <div className="d-flex gap-4 text-center">
              <div><div className="fw-bold fs-4">{data.totalFlights}</div><small style={{ opacity: 0.7 }}>Flights</small></div>
              <div><div className="fw-bold fs-4">{data.totalBookings}</div><small style={{ opacity: 0.7 }}>Bookings</small></div>
              <div><div className="fw-bold fs-4">₹{Number(data.totalRevenue || 0).toLocaleString()}</div><small style={{ opacity: 0.7 }}>Revenue</small></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Manager Card */}
        <div className="col-md-4">
          <div className="card border-0 h-100" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaUserTie className="text-primary" /> Assigned Manager</h6>
              {manager ? (
                <div>
                  <p className="fw-semibold mb-1">{manager.name}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{manager.email}</p>
                </div>
              ) : (
                <p className="text-muted mb-0">No manager assigned</p>
              )}
            </div>
          </div>
        </div>

        {/* Flights Summary */}
        <div className="col-md-8">
          <div className="card border-0 h-100" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaPlane className="text-primary" /> Flights ({data.totalFlights})</h6>
              {(data.flights || []).length === 0 ? <p className="text-muted">No flights registered.</p> : (
                <div className="table-responsive">
                  <table className="table table-sm table-hover mb-0">
                    <thead><tr style={{ fontSize: '0.82rem' }}><th>Flight</th><th>Airline</th><th>Route</th><th>Status</th></tr></thead>
                    <tbody>
                      {(data.flights || []).map((f, i) => (
                        <tr key={i}>
                          <td className="fw-semibold">{f.flightNumber}</td>
                          <td>{f.airline}</td>
                          <td>{f.origin} → {f.destination}</td>
                          <td><span className={`badge ${f.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6, fontSize: '0.75rem' }}>{f.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaTicketAlt className="text-primary" /> Recent Bookings</h6>
          {(data.recentBookings || []).length === 0 ? <p className="text-muted">No bookings yet.</p> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead><tr style={{ background: '#f8fafc', fontSize: '0.82rem' }}><th>#</th><th>Reference</th><th>Passenger</th><th>Flight</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {(data.recentBookings || []).map((b, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.reference}</td>
                      <td>{b.passenger}</td>
                      <td>{b.flight}</td>
                      <td>{b.date}</td>
                      <td className="fw-semibold">₹{Number(b.amount || 0).toLocaleString()}</td>
                      <td><span className={`badge ${statusColor[b.status] || 'bg-secondary'}`} style={{ borderRadius: 6, fontSize: '0.75rem' }}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirportHistory;
