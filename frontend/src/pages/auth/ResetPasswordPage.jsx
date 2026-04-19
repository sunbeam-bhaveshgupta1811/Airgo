import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordWithOtpApi } from "../../services/auth/user";
import { toast } from "react-toastify";
import "../../css/ResetPassword.css";

function ResetPasswordOtpPage() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if no email in state
  if (!location.state || !location.state.email) {
    navigate("/forgot-password");
    return null;
  }

  const onResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp || !password || !confirmPassword) {
      toast.warn("Please enter OTP and new password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordWithOtpApi(location.state.email, otp, password);
      
      if (res.success) {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(res.message || "OTP invalid or expired");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="card-header">
          <div className="password-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h3>Reset Your Password</h3>
          <p>Enter OTP and new password</p>
          <div className="email-notice">
            <i className="fas fa-envelope me-2"></i>
            OTP sent to: <strong>{location.state.email}</strong>
          </div>
        </div>
        
        <div className="card-body">
          <form onSubmit={onResetPassword}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength="6"
                required
                disabled={isLoading}
              />
              <span className="input-icon">
                <i className="fas fa-shield-alt"></i>
              </span>
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="6"
              />
              <span 
                className="input-icon clickable"
                onClick={togglePasswordVisibility}
                title={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>

            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength="6"
              />
              <span className="input-icon">
                <i className="fas fa-lock"></i>
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
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-key me-2"></i>
                  Reset Password
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

          <div className="resend-otp">
            <span>Didn't receive OTP? </span>
            <button className="resend-link">
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordOtpPage;