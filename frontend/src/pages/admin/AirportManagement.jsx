import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaSearch, FaUserTie, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}`, 'Content-Type': 'application/json' } });

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ code: '', name: '', city: '', country: '', timezone: '' });

  const fetchData = async () => {
    try {
      const [aRes, mRes] = await Promise.all([
        axios.get(`${config.serverURL}/admin/airports`, getAuthHeaders()),
        axios.get(`${config.serverURL}/admin/managers`, getAuthHeaders())
      ]);
      setAirports(aRes.data?.data || []);
      setManagers((mRes.data?.data || []).filter(m => m.approvalStatus === 'APPROVED'));
    } catch (e) { toast.error('Failed to load data'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${config.serverURL}/admin/airports/${editing.id}`, form, getAuthHeaders());
        toast.success('Airport updated');
      } else {
        await axios.post(`${config.serverURL}/admin/airports`, form, getAuthHeaders());
        toast.success('Airport added');
      }
      setShowForm(false); setEditing(null); setForm({ code: '', name: '', city: '', country: '', timezone: '' }); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (a) => { setEditing(a); setForm({ code: a.code, name: a.name, city: a.city, country: a.country, timezone: a.timezone || '' }); setShowForm(true); };

  const handleToggle = async (a) => {
    try {
      await axios.patch(`${config.serverURL}/admin/airports/${a.id}/${a.active ? 'deactivate' : 'reactivate'}`, {}, getAuthHeaders());
      toast.success(a.active ? 'Deactivated' : 'Activated'); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleAssignManager = async (airportId, managerId) => {
    try {
      await axios.patch(`${config.serverURL}/admin/airports/${airportId}/assign-manager/${managerId}`, {}, getAuthHeaders());
      toast.success('Manager assigned'); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to assign'); }
  };

  const handleUnassignManager = async (airportId) => {
    try {
      await axios.patch(`${config.serverURL}/admin/airports/${airportId}/unassign-manager`, {}, getAuthHeaders());
      toast.success('Manager unassigned'); fetchData();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const getAvailableManagers = (currentAirportId) => {
    const assignedManagerIds = airports.filter(a => a.managerId && a.id !== currentAirportId).map(a => a.managerId);
    return managers.filter(m => !assignedManagerIds.includes(m.id));
  };

  const filtered = airports.filter(a => [a.code, a.name, a.city, a.country].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1">Airport Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Create airports and assign managers</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }}
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ code: '', name: '', city: '', country: '', timezone: '' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Airport'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editing ? 'Edit Airport' : 'New Airport'}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-2"><label className="form-label small fw-semibold">IATA Code</label><input type="text" className="form-control" placeholder="DEL" maxLength={3} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required /></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Airport Name</label><input type="text" className="form-control" placeholder="Indira Gandhi International" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">City</label><input type="text" className="form-control" placeholder="New Delhi" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">Country</label><input type="text" className="form-control" placeholder="India" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required /></div>
              <div className="col-md-2"><label className="form-label small fw-semibold">Timezone</label><input type="text" className="form-control" placeholder="Asia/Kolkata" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} /></div>
              <div className="col-md-1 d-flex align-items-end"><button type="submit" className="btn btn-success w-100" style={{ borderRadius: 8 }}>{editing ? 'Save' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
          <input type="text" className="form-control border-start-0" placeholder="Search airports..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Code</th><th>Name</th><th>City</th><th>Country</th><th>Manager</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted py-5">No airports found.</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td><span className="badge bg-primary" style={{ borderRadius: 6 }}>{a.code}</span></td>
                  <td className="fw-semibold">{a.name}</td>
                  <td>{a.city}</td>
                  <td>{a.country}</td>
                  <td>
                    {a.managerId ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="d-flex align-items-center gap-1">
                          <FaUserTie size={12} className="text-success" />
                          <span style={{ fontSize: '0.85rem' }}>{a.managerName}</span>
                        </span>
                        <button className="btn btn-sm btn-outline-danger p-0 px-1" style={{ borderRadius: 4, fontSize: '0.7rem' }}
                          onClick={() => handleUnassignManager(a.id)} title="Unassign"><FaTimes size={10} /></button>
                      </div>
                    ) : (
                      <select className="form-select form-select-sm" style={{ maxWidth: 200, borderRadius: 6, fontSize: '0.82rem' }}
                        value="" onChange={(e) => { if (e.target.value) handleAssignManager(a.id, parseInt(e.target.value)); }}>
                        <option value="">Assign Manager...</option>
                        {getAvailableManagers(a.id).map(m => (
                          <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td><span className={`badge ${a.active ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{a.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <Link to={`/admin/airports/${a.id}/history`} className="btn btn-sm btn-outline-info me-1" style={{ borderRadius: 6 }} title="View History">
                      <FaSearch size={13} />
                    </Link>
                    <button className="btn btn-sm btn-outline-primary me-1" style={{ borderRadius: 6 }} onClick={() => handleEdit(a)}><FaEdit size={13} /></button>
                    <button className={`btn btn-sm ${a.active ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ borderRadius: 6 }} onClick={() => handleToggle(a)}>
                      {a.active ? <FaToggleOff size={13} /> : <FaToggleOn size={13} />}
                    </button>
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

export default AirportManagement;
