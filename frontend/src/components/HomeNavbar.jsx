import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaUserShield,
  FaUserPlus,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`home-navbar navbar navbar-expand-lg ${
        isScrolled ? "shadow-sm bg-light" : ""
      }`}
      style={{ padding: "10px 30px" }}
    >
      <div
        className="container-fluid d-flex justify-content-between align-items-center"
        style={{ width: "100%" }}
      >
        {/* Left: Logo + Brand */}
        <div className="d-flex align-items-center">
          <img
            src="/images/airlineLogo.jpg"
            alt="Logo"
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
          <span className="fw-bold fs-5">Airline Reservation System</span>
        </div>

        {/* Center: Navigation Links */}
        <div
          className="d-flex justify-content-center"
          style={{ flex: 1, gap: "25px" }}
        >
          <Link to="/" className="nav-link fw-semibold">
            Home
          </Link>
          <Link to="/about" className="nav-link fw-semibold">
            About
          </Link>
          <Link to="/contactus" className="nav-link fw-semibold">
            Contact Us
          </Link>
        </div>

        {/* Right: Auth Buttons */}
        <div className="d-flex align-items-center" style={{ gap: "15px" }}>
          <Link to="/adminlogin" className="btn btn-outline-primary btn-sm">
            <FaUserShield className="me-1" />
            Admin
          </Link>
          <Link to="/login" className="btn btn-primary btn-sm">
            <FaUser className="me-1" />
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            <FaUserPlus className="me-1" />
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
