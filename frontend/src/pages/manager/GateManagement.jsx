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
    try {
      const [gatesData, terminalsData] = await Promise.all([getMyGates(), getMyTerminals()]);
      setGates(gatesData);
      setTerminals(terminalsData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, terminalId: parseInt(form.terminalId) };
      if (editingGate) {
        await updateGate(editingGate.id, payload);
        toast.success('Gate updated successfully');
      } else {
        await addGate(payload);
        toast.success('Gate added successfully');
      }
      setShowForm(false);
      setEditingGate(null);
      setForm({ gateNumber: '', terminalId: '', status: 'AVAILABLE' });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (gate) => {
    setEditingGate(gate);
    setForm({ gateNumber: gate.gateNumber, terminalId: gate.terminalId.toString(), status: gate.status });
    setShowForm(true);
  };

  const handleToggleStatus = async (gate) => {
    try {
      if (gate.active) {
        await deactivateGate(gate.id);
        toast.success('Gate deactivated');
      } else {
        await reactivateGate(gate.id);
        toast.success('Gate reactivated');
      }
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-success';
      case 'OCCUPIED': return 'bg-warning';
      case 'MAINTENANCE': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gate Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingGate(null); setForm({ gateNumber: '', terminalId: '', status: 'AVAILABLE' }); }}>
          <FaPlus className="me-2" />{showForm ? 'Cancel' : 'Add Gate'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{editingGate ? 'Edit Gate' : 'Add New Gate'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Gate Number</label>
                  <input type="text" className="form-control" placeholder="e.g. G1" value={form.gateNumber}
                    onChange={(e) => setForm({ ...form, gateNumber: e.target.value })} required />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Terminal</label>
                  <select className="form-select" value={form.terminalId}
                    onChange={(e) => setForm({ ...form, terminalId: e.target.value })} required>
                    <option value="">Select Terminal</option>
                    {terminals.map(t => (
                      <option key={t.id} value={t.id}>{t.terminalCode} - {t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3 d-flex align-items-end">
                  <button type="submit" className="btn btn-success w-100">
                    {editingGate ? 'Update' : 'Add'} Gate
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Gate</th>
              <th>Terminal</th>
              <th>Airport</th>
              <th>Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gates.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-4">No gates found. Add your first gate.</td></tr>
            ) : (
              gates.map((g, i) => (
                <tr key={g.id}>
                  <td>{i + 1}</td>
                  <td><strong>{g.gateNumber}</strong></td>
                  <td>{g.terminalCode} - {g.terminalName}</td>
                  <td>{g.airportCode}</td>
                  <td><span className={`badge ${getStatusBadge(g.status)}`}>{g.status}</span></td>
                  <td>
                    <span className={`badge ${g.active ? 'bg-success' : 'bg-secondary'}`}>
                      {g.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(g)}>
                      <FaEdit />
                    </button>
                    <button className={`btn btn-sm ${g.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => handleToggleStatus(g)}>
                      {g.active ? <FaToggleOff /> : <FaToggleOn />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GateManagement;
