import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function ManagerNavbar() {
  const [managerName, setManagerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = sessionStorage.getItem("name");
    if (name) setManagerName(name);
  }, []);

  const Logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", minHeight: 64 }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <img src="/images/airlineLogo.jpg" alt="Logo" style={{ height: 36, marginRight: 10, borderRadius: 8 }} />
          <span className="navbar-brand fw-bold text-white mb-0" style={{ fontSize: "1.2rem", letterSpacing: "-0.5px" }}>Airgo <span style={{ fontWeight: 400, opacity: 0.7, fontSize: "0.85rem" }}>Manager</span></span>
        </div>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#managerNav">
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="managerNav">
          <ul className="navbar-nav me-auto ms-4">
            {[
              { to: "/manager/dashboard", label: "Dashboard" },
              { to: "/manager/airlines", label: "Airlines" },
              { to: "/manager/flights", label: "Flights" },
              { to: "/manager/terminals", label: "Terminals" },
              { to: "/manager/gates", label: "Gates" },
              { to: "/manager/bookings", label: "Bookings" },
            ].map(item => (
              <li className="nav-item" key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => `nav-link px-3 ${isActive ? "active" : ""}`}
                  style={({ isActive }) => ({ color: isActive ? "#fff" : "rgba(255,255,255,0.7)", fontWeight: isActive ? 600 : 400, fontSize: "0.92rem", borderBottom: isActive ? "2px solid #3b82f6" : "2px solid transparent", transition: "all 0.2s" })}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink to="/manager/profile" className="nav-link" style={{ color: "rgba(255,255,255,0.7)" }}>Profile</NavLink>
            </li>
            <li className="nav-item">
              <button className="btn btn-sm btn-outline-light ms-2" onClick={Logout} style={{ borderRadius: 8, fontSize: "0.85rem" }}>Logout</button>
            </li>
            <li className="nav-item ms-3">
              <span className="text-white" style={{ fontSize: "0.85rem", opacity: 0.8 }}>{managerName || "Manager"}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default ManagerNavbar;
