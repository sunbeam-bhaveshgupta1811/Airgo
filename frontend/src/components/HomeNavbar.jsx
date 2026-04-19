import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaUserShield, FaUserPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`home-navbar navbar navbar-expand-lg custom-navbar ${isScrolled ? "scrolled" : ""}`}
      style={{
        padding: 0,
        border: "none",
        background: "#fff",
        position: "relative",
        zIndex: 10,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        minHeight: 70,
      }}
    >
      <div className="container-fluid px-4" style={{ maxWidth: 1400 }}>
        <div className="d-flex w-100 align-items-center" style={{ minHeight: 70 }}>
          {/* Left: Logo */}
          <div className="d-flex align-items-center" style={{ minWidth: 180 }}>
            <img
              src="/images/airlineLogo.jpg"
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: "8px" }}
            />
            <span
              className="fw-bold fs-4"
              style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: "-1px", color: "#111" }}
            >
              Airgo
            </span>
          </div>
          {/* Center: Nav Links */}
          <div className="d-flex align-items-center justify-content-center flex-grow-1" style={{ gap: "2.5rem" }}>
            <Link to="/" className="nav-link fw-semibold navbar-link-main">Home</Link>
            <Link to="/about" className="nav-link fw-semibold navbar-link-main">About us</Link>
            <Link to="/contactus" className="nav-link fw-semibold navbar-link-main">Contact us</Link>
          </div>
          {/* Right: Auth Buttons */}
          <div className="d-flex align-items-center justify-content-end" style={{ gap: "12px", minWidth: 320 }}>
            <div className="dropdown">
              <button
                className="btn btn-link fw-semibold navbar-link-main dropdown-toggle"
                type="button"
                id="signinDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: "#111", textDecoration: "none" }}
              >
                <FaUser className="me-1" /> Sign in
              </button>
              <ul className="dropdown-menu" aria-labelledby="signinDropdown">
                <li>
                  <Link className="dropdown-item" to="/login">
                    User Sign in
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/adminlogin">
                    Admin Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="btn btn-primary fw-semibold"
              style={{ borderRadius: 10, fontWeight: 600, padding: "8px 22px", fontSize: "1rem", boxShadow: "0 2px 8px rgba(30, 64, 175, 0.07)" }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .navbar-link-main {
          color: #111 !important;
          font-size: 1.08rem;
          padding: 8px 10px;
          border-radius: 7px;
          transition: background 0.18s, color 0.18s;
        }
        .navbar-link-main:hover, .navbar-link-main.active {
          background: #f3f6fd;
          color: #1a237e !important;
          text-decoration: none;
        }
        .btn-primary {
          background: #1769ff !important;
          border: none !important;
        }
        .btn-primary:hover {
          background: #0047b3 !important;
        }
      `}</style>
    </nav>
  );
};

export default HomeNavbar;
