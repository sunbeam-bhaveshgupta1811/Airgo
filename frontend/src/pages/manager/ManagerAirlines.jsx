import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { getManagerAirlines, addManagerAirline, updateManagerAirline } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const ManagerAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', country: '', contactEmail: '', contactPhone: '' });

  const fetchAirlines = async () => {
    try { setAirlines(await getManagerAirlines()); } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAirlines(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateManagerAirline(editing.id, form); toast.success('Airline updated'); }
      else { await addManagerAirline(form); toast.success('Airline added'); }
      setShowForm(false); setEditing(null); setForm({ name: '', code: '', country: '', contactEmail: '', contactPhone: '' }); fetchAirlines();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleEdit = (a) => { setEditing(a); setForm({ name: a.name, code: a.code, country: a.country, contactEmail: a.contactEmail || '', contactPhone: a.contactPhone || '' }); setShowForm(true); };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Airline Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Register and manage airlines</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }}
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', code: '', country: '', contactEmail: '', contactPhone: '' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Airline'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Airline' : 'New Airline'}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3"><label className="form-label small fw-semibold">Airline Name</label><input type="text" className="form-control" placeholder="IndiGo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">IATA Code</label><input type="text" className="form-control" placeholder="6E" maxLength={3} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">Country</label><input type="text" className="form-control" placeholder="India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Contact Email</label><input type="email" className="form-control" placeholder="info@airline.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></div>
              <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-success w-100" style={{ borderRadius: 8 }}>{editing ? 'Update' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Name</th><th>Code</th><th>Country</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {airlines.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5">No airlines registered yet.</td></tr>
              ) : airlines.map((a, i) => (
                <tr key={a.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{a.name}</td>
                  <td><span className="badge bg-primary" style={{ borderRadius: 6 }}>{a.code}</span></td>
                  <td>{a.country}</td>
                  <td><span className={`badge ${a.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{a.status}</span></td>
                  <td><button className="btn btn-sm btn-outline-primary" style={{ borderRadius: 6 }} onClick={() => handleEdit(a)}><FaEdit size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerAirlines;
