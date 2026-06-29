import React, { useState, useEffect } from 'react';
import { FaSearch, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt')}` } });

const AdminAllFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${config.serverURL}/admin/flights`, getAuthHeaders());
      setFlights(res.data?.data || []);
    } catch (e) { toast.error('Failed to load flights'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchFlights(); }, []);

  const handleToggle = async (f) => {
    try {
      const endpoint = f.status === 'ACTIVE' ? 'deactivate' : 'reactivate';
      await axios.patch(`${config.serverURL}/admin/flights/${f.id}/${endpoint}`, {}, getAuthHeaders());
      toast.success(f.status === 'ACTIVE' ? 'Flight deactivated' : 'Flight reactivated');
      fetchFlights();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const filtered = flights
    .filter(f => statusFilter === 'ALL' || f.status === statusFilter)
    .filter(f => [f.flightNumber, f.airlineName, f.airlineCode, f.originCity, f.destinationCity, f.originAirportCode, f.destinationAirportCode]
      .some(v => (v || '').toLowerCase().includes(search.toLowerCase())));

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">All Flights</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Global view of all flights (created by Airport Managers)</p>
        </div>
        <span className="badge bg-primary" style={{ fontSize: '0.85rem', borderRadius: 8, padding: '8px 16px' }}>{filtered.length} flights</span>
      </div>

      <div className="card border-0 mb-3" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-md-8">
              <div className="input-group"><span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" /></span>
              <input type="text" className="form-control border-start-0" placeholder="Search by flight, airline, city, or airport code..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead><tr style={{ background: '#f8fafc' }}>
              <th className="ps-4">#</th><th>Flight</th><th>Airline</th><th>Route</th><th>Duration</th><th>Status</th><th>Override</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-5">No flights found.</td></tr>
              ) : filtered.map((f, i) => (
                <tr key={f.id}>
                  <td className="ps-4">{i + 1}</td>
                  <td className="fw-semibold">{f.flightNumber}</td>
                  <td>{f.airlineName} <span className="text-muted">({f.airlineCode})</span></td>
                  <td>{f.originCity} ({f.originAirportCode}) → {f.destinationCity} ({f.destinationAirportCode})</td>
                  <td>{f.durationMinutes ? `${Math.floor(f.durationMinutes / 60)}h ${f.durationMinutes % 60}m` : '-'}</td>
                  <td><span className={`badge ${f.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ borderRadius: 6 }}>{f.status}</span></td>
                  <td>
                    <button className={`btn btn-sm ${f.status === 'ACTIVE' ? 'btn-outline-danger' : 'btn-outline-success'}`} style={{ borderRadius: 6 }} onClick={() => handleToggle(f)} title={f.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}>
                      {f.status === 'ACTIVE' ? <><FaToggleOff size={13} className="me-1" />Deactivate</> : <><FaToggleOn size={13} className="me-1" />Activate</>}
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

export default AdminAllFlights;
