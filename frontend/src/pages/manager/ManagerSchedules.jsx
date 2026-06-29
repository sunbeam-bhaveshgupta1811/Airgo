import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaBan, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';
import { getManagerFlights } from '../../services/manager/managerService';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}`, 'Content-Type': 'application/json' } });

const ManagerSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ flightId: '', journeyDate: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' });

  const fetchData = async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        axios.get(`${config.serverURL}/manager/schedules`, getAuthHeaders()),
        getManagerFlights()
      ]);
      setSchedules(sRes.data?.data || []);
      setFlights(fRes);
    } catch (e) { /* empty data handled gracefully */ } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, flightId: parseInt(form.flightId), price: parseFloat(form.price), totalSeats: parseInt(form.totalSeats) };
      if (editing) {
        await axios.put(`${config.serverURL}/manager/schedules/${editing.id}`, payload, getAuthHeaders());
        toast.success('Schedule updated');
      } else {
        await axios.post(`${config.serverURL}/manager/schedules`, payload, getAuthHeaders());
        toast.success('Schedule added');
      }
      setShowForm(false); setEditing(null); setForm({ flightId: '', journeyDate: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' }); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setForm({ flightId: s.flightId.toString(), journeyDate: s.journeyDate, departureTime: s.departureTime, arrivalTime: s.arrivalTime, price: s.price.toString(), totalSeats: s.totalSeats.toString() });
    setShowForm(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      if (status === 'CANCEL') {
        await axios.patch(`${config.serverURL}/manager/schedules/${id}/cancel`, {}, getAuthHeaders());
      } else {
        await axios.patch(`${config.serverURL}/manager/schedules/${id}/status?status=${status}`, {}, getAuthHeaders());
      }
      toast.success('Status updated');
      fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const statusColor = { SCHEDULED: 'bg-success', DELAYED: 'bg-warning text-dark', CANCELLED: 'bg-danger', COMPLETED: 'bg-info' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Flight Schedules</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Schedule flights with date, time, price and seats</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }}
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ flightId: '', journeyDate: '', departureTime: '', arrivalTime: '', price: '', totalSeats: '' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Schedule'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Schedule' : 'New Schedule'}</h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Flight</label>
                  <select className="form-select" value={form.flightId} onChange={(e) => setForm({ ...form, flightId: e.target.value })} required>
                    <option value="">Select Flight</option>
                    {flights.filter(f => f.status === 'ACTIVE').map(f => <option key={f.id} value={f.id}>{f.flightNumber} — {f.originCity} → {f.destinationCity}</option>)}
                  </select>
                </div>
                <div className="col-md-2"><label className="form-label small fw-semibold">Journey Date</label><input type="date" className="form-control" value={form.journeyDate} onChange={(e) => setForm({ ...form, journeyDate: e.target.value })} min={new Date().toISOString().split('T')[0]} required /></div>
                <div className="col-md-2"><label className="form-label small fw-semibold">Departure</label><input type="time" className="form-control" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} required /></div>
                <div className="col-md-2"><label className="form-label small fw-semibold">Arrival</label><input type="time" className="form-control" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} required /></div>
                <div className="col-md-2"><label className="form-label small fw-semibold">Price (₹)</label><input type="number" className="form-control" placeholder="4500" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div className="col-md-2"><label className="form-label small fw-semibold">Total Seats</label><input type="number" className="form-control" placeholder="180" min="1" max="500" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} required /></div>
                <div className="col-12"><button type="submit" className="btn btn-success px-4" style={{ borderRadius: 8 }}>{editing ? 'Update Schedule' : 'Add Schedule'}</button></div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Flight</th><th>Route</th><th>Date</th><th>Time</th><th>Price</th><th>Seats</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr><td colSpan="9" className="text-center text-muted py-5">No schedules yet.</td></tr>
              ) : schedules.map((s, i) => (
                <tr key={s.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{s.flightNumber}</td>
                  <td>{s.originCity} → {s.destinationCity}</td>
                  <td>{s.journeyDate}</td>
                  <td>{s.departureTime} - {s.arrivalTime}</td>
                  <td>₹{Number(s.price).toLocaleString()}</td>
                  <td>{s.availableSeats}/{s.totalSeats}</td>
                  <td><span className={`badge ${statusColor[s.status] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{s.status}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      {s.status === 'SCHEDULED' && (
                        <>
                          <button className="btn btn-sm btn-outline-primary" style={{ borderRadius: 6 }} onClick={() => handleEdit(s)} title="Edit"><FaEdit size={12} /></button>
                          <button className="btn btn-sm btn-outline-warning" style={{ borderRadius: 6 }} onClick={() => handleStatusChange(s.id, 'DELAYED')} title="Mark Delayed"><FaClock size={12} /></button>
                          <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6 }} onClick={() => handleStatusChange(s.id, 'CANCEL')} title="Cancel"><FaBan size={12} /></button>
                        </>
                      )}
                      {s.status === 'DELAYED' && (
                        <>
                          <button className="btn btn-sm btn-outline-success" style={{ borderRadius: 6 }} onClick={() => handleStatusChange(s.id, 'SCHEDULED')} title="Reschedule">Reschedule</button>
                          <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6 }} onClick={() => handleStatusChange(s.id, 'CANCEL')} title="Cancel"><FaBan size={12} /></button>
                        </>
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

export default ManagerSchedules;
