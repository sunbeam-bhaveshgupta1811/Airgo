import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth/user';
import { toast } from 'react-toastify';
import { FaUser, FaUserTie, FaPlane } from 'react-icons/fa';

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('userLogin');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e, role) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.data) {
        const data = result.data;
        if (role === 'USER' && data.role !== 'USER') {
          toast.error('This account is not a User account. Please use the correct login.');
          setLoading(false);
          return;
        }
        if (role === 'AIRPORT_MANAGER' && data.role !== 'AIRPORT_MANAGER') {
          toast.error('This account is not a Manager account. Please use the correct login.');
          setLoading(false);
          return;
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('jwt', data.token);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('userEmail', data.email);
        sessionStorage.setItem('name', data.firstName);
        sessionStorage.setItem('userType', data.role);
        if (data.airportId) sessionStorage.setItem('airportId', data.airportId);

        toast.success(`Welcome, ${data.firstName}!`);
        if (data.role === 'AIRPORT_MANAGER') navigate('/manager/dashboard');
        else navigate('/');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (activeTab === 'managerLogin') navigate('/register/manager');
    else navigate('/register/user');
  };

  const tabs = [
    { key: 'userLogin', label: 'User Login', icon: FaUser },
    { key: 'managerLogin', label: 'Manager Login', icon: FaUserTie },
  ];

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: 460, width: '100%', borderRadius: 16 }}>
        <div className="card-body p-0">
          {/* Header */}
          <div className="text-center p-4 pb-3">
            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
              <FaPlane size={24} className="text-primary" />
              <h4 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Airgo</h4>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Sign in to your account</p>
          </div>

          {/* Tabs */}
          <div className="d-flex border-bottom">
            {tabs.map(tab => (
              <button key={tab.key}
                className="btn btn-link text-decoration-none flex-fill py-3"
                style={{
                  fontSize: '0.92rem',
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  color: activeTab === tab.key ? '#3b82f6' : '#94a3b8',
                  borderBottom: activeTab === tab.key ? '3px solid #3b82f6' : '3px solid transparent',
                  borderRadius: 0,
                  transition: 'all 0.2s'
                }}
                onClick={() => { setActiveTab(tab.key); setEmail(''); setPassword(''); }}>
                <tab.icon className="me-2" size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <div className="p-4">
            <form onSubmit={(e) => handleLogin(e, activeTab === 'managerLogin' ? 'AIRPORT_MANAGER' : 'USER')}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Email Address</label>
                <input type="email" className="form-control" placeholder="Enter your email"
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0' }}
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold text-muted">Password</label>
                <input type="password" className="form-control" placeholder="Enter your password"
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0' }}
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-semibold mb-3" disabled={loading}
                style={{ borderRadius: 10, padding: '12px', fontSize: '1rem', background: '#3b82f6', border: 'none' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button type="button" className="btn btn-outline-secondary w-100 fw-semibold" onClick={handleRegister}
                style={{ borderRadius: 10, padding: '12px', fontSize: '0.95rem' }}>
                Register
              </button>
            </form>

            <div className="d-flex justify-content-between mt-3">
              <Link to="/forgot-password" className="text-decoration-none" style={{ fontSize: '0.85rem', color: '#3b82f6' }}>
                Forgot Password?
              </Link>
              <Link to="/" className="text-decoration-none" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
