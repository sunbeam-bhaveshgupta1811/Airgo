import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../services/auth/user';
import { toast } from 'react-toastify';
import { FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { config } from '../../../../config';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${config.serverURL}/api/auth/admin-exists`);
        setAdminExists(res.data?.data === true);
      } catch { setAdminExists(true); }
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.data) {
        if (result.data.role !== 'ADMIN') { toast.error('Access denied. Admins only.'); setLoading(false); return; }
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('jwt', result.data.token);
        sessionStorage.setItem('userId', result.data.userId);
        sessionStorage.setItem('userEmail', result.data.email);
        sessionStorage.setItem('name', result.data.firstName);
        sessionStorage.setItem('userType', 'ADMIN');
        toast.success(`Welcome, ${result.data.firstName}!`);
        navigate('/admin/dashboard');
      } else { toast.error(result.message || 'Login failed'); }
    } catch { toast.error('Something went wrong.'); } finally { setLoading(false); }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (createForm.password !== createForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${config.serverURL}/api/auth/create-admin`, {
        firstName: createForm.firstName, lastName: createForm.lastName,
        email: createForm.email, phone: createForm.phone,
        password: createForm.password, confirmPassword: createForm.confirmPassword
      });
      if (res.data?.success) {
        toast.success('Admin account created! You can now log in.');
        setAdminExists(true);
        setShowCreate(false);
      } else { toast.error(res.data?.message || 'Failed'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create admin'); } finally { setLoading(false); }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: 440, width: '100%', borderRadius: 16 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60, background: '#eff6ff' }}>
              <FaShieldAlt size={28} className="text-primary" />
            </div>
            <h4 className="fw-bold" style={{ color: '#0f172a' }}>Admin Portal</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Secure access for system administrators</p>
          </div>

          {!showCreate ? (
            <>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email</label>
                  <input type="email" className="form-control" style={{ borderRadius: 8, padding: '10px 14px' }}
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold">Password</label>
                  <input type="password" className="form-control" style={{ borderRadius: 8, padding: '10px 14px' }}
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading}
                  style={{ borderRadius: 8, padding: '10px', background: '#0f172a', border: 'none' }}>
                  {loading ? 'Signing in...' : 'Sign In as Admin'}
                </button>
              </form>

              {!adminExists && (
                <div className="mt-4 text-center">
                  <hr />
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>No admin account exists yet.</p>
                  <button className="btn btn-outline-primary w-100" style={{ borderRadius: 8 }}
                    onClick={() => setShowCreate(true)}>
                    Create Admin Account
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <h6 className="fw-bold mb-3">Create Admin Account</h6>
              <form onSubmit={handleCreateAdmin}>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input type="text" className="form-control" style={{ borderRadius: 8 }} placeholder="First Name"
                      value={createForm.firstName} onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })} required />
                  </div>
                  <div className="col-6 mb-3">
                    <input type="text" className="form-control" style={{ borderRadius: 8 }} placeholder="Last Name"
                      value={createForm.lastName} onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })} required />
                  </div>
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" style={{ borderRadius: 8 }} placeholder="Email"
                    value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" style={{ borderRadius: 8 }} placeholder="Phone"
                    value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <input type="password" className="form-control" style={{ borderRadius: 8 }} placeholder="Password"
                      value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required />
                  </div>
                  <div className="col-6 mb-3">
                    <input type="password" className="form-control" style={{ borderRadius: 8 }} placeholder="Confirm Password"
                      value={createForm.confirmPassword} onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-success w-100 fw-semibold mb-2" disabled={loading}
                  style={{ borderRadius: 8, padding: '10px' }}>
                  {loading ? 'Creating...' : 'Create Admin'}
                </button>
                <button type="button" className="btn btn-outline-secondary w-100" style={{ borderRadius: 8 }}
                  onClick={() => setShowCreate(false)}>Cancel</button>
              </form>
            </>
          )}

          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none" style={{ fontSize: '0.85rem' }}>Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
