import React, { useEffect, useState } from "react";
import { FaPlane, FaMoneyBillWave, FaClipboardList, FaBuilding } from "react-icons/fa";
import { getDashboardStats } from "../../services/admin/adminDashboardServices";
import PerformanceChart from "../../components/PerformanceChart";

function AdminDashboard() {
  const [stats, setStats] = useState({ airlineCount: 0, flightCount: 0, bookingCount: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try { setStats(await getDashboardStats()); } catch (err) { setError(err.message); } finally { setLoading(false); }
    })();
  }, []);

  const fmt = (n) => Number(n).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  const cards = [
    { icon: FaBuilding, label: "Airlines", value: stats.airlineCount, sub: "Active airlines", color: "#3b82f6", bg: "#eff6ff" },
    { icon: FaPlane, label: "Flights", value: stats.flightCount, sub: "Registered flights", color: "#10b981", bg: "#ecfdf5" },
    { icon: FaClipboardList, label: "Bookings", value: stats.bookingCount, sub: "All time", color: "#8b5cf6", bg: "#f5f3ff" },
    { icon: FaMoneyBillWave, label: "Revenue", value: fmt(stats.totalRevenue), sub: "Confirmed bookings", color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Dashboard Overview</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger" style={{ borderRadius: 10 }}>{error}</div>}

      <div className="row g-4 mb-4">
        {cards.map((c, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="card border-0 h-100" style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", transition: "transform 0.2s", cursor: "default" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="card-body d-flex align-items-center p-4">
                <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: 52, height: 52, background: c.bg, flexShrink: 0 }}>
                  <c.icon size={22} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-muted mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{c.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: loading ? "1rem" : "1.4rem" }}>{loading ? "..." : c.value}</h4>
                  <span className="text-muted" style={{ fontSize: "0.78rem" }}>{c.sub}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0" style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="card-header bg-white border-bottom py-3 px-4" style={{ borderRadius: "12px 12px 0 0" }}>
          <h6 className="fw-bold mb-0" style={{ color: "#3b82f6" }}>Revenue by Airline</h6>
        </div>
        <div className="card-body p-4">
          <div style={{ height: 380 }}>
            <PerformanceChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
