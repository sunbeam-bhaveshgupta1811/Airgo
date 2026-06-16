import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlane, FaEye, FaEyeSlash } from "react-icons/fa";
import { registerUser } from "../../services/auth/user";
import { toast } from "react-toastify";
import "../../styles/Register.css";

const DEFAULT_TITLE = "Mr";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (firstName.trim().length < 2) {
      toast.warn("First name must be at least 2 characters");
      return false;
    }
    if (lastName.trim().length < 2) {
      toast.warn("Last name must be at least 2 characters");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warn("Please enter a valid email address");
      return false;
    }
    if (!/^(\+91)?[6-9][0-9]{9}$/.test(phone)) {
      toast.warn("Please enter a valid 10-digit phone number starting with 6-9");
      return false;
    }
    if (password.length < 8) {
      toast.warn("Password must be at least 8 characters");
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      toast.warn("Password must contain uppercase, lowercase, digit, and special character (@$!%*?&)");
      return false;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return false;
    }
    if (!agreedToTerms) {
      toast.warn("Please agree to the Terms of Service and Privacy Policy");
      return false;
    }
    return true;
  };

  const onRegister = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await registerUser(
        DEFAULT_TITLE,
        firstName,
        lastName,
        email,
        phone,
        password
      );
      if (result.success) {
        toast.success("Successfully registered");
        toast.info("Please verify your email before logging in.");
        navigate("/");
      } else {
        if (result.status === 409) {
          toast.error("Email already exists. Please login.");
        } else {
          toast.error(result.message || "Error while registering the user");
        }
      }
    } catch (error) {
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-split">
        <div className="register-panel-shell">
          <div className="register-card">
            <div className="register-card-top">
              <Link to="/contactus" className="register-help-link">
                Need help?
              </Link>
            </div>

            <form
              className="register-form register-form--horizontal"
              onSubmit={onRegister}
              noValidate
            >
              <div className="register-field-group register-area-first">
                <label htmlFor="register-firstname"></label>
                <input
                  id="register-firstname"
                  type="text"
                  className="register-field"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>

              <div className="register-field-group register-area-last">
                <label htmlFor="register-lastname"></label>
                <input
                  id="register-lastname"
                  type="text"
                  className="register-field"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>

              <div className="register-field-group register-area-email">
                <label htmlFor="register-email"></label>
                <input
                  id="register-email"
                  type="email"
                  className="register-field"
                  placeholder="@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="register-field-group register-area-phone">
                <label htmlFor="register-phone"></label>
                <input
                  id="register-phone"
                  type="tel"
                  className="register-field"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>

              <div className="register-field-group register-area-password">
                <label htmlFor="register-password"></label>
                <div className="register-password-wrap">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    className="register-field register-field-password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="register-field-group register-area-confirm">
                <label htmlFor="register-confirm"></label>
                <div className="register-password-wrap">
                  <input
                    id="register-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    className="register-field register-field-password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <label className="register-terms register-area-span">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <span>
                  I accept the terms of the{" "}
                  <Link to="/contactus" className="register-inline-link">
                    agreement
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="register-submit register-area-span"
              >
                Sign up
              </button>

              <p className="register-footer-text register-area-span">
                Already have an account?{" "}
                <Link className="register-login-link" to="/login">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </div>
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

export default Register;
