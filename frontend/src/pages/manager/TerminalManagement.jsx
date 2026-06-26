import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { getMyTerminals, addTerminal, updateTerminal, deactivateTerminal, reactivateTerminal } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const TerminalManagement = () => {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState(null);
  const [form, setForm] = useState({ terminalCode: '', name: '' });
  const airportId = sessionStorage.getItem('airportId');

  const fetchTerminals = async () => {
    try { setTerminals(await getMyTerminals()); } catch (e) { toast.error(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchTerminals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, airportId: parseInt(airportId) };
      if (editingTerminal) { await updateTerminal(editingTerminal.id, payload); toast.success('Terminal updated'); }
      else { await addTerminal(payload); toast.success('Terminal added'); }
      setShowForm(false); setEditingTerminal(null); setForm({ terminalCode: '', name: '' }); fetchTerminals();
    } catch (e) { toast.error(e.message); }
  };

  const handleEdit = (t) => { setEditingTerminal(t); setForm({ terminalCode: t.terminalCode, name: t.name }); setShowForm(true); };

  const handleToggle = async (t) => {
    try {
      if (t.active) { await deactivateTerminal(t.id); toast.success('Deactivated'); } else { await reactivateTerminal(t.id); toast.success('Reactivated'); }
      fetchTerminals();
    } catch (e) { toast.error(e.message); }
  };

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div><h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Terminal Management</h4><p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Add, edit and manage airport terminals</p></div>
        <button className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: 8 }} onClick={() => { setShowForm(!showForm); setEditingTerminal(null); setForm({ terminalCode: '', name: '' }); }}>
          <FaPlus size={14} />{showForm ? 'Cancel' : 'Add Terminal'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 mb-4" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3">{editingTerminal ? 'Edit Terminal' : 'New Terminal'}</h6>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Terminal Code</label>
                <input type="text" className="form-control" placeholder="e.g. T1" value={form.terminalCode} onChange={(e) => setForm({ ...form, terminalCode: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Terminal Name</label>
                <input type="text" className="form-control" placeholder="e.g. Terminal 1 - Domestic" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100" style={{ borderRadius: 8 }}>{editingTerminal ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Code</th><th>Name</th><th>Airport</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {terminals.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5">No terminals yet. Click "Add Terminal" to get started.</td></tr>
              ) : terminals.map((t, i) => (
                <tr key={t.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td><span className="fw-semibold">{t.terminalCode}</span></td>
                  <td>{t.name}</td>
                  <td><span className="text-muted">{t.airportCode}</span></td>
                  <td><span className={`badge ${t.active ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6, fontWeight: 500 }}>{t.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" style={{ borderRadius: 6 }} onClick={() => handleEdit(t)}><FaEdit size={13} /></button>
                    <button className={`btn btn-sm ${t.active ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ borderRadius: 6 }} onClick={() => handleToggle(t)}>{t.active ? <FaToggleOff size={13} /> : <FaToggleOn size={13} />}</button>
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

export default TerminalManagement;
