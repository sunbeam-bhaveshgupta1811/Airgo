import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../../services/auth/user';
import { toast } from 'react-toastify';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.data) {
        const data = result.data;
        if (data.role !== 'AIRPORT_MANAGER') { toast.error('Access denied. Airport Managers only.'); setLoading(false); return; }
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('jwt', data.token);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('userEmail', data.email);
        sessionStorage.setItem('name', data.firstName);
        sessionStorage.setItem('userType', 'AIRPORT_MANAGER');
        sessionStorage.setItem('airportId', data.airportId || '');
        toast.success(`Welcome, ${data.firstName}!`);
        navigate('/manager/dashboard');
      } else { toast.error(result.message || 'Login failed'); }
    } catch { toast.error('Something went wrong.'); } finally { setLoading(false); }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: 420, width: '100%', borderRadius: 16 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img src="/images/airlineLogo.jpg" alt="Logo" style={{ width: 56, height: 56, borderRadius: 12 }} />
            <h4 className="mt-3 fw-bold" style={{ color: '#0f172a' }}>Airport Manager</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Sign in to manage your airport</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3"><label className="form-label small fw-semibold">Email</label><input type="email" className="form-control" style={{ borderRadius: 8, padding: '10px 14px' }} value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="mb-4"><label className="form-label small fw-semibold">Password</label><input type="password" className="form-control" style={{ borderRadius: 8, padding: '10px 14px' }} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={loading} style={{ borderRadius: 8, padding: '10px', background: '#0f172a', border: 'none' }}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="text-center mt-3"><Link to="/" className="text-decoration-none" style={{ fontSize: '0.9rem' }}>Back to Home</Link></div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
