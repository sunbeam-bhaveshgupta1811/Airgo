import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "linear-gradient(135deg, #1a5276 0%, #2980b9 100%)" }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            src="/images/airlineLogo.jpg"
            alt="Logo"
            style={{ height: "40px", marginRight: "10px", borderRadius: "8px" }}
          />
          <span className="navbar-brand fw-bold">Airgo Manager</span>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#managerNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="managerNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/manager/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager/terminals" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Terminals
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager/gates" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Gates
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/manager/bookings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Bookings
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/manager/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-light" onClick={Logout}>
                Logout
              </button>
            </li>
            <li className="nav-item">
              <span className="nav-link text-light">{managerName || "Manager"}</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default ManagerNavbar;
