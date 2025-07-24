import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomeNavbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";


const HomeNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="home-navbar">
      <div className="navbar-brand">
        <img src="/images/Airline_logo.jpg" alt="MX Flights Logo" className="navbar-logo" />
        <div className="brand-text">
          <span className="project-tagline">Airline Reservation System</span>
        </div>
      </div>

      <button 
        className="mobile-menu-toggle" 
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link to="/contactus" className="nav-link" onClick={() => setIsMenuOpen(false)}>Contact us</Link>
      </div>


      <div className="auth-section">
        <Link to="/adminlogin" className="login-btn">Admin</Link>
      </div>

      <div className="auth-section">
        <Link to="/login" className="login-btn">Login</Link>
      </div>

    </nav>
  );
};

export default HomeNavbar;