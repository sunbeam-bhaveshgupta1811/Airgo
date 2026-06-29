import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminNavbar() {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    if (name) setAdminName(name);
  }, []);

  const Logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/airports", label: "Airports" },
    { to: "/admin/airlinemanagement", label: "Airlines" },
    { to: "/admin/flights", label: "Flights" },
    { to: "/admin/schedules", label: "Schedules" },
    { to: "/admin/passengerslist", label: "Passengers" },
    { to: "/admin/bookings", label: "Bookings" },
    { to: "/admin/managerapproval", label: "Managers" },
    { to: "/admin/viewfeedback", label: "Feedback" },
  ];

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", minHeight: 64, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <img src="/images/airlineLogo.jpg" alt="Logo" style={{ height: 36, marginRight: 10, borderRadius: 8 }} />
          <span className="navbar-brand fw-bold text-white mb-0" style={{ fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            Airgo <span style={{ fontWeight: 400, opacity: 0.6, fontSize: "0.85rem" }}>Admin</span>
          </span>
        </div>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarContent">
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="adminNavbarContent">
          <ul className="navbar-nav me-auto ms-4">
            {navItems.map(item => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav-link px-3 ${isActive ? "active" : ""}`}
                  style={({ isActive }) => ({
                    color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "0.92rem",
                    borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                    transition: "all 0.2s",
                    paddingBottom: 6,
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/admin/profile" className="nav-link" style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem" }}>Profile</NavLink>
            </li>
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-light ms-2" onClick={Logout} style={{ borderRadius: 8, fontSize: "0.85rem", padding: "5px 14px" }}>Logout</button>
            </li>
            <li className="nav-item ms-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: "0.8rem", fontWeight: 700, color: "#fff" }}>
                  {(adminName || "A").charAt(0).toUpperCase()}
                </div>
                <span className="text-white ms-2" style={{ fontSize: "0.85rem", opacity: 0.85 }}>{adminName || "Admin"}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
