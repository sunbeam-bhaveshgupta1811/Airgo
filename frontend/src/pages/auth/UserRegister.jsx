import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/auth/user';
import { toast } from 'react-toastify';
import { FaUser, FaPlane, FaTicketAlt, FaGlobe, FaShieldAlt } from 'react-icons/fa';

const UserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const result = await registerUser('', form.firstName, form.lastName, form.email, form.phone, form.password, 'USER');
      if (result.success) {
        toast.success(result.message || 'Registration successful! Please check your email.');
        navigate('/auth');
      } else { toast.error(result.message || 'Registration failed'); }
    } catch { toast.error('Something went wrong.'); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel - Branding */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5"
        style={{ width: '45%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05 }}>
          {[...Array(6)].map((_, i) => <FaPlane key={i} size={80} style={{ position: 'absolute', top: `${15 + i * 15}%`, left: `${10 + i * 12}%`, transform: `rotate(${30 + i * 20}deg)` }} />)}
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380 }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <FaPlane size={28} />
            <h3 className="fw-bold mb-0">Airgo</h3>
          </div>
          <h2 className="fw-bold mb-3" style={{ lineHeight: 1.3 }}>Your Journey Starts Here</h2>
          <p style={{ opacity: 0.75, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Join thousands of travelers who book smarter with Airgo. Find the best flights, compare prices, and travel with confidence.
          </p>
          <div className="mt-4 d-flex flex-column gap-3">
            {[
              { icon: FaTicketAlt, text: 'Easy flight booking & e-tickets' },
              { icon: FaGlobe, text: 'Search across 50+ airlines' },
              { icon: FaShieldAlt, text: 'Secure payments & instant confirmation' },
            ].map((item, i) => (
              <div key={i} className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
                  <item.icon size={16} />
                </div>
                <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form inside card */}
      <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 p-4 p-lg-5" style={{ background: '#f1f5f9' }}>
        <div className="card border-0 shadow-sm w-100" style={{ maxWidth: 540, borderRadius: 16 }}>
          <div className="card-body p-4 p-lg-5">
            {/* Mobile header */}
            <div className="d-lg-none text-center mb-3">
              <div className="d-flex justify-content-center align-items-center gap-2">
                <FaPlane size={20} className="text-primary" />
                <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Airgo</h5>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mb-1">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: '#eff6ff', flexShrink: 0 }}>
                <FaUser size={15} className="text-primary" />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>Create Account</h5>
                <span className="text-muted" style={{ fontSize: '0.82rem' }}>Sign up to start booking flights</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>First Name</label>
                  <input type="text" className="form-control" placeholder="John"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.firstName} onChange={update('firstName')} required />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>Last Name</label>
                  <input type="text" className="form-control" placeholder="Doe"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.lastName} onChange={update('lastName')} required />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>Email Address</label>
                  <input type="email" className="form-control" placeholder="john@example.com"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.email} onChange={update('email')} required />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>Phone Number</label>
                  <input type="text" className="form-control" placeholder="+91XXXXXXXXXX"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.phone} onChange={update('phone')} />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>Password</label>
                  <input type="password" className="form-control" placeholder="Min 8 characters"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.password} onChange={update('password')} required />
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="form-label small fw-semibold" style={{ color: '#475569' }}>Confirm Password</label>
                  <input type="password" className="form-control" placeholder="Re-enter password"
                    style={{ borderRadius: 10, padding: '10px 14px', border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    value={form.confirmPassword} onChange={update('confirmPassword')} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-semibold mt-2" disabled={loading}
                style={{ borderRadius: 10, padding: '12px', fontSize: '1rem', background: '#3b82f6', border: 'none', boxShadow: '0 2px 8px rgba(59,130,246,0.2)' }}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-3 pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
              <span className="text-muted" style={{ fontSize: '0.88rem' }}>Already have an account? </span>
              <Link to="/auth" className="text-decoration-none fw-semibold" style={{ fontSize: '0.88rem', color: '#3b82f6' }}>Sign In</Link>
              <span className="mx-2 text-muted">|</span>
              <Link to="/" className="text-decoration-none" style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
