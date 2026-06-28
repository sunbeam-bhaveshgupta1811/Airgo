import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrash, FaSearch, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` }
});

const ManagerApproval = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${config.serverURL}/admin/managers`, getAuthHeaders());
      setManagers(res.data?.data || []);
    } catch (err) { toast.error('Failed to fetch managers'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchManagers(); }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${config.serverURL}/admin/managers/${id}/approve`, {}, getAuthHeaders());
      toast.success('Manager approved');
      fetchManagers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${config.serverURL}/admin/managers/${id}/reject`, {}, getAuthHeaders());
      toast.success('Manager rejected');
      fetchManagers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this manager permanently?')) return;
    try {
      await axios.delete(`${config.serverURL}/admin/managers/${id}`, getAuthHeaders());
      toast.success('Manager deleted');
      fetchManagers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusColor = { PENDING: 'bg-warning text-dark', APPROVED: 'bg-success', REJECTED: 'bg-danger' };

  const filtered = managers
    .filter(m => filter === 'ALL' || m.approvalStatus === filter)
    .filter(m => [m.firstName, m.lastName, m.email].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Airport Manager Approval</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Review and approve manager registrations</p>
        </div>
        <div className="d-flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
              style={{ borderRadius: 8, fontSize: '0.82rem' }} onClick={() => setFilter(f)}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              {f === 'PENDING' && ` (${managers.filter(m => m.approvalStatus === 'PENDING').length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
            <input type="text" className="form-control border-start-0" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}>
              <th className="ps-4">#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Email Verified</th><th>Registered</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted py-5">No managers found.</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{m.firstName} {m.lastName}</td>
                  <td>{m.email}</td>
                  <td>{m.phone || '-'}</td>
                  <td><span className={`badge ${statusColor[m.approvalStatus] || 'bg-secondary'}`} style={{ borderRadius: 6 }}>{m.approvalStatus}</span></td>
                  <td><span className={`badge ${m.emailVerified ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{m.emailVerified ? 'Yes' : 'No'}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {m.approvalStatus === 'PENDING' && (
                        <>
                          <button className="btn btn-sm btn-success" style={{ borderRadius: 6 }} onClick={() => handleApprove(m.id)} title="Approve"><FaCheck size={12} /></button>
                          <button className="btn btn-sm btn-danger" style={{ borderRadius: 6 }} onClick={() => handleReject(m.id)} title="Reject"><FaTimes size={12} /></button>
                        </>
                      )}
                      {m.approvalStatus === 'REJECTED' && (
                        <button className="btn btn-sm btn-success" style={{ borderRadius: 6 }} onClick={() => handleApprove(m.id)} title="Approve"><FaCheck size={12} /></button>
                      )}
                      {m.approvalStatus === 'APPROVED' && (
                        <button className="btn btn-sm btn-warning" style={{ borderRadius: 6 }} onClick={() => handleReject(m.id)} title="Revoke"><FaTimes size={12} /></button>
                      )}
                      <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 6 }} onClick={() => handleDelete(m.id)} title="Delete"><FaTrash size={12} /></button>
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

export default ManagerApproval;
