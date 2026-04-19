import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../services/auth/user";
import { toast } from "react-toastify";
import "../../css/Login.css";
import "../../css/ForgetPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        setEmail("");
        console.log("Navigating to reset-password with email:", email);
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(result.message || "Error sending reset link");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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