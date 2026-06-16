import React, { useState } from "react";
import { forgotPasswordApi } from "../../services/auth/user";
import { toast } from "react-toastify";
import "../../styles/Login.css";
import "../../styles/ForgetPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.warn("Please enter your registered email");
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPasswordApi(email);

      if (result.success) {
        toast.success("Reset link sent to your email");
        setEmailSent(true);
      } else {
        toast.error(result.message || "Error sending reset link");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="card-header">
            <div className="password-icon">
              <i className="fas fa-envelope-open" style={{ color: '#27ae60' }}></i>
            </div>
            <h3>Check Your Email</h3>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
          </div>
          <div className="card-body">
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <p style={{ color: '#999', fontSize: '0.85rem' }}>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                try again
              </button>
            </p>
            <div className="back-to-login" style={{ marginTop: '1rem' }}>
              <a href="/login" className="login-link">Back to Login</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header">
          <div className="password-icon">
            <i className="fas fa-key"></i>
          </div>
          <h3>Forgot Your Password?</h3>
          <p>Enter your email to reset your password</p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <span className="input-icon">
                <i className="fas fa-envelope"></i>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="back-to-login">
            <span>Remember your password? </span>
            <a href="/login" className="login-link">
              Login here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
