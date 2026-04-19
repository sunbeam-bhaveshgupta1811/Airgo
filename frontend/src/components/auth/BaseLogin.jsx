import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../css/Login.css";
import { FaPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

function BaseLogin({ loginType, authService, redirectPath }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified")) {
      toast.success("Your account has been verified! Please login.");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const onLogin = async (e) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warn("Please enter a valid email");
      return;
    }

    if (!email.trim()) {
      toast.warn("Please enter email without spaces");
      return;
    }

    if (password.length === 0) {
      toast.warn("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService(email, password, loginType);
      console.log("Login result:", result);
      if (result.success == true) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("userType", result.data.role || "");
        sessionStorage.setItem("jwt", result.data.jwt || "");
        sessionStorage.setItem("userId", result.data.customerId || "0");
        sessionStorage.setItem("name", result.data.firstName || "");
        toast.success("Login successful!");
        navigate(redirectPath);
      } else if (
        result.success == false &&
        result.message == "Access denied: You are not allowed to log in as USER"
      ) {
        toast.error(result.message);
      } else {
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page login-page">
      <div className="register-split">
        {/* Login Card */}
        <div className="register-panel-shell">
          <div className="register-card">
            <div className="register-card-top">
              <Link to="/contactus" className="register-help-link">
                Need help?
              </Link>
            </div>
            <form className="register-form" onSubmit={onLogin}>
              <h2 style={{textAlign: 'center', marginBottom: '1.5rem'}}>{loginType === "admin" ? "Admin Login" : "Login"}</h2>
              <div className="register-field-group">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  className="register-field"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="register-field-group">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  className="register-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="register-terms" style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" style={{fontWeight: 400}}>Remember me</label>
                <span style={{marginLeft: 'auto'}}>
                  <Link to="/forgot-password" className="register-inline-link">Forgot password?</Link>
                </span>
              </div>
              <button className="register-submit" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login Now"}
              </button>
              <div className="register-footer-text" style={{marginTop: '1.2rem'}}>
                {loginType !== "admin" && (
                  <>
                    Don't have an account? <Link className="register-login-link" to="/register">Signup</Link>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Hero Section */}
        <aside className="register-hero">
          <div className="register-hero-inner">
            <Link to="/" className="register-brand">
              <span className="register-brand-mark" aria-hidden>
                <FaPlane />
              </span>
              <span className="register-brand-name">Airgo</span>
            </Link>
            <div className="register-hero-copy">
              <div className="register-status-badge" role="status">
                <span className="register-status-dot" aria-hidden />
                <span>System Online • 99.9% Uptime</span>
              </div>
              <h2 className="register-hero-headline">
                Powering smarter airline operations.
              </h2>
              <p className="register-hero-subtext">
                Manage flights, crews, and schedules seamlessly with real-time
                insights and control.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BaseLogin;
