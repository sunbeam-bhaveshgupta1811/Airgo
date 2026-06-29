import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { getManagerAirlines } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const ManagerAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => { try { setAirlines(await getManagerAirlines()); } catch (e) { /* empty data */ } finally { setLoading(false); } })();
  }, []);

  const filtered = airlines.filter(a => [a.name, a.code, a.country].some(f => (f || '').toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Airlines</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Airlines registered in the system (managed by Admin)</p>
        </div>
        <span className="badge bg-primary" style={{ fontSize: '0.85rem', borderRadius: 8, padding: '8px 16px' }}>{filtered.length} airlines</span>
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
          <input type="text" className="form-control border-start-0" placeholder="Search airlines..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}><th className="ps-4">#</th><th>Name</th><th>Code</th><th>Country</th><th>Contact</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5">No airlines available. Contact Admin to register airlines.</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{a.name}</td>
                  <td><span className="badge bg-primary" style={{ borderRadius: 6 }}>{a.code}</span></td>
                  <td>{a.country}</td>
                  <td className="text-muted" style={{ fontSize: '0.85rem' }}>{a.contactEmail || '-'}</td>
                  <td><span className={`badge ${a.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{a.status}</span></td>
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
