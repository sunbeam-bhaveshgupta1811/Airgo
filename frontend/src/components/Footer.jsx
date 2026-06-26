import React from "react";
import { FaPlane } from "react-icons/fa";

function Footer() {
  return (
    <footer style={{ width: "100%", padding: "20px 0", background: "#0f172a", color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 15px" }}>
        <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
          <FaPlane size={14} />
          <span style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>Airgo</span>
        </div>
        <span style={{ fontSize: "0.82rem" }}>© {new Date().getFullYear()} Airgo Airlines. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
