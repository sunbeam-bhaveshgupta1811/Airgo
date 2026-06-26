import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getMyGates, getMyTerminals, addGate, updateGate, deactivateGate, reactivateGate } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const GateManagement = () => {
  const [gates, setGates] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGate, setEditingGate] = useState(null);
  const [form, setForm] = useState({ gateNumber: '', terminalId: '', status: 'AVAILABLE' });

  const fetchData = async () => {
    try { const [g, t] = await Promise.all([getMyGates(), getMyTerminals()]); setGates(g); setTerminals(t); } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, terminalId: parseInt(form.terminalId) };
      if (editingGate) { await updateGate(editingGate.id, payload); toast.success('Gate updated'); } else { await addGate(payload); toast.success('Gate added'); }
      setShowForm(false); setEditingGate(null); setForm({ gateNumber: '', terminalId: '', status: 'AVAILABLE' }); fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const handleEdit = (g) => { setEditingGate(g); setForm({ gateNumber: g.gateNumber, terminalId: g.terminalId.toString(), status: g.status }); setShowForm(true); };
  const handleToggle = async (g) => { try { if (g.active) { await deactivateGate(g.id); } else { await reactivateGate(g.id); } toast.success(g.active ? 'Deactivated' : 'Reactivated'); fetchData(); } catch (e) { toast.error(e.message); } };

  const statusColor = { AVAILABLE: 'bg-success', OCCUPIED: 'bg-warning text-dark', MAINTENANCE: 'bg-danger' };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Gate Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Manage gates across your terminals</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }} onClick={() => { setShowForm(!showForm); setEditingGate(null); setForm({ gateNumber: '', terminalId: '', status: 'AVAILABLE' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Gate'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editingGate ? 'Edit Gate' : 'New Gate'}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3"><label className="form-label small fw-semibold">Gate Number</label><input type="text" className="form-control" placeholder="e.g. G1" value={form.gateNumber} onChange={(e) => setForm({ ...form, gateNumber: e.target.value })} required /></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Terminal</label><select className="form-select" value={form.terminalId} onChange={(e) => setForm({ ...form, terminalId: e.target.value })} required><option value="">Select</option>{terminals.map(t => <option key={t.id} value={t.id}>{t.terminalCode} - {t.name}</option>)}</select></div>
              <div className="col-md-3"><label className="form-label small fw-semibold">Status</label><select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="AVAILABLE">Available</option><option value="OCCUPIED">Occupied</option><option value="MAINTENANCE">Maintenance</option></select></div>
              <div className="col-md-3 d-flex align-items-end"><button type="submit" className="btn btn-success w-100" style={{ borderRadius: 8 }}>{editingGate ? 'Update' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Gate</th><th>Terminal</th><th>Status</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {gates.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5">No gates yet.</td></tr>
              ) : gates.map((g, i) => (
                <tr key={g.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td><span className="fw-semibold">{g.gateNumber}</span></td>
                  <td>{g.terminalCode}</td>
                  <td><span className={`badge ${statusColor[g.status] || 'bg-secondary'}`} style={{ borderRadius: 6, fontWeight: 500 }}>{g.status}</span></td>
                  <td><span className={`badge ${g.active ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{g.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" style={{ borderRadius: 6 }} onClick={() => handleEdit(g)}><FaEdit size={13} /></button>
                    <button className={`btn btn-sm ${g.active ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ borderRadius: 6 }} onClick={() => handleToggle(g)}>{g.active ? <FaToggleOff size={13} /> : <FaToggleOn size={13} />}</button>
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

export default GateManagement;
