import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaTicketAlt, FaUserCircle, FaTachometerAlt, FaPlane, FaBuilding, FaCalendarAlt, FaUsers, FaComments } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const name = sessionStorage.getItem("name") || "";
    const role = (sessionStorage.getItem("userType") || "").toUpperCase();
    setIsLoggedIn(loggedIn);
    setUserName(name);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <nav
      className={`home-navbar navbar navbar-expand-lg custom-navbar ${isScrolled ? "scrolled" : ""}`}
      style={{
        padding: 0,
        border: "none",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: isScrolled ? "0 10px 30px rgba(15, 23, 42, 0.10)" : "0 1px 0 rgba(15, 23, 42, 0.08)",
        minHeight: 70,
      }}
    >
      <div className="container-fluid px-4" style={{ maxWidth: 1400 }}>
        <div className="home-navbar-row d-flex w-100 align-items-center" style={{ minHeight: 70 }}>
          {/* Left: Logo */}
          <div className="home-navbar-brand d-flex align-items-center" style={{ minWidth: 180 }}>
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
          <div className="home-navbar-links d-flex align-items-center justify-content-center flex-grow-1" style={{ gap: "2.5rem" }}>
            <Link to="/" className="nav-link fw-semibold navbar-link-main">Home</Link>
            <Link to="/about" className="nav-link fw-semibold navbar-link-main">About us</Link>
            <Link to="/contactus" className="nav-link fw-semibold navbar-link-main">Contact us</Link>
          </div>
          {/* Right: Auth Buttons */}
          <div className="home-navbar-actions d-flex align-items-center justify-content-end" style={{ gap: "12px", minWidth: 320 }}>
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn btn-link fw-semibold navbar-link-main dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: "#111", textDecoration: "none" }}
                >
                  <FaUserCircle className="me-1" /> {userName || "My Account"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" style={{ minWidth: 220 }}>
                  {/* Admin menu */}
                  {userRole === 'ADMIN' && (<>
                    <li><Link className="dropdown-item" to="/admin/dashboard"><FaTachometerAlt className="me-2" /> Dashboard</Link></li>
                    <li><Link className="dropdown-item" to="/admin/airports"><FaBuilding className="me-2" /> Airports</Link></li>
                    <li><Link className="dropdown-item" to="/admin/airlinemanagement"><FaPlane className="me-2" /> Airlines</Link></li>
                    <li><Link className="dropdown-item" to="/admin/flights"><FaPlane className="me-2" /> Flights</Link></li>
                    <li><Link className="dropdown-item" to="/admin/schedules"><FaCalendarAlt className="me-2" /> Schedules</Link></li>
                    <li><Link className="dropdown-item" to="/admin/bookings"><FaTicketAlt className="me-2" /> Bookings</Link></li>
                    <li><Link className="dropdown-item" to="/admin/managerapproval"><FaUsers className="me-2" /> Managers</Link></li>
                    <li><Link className="dropdown-item" to="/admin/viewfeedback"><FaComments className="me-2" /> Feedback</Link></li>
                    <li><Link className="dropdown-item" to="/admin/profile"><FaUser className="me-2" /> Profile</Link></li>
                  </>)}

                  {/* Airport Manager menu */}
                  {userRole === 'AIRPORT_MANAGER' && (<>
                    <li><Link className="dropdown-item" to="/manager/dashboard"><FaTachometerAlt className="me-2" /> Dashboard</Link></li>
                    <li><Link className="dropdown-item" to="/manager/airlines"><FaPlane className="me-2" /> Airlines</Link></li>
                    <li><Link className="dropdown-item" to="/manager/flights"><FaPlane className="me-2" /> Flights</Link></li>
                    <li><Link className="dropdown-item" to="/manager/schedules"><FaCalendarAlt className="me-2" /> Schedules</Link></li>
                    <li><Link className="dropdown-item" to="/manager/terminals"><FaBuilding className="me-2" /> Terminals</Link></li>
                    <li><Link className="dropdown-item" to="/manager/bookings"><FaTicketAlt className="me-2" /> Bookings</Link></li>
                    <li><Link className="dropdown-item" to="/manager/passengers"><FaUsers className="me-2" /> Passengers</Link></li>
                    <li><Link className="dropdown-item" to="/manager/profile"><FaUser className="me-2" /> Profile</Link></li>
                  </>)}

                  {/* User menu */}
                  {(userRole === 'USER' || userRole === 'CUSTOMER' || (!userRole && isLoggedIn)) && (<>
                    <li><Link className="dropdown-item" to="/profile"><FaUser className="me-2" /> Profile</Link></li>
                    <li><Link className="dropdown-item" to="/customer/mybookings"><FaTicketAlt className="me-2" /> My Bookings</Link></li>
                    <li><Link className="dropdown-item" to="/customer/feedback"><FaComments className="me-2" /> My Feedback</Link></li>
                  </>)}

                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/adminlogin"
                  className="btn btn-outline-dark fw-semibold"
                  style={{ borderRadius: 10, padding: "8px 22px", fontSize: "1rem" }}
                >
                  Admin
                </Link>
                <Link
                  to="/auth"
                  className="btn btn-primary fw-semibold"
                  style={{ borderRadius: 10, fontWeight: 600, padding: "8px 22px", fontSize: "1rem", boxShadow: "0 2px 8px rgba(30, 64, 175, 0.07)" }}
                >
                  Login
                </Link>
              </>
            )}
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
        @media (max-width: 900px) {
          .home-navbar-row {
            min-height: auto !important;
            flex-wrap: wrap;
            gap: 10px;
            padding: 12px 0;
          }
          .home-navbar-brand {
            min-width: auto !important;
            flex: 1 1 auto;
          }
          .home-navbar-links {
            order: 3;
            flex: 1 0 100%;
            justify-content: flex-start !important;
            gap: 0.5rem !important;
            overflow-x: auto;
            padding-top: 4px;
          }
          .home-navbar-actions {
            min-width: auto !important;
          }
          .navbar-link-main {
            white-space: nowrap;
          }
        }
        @media (max-width: 520px) {
          .home-navbar-actions .btn-primary {
            padding: 7px 12px !important;
          }
          #signinDropdown, #userDropdown {
            padding-left: 0;
            padding-right: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default HomeNavbar;
