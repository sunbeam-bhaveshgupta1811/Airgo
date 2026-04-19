import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../css/Login.css";
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
    <div className="login-page">
      <div className="form_container">
        <h2>{loginType === "admin" ? "Admin Login" : "Login"}</h2>

        <form onSubmit={onLogin}>
          <div className="input_box">
            <i className="email">📧</i>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input_box">
            <i className="password">🔒</i>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
            />
            <i className="pw_hide"></i>
          </div>

          <div className="option_field">
            <div className="checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login Now"}
          </button>
        </form>

        <div className="login_signup">
          {loginType !== "admin" && (
            <>
              Don't have an account? <Link to="/register">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BaseLogin;
