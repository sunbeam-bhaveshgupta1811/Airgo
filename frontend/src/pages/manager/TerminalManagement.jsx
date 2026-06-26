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
    try {
      const data = await getMyTerminals();
      setTerminals(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTerminals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, airportId: parseInt(airportId) };
      if (editingTerminal) {
        await updateTerminal(editingTerminal.id, payload);
        toast.success('Terminal updated successfully');
      } else {
        await addTerminal(payload);
        toast.success('Terminal added successfully');
      }
      setShowForm(false);
      setEditingTerminal(null);
      setForm({ terminalCode: '', name: '' });
      fetchTerminals();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (terminal) => {
    setEditingTerminal(terminal);
    setForm({ terminalCode: terminal.terminalCode, name: terminal.name });
    setShowForm(true);
  };

  const handleToggleStatus = async (terminal) => {
    try {
      if (terminal.active) {
        await deactivateTerminal(terminal.id);
        toast.success('Terminal deactivated');
      } else {
        await reactivateTerminal(terminal.id);
        toast.success('Terminal reactivated');
      }
      fetchTerminals();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Terminal Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingTerminal(null); setForm({ terminalCode: '', name: '' }); }}>
          <FaPlus className="me-2" />{showForm ? 'Cancel' : 'Add Terminal'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{editingTerminal ? 'Edit Terminal' : 'Add New Terminal'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Terminal Code</label>
                  <input type="text" className="form-control" placeholder="e.g. T1" value={form.terminalCode}
                    onChange={(e) => setForm({ ...form, terminalCode: e.target.value })} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Terminal Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Terminal 1" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-end">
                  <button type="submit" className="btn btn-success w-100">
                    {editingTerminal ? 'Update' : 'Add'} Terminal
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
              <th>Code</th>
              <th>Name</th>
              <th>Airport</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {terminals.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted py-4">No terminals found. Add your first terminal.</td></tr>
            ) : (
              terminals.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td><strong>{t.terminalCode}</strong></td>
                  <td>{t.name}</td>
                  <td>{t.airportCode} - {t.airportName}</td>
                  <td>
                    <span className={`badge ${t.active ? 'bg-success' : 'bg-secondary'}`}>
                      {t.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(t)}>
                      <FaEdit />
                    </button>
                    <button className={`btn btn-sm ${t.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => handleToggleStatus(t)}>
                      {t.active ? <FaToggleOff /> : <FaToggleOn />}
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

export default TerminalManagement;
