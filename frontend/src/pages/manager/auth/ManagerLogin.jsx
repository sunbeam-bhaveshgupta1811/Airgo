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

        if (data.role !== 'AIRPORT_MANAGER') {
          toast.error('Access denied. This login is for Airport Managers only.');
          setLoading(false);
          return;
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('jwt', data.token);
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('userEmail', data.email);
        sessionStorage.setItem('name', data.firstName);
        sessionStorage.setItem('userType', 'AIRPORT_MANAGER');
        sessionStorage.setItem('airportId', data.airportId || '');

        toast.success(`Welcome, ${data.firstName}!`);
        navigate('/manager/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a5276 0%, #2980b9 100%)' }}>
      <div className="card shadow-lg" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img src="/images/airlineLogo.jpg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '12px' }} />
            <h3 className="mt-2 fw-bold">Airport Manager Login</h3>
            <p className="text-muted">Sign in to manage your airport</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email}
                onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password}
                onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}
              style={{ background: '#1a5276', border: 'none' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
