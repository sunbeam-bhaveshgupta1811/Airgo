import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getManagerFlights, addManagerFlight, updateManagerFlight, deactivateManagerFlight, reactivateManagerFlight, getManagerAirlines } from '../../services/manager/managerService';
import { fetchAirports } from '../../services/customer/flightSearchService';
import { toast } from 'react-toastify';

const ManagerFlights = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ flightNumber: '', airlineId: '', originAirportId: '', destinationAirportId: '', durationMinutes: '' });

  const fetchData = async () => {
    try {
      const [f, a, ap] = await Promise.all([getManagerFlights(), getManagerAirlines(), fetchAirports()]);
      setFlights(f); setAirlines(a); setAirports(ap);
    } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, airlineId: parseInt(form.airlineId), originAirportId: parseInt(form.originAirportId), destinationAirportId: parseInt(form.destinationAirportId), durationMinutes: parseInt(form.durationMinutes) };
    try {
      if (editing) { await updateManagerFlight(editing.id, payload); toast.success('Flight updated'); }
      else { await addManagerFlight(payload); toast.success('Flight added'); }
      setShowForm(false); setEditing(null); setForm({ flightNumber: '', airlineId: '', originAirportId: '', destinationAirportId: '', durationMinutes: '' }); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleEdit = (f) => { setEditing(f); setForm({ flightNumber: f.flightNumber, airlineId: '', originAirportId: '', destinationAirportId: '', durationMinutes: f.durationMinutes || '' }); setShowForm(true); };

  const handleToggle = async (f) => {
    try {
      if (f.status === 'ACTIVE') { await deactivateManagerFlight(f.id); } else { await reactivateManagerFlight(f.id); }
      toast.success(f.status === 'ACTIVE' ? 'Deactivated' : 'Reactivated'); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Flight Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Create and manage flights at your airport</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }}
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ flightNumber: '', airlineId: '', originAirportId: '', destinationAirportId: '', durationMinutes: '' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Flight'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Flight' : 'New Flight'}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2"><label className="form-label small fw-semibold">Flight Number</label><input type="text" className="form-control" placeholder="6E-204" value={form.flightNumber} onChange={(e) => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">Airline</label><select className="form-select" value={form.airlineId} onChange={(e) => setForm({ ...form, airlineId: e.target.value })} required><option value="">Select</option>{airlines.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}</select></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Origin Airport</label><select className="form-select" value={form.originAirportId} onChange={(e) => setForm({ ...form, originAirportId: e.target.value })} required><option value="">Select</option>{airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}</select></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Destination Airport</label><select className="form-select" value={form.destinationAirportId} onChange={(e) => setForm({ ...form, destinationAirportId: e.target.value })} required><option value="">Select</option>{airports.map(a => <option key={a.id} value={a.id}>{a.city} ({a.code})</option>)}</select></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">Duration (min)</label><input type="number" className="form-control" placeholder="135" min="30" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} required /></div>
              <div className="col-12"><button type="submit" className="btn btn-success px-4" style={{ borderRadius: 8 }}>{editing ? 'Update Flight' : 'Add Flight'}</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Flight</th><th>Airline</th><th>Route</th><th>Duration</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {flights.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-5">No flights yet. Click "Add Flight" to create one.</td></tr>
              ) : flights.map((f, i) => (
                <tr key={f.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{f.flightNumber}</td>
                  <td>{f.airlineName} <span className="text-muted">({f.airlineCode})</span></td>
                  <td>{f.originCity} ({f.originAirportCode}) → {f.destinationCity} ({f.destinationAirportCode})</td>
                  <td>{f.durationMinutes ? `${Math.floor(f.durationMinutes/60)}h ${f.durationMinutes%60}m` : '-'}</td>
                  <td><span className={`badge ${f.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{f.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" style={{ borderRadius: 6 }} onClick={() => handleEdit(f)}><FaEdit size={13} /></button>
                    <button className={`btn btn-sm ${f.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ borderRadius: 6 }} onClick={() => handleToggle(f)}>{f.status === 'ACTIVE' ? <FaToggleOff size={13} /> : <FaToggleOn size={13} />}</button>
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

export default ManagerFlights;
