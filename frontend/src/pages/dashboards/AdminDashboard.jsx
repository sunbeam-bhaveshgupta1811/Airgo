import React, { useEffect, useState } from "react";
import "../../styles/AdminNavbar.css";
import "../../styles/AdminDashboard.css";
import { FaPlane, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";
import { getDashboardStats } from "../../services/admin/adminDashboardServices";
import { Outlet } from "react-router-dom";
import PerformanceChart from "./../../components/PerformanceChart";

function AdminDashboard() {
  const [stats, setStats] = useState({
    airlineCount: 0,
    flightCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="admin-layout">
      <div className="container-fluid p-4 dashboard-content">
        {error && <div className="alert alert-danger">{error}</div>}
        {loading && (
          <div className="alert alert-info">Loading dashboard data...</div>
        )}

        {/* Summary Cards Row - 4 cards in one row */}
        <div className="row summary-cards">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body d-flex align-items-center">
                <div className="card-icon mr-3">
                  <FaPlane size={30} className="text-primary" />
                </div>
                <div className="card-content">
                  <h6 className="card-title text-muted text-uppercase">
                    Available Airlines
                  </h6>
                  <div>
                    <div className="h4 mb-0 font-weight-bold">
                      {stats.airlineCount}
                    </div>
                    <small className="text-muted">Active airlines</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Available Flights */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body d-flex align-items-center">
                <div className="card-icon mr-3">
                  <FaPlane size={30} className="text-success" />
                </div>
                <div className="card-content">
                  <h6 className="card-title text-muted text-uppercase">
                    Available Flights
                  </h6>
                  <div className="h4 mb-0 font-weight-bold">
                    {stats.flightCount}
                  </div>
                  <small className="text-muted">Registered flights</small>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Bookings */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body d-flex align-items-center">
                <div className="card-icon mr-3">
                  <FaClipboardList size={30} className="text-info" />
                </div>
                <div className="card-content">
                  <h6 className="card-title text-muted text-uppercase">
                    Total Bookings
                  </h6>
                  <div className="h4 mb-0 font-weight-bold">
                    {stats.bookingCount}
                  </div>
                  <small className="text-muted">All time bookings</small>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Total Earnings */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body d-flex align-items-center">
                <div className="card-icon mr-3">
                  <FaMoneyBillWave size={30} className="text-warning" />
                </div>
                <div className="card-content">
                  <h6 className="card-title text-muted text-uppercase">
                    Total Earnings
                  </h6>
                  <div className="h4 mb-0 font-weight-bold">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                  <small className="text-muted">Confirmed bookings</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="row chart-section">
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">
                  Performance Overview
                </h6>
              </div>
              <div className="card-body">
                <div className="chart-area">
                  <div className="performance-overview">
                    <PerformanceChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <footer className="sticky-footer bg-white">
        <div className="container my-auto">
          <div className="copyright text-center my-auto">
            <span>Copyright &copy; sunbeam@2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;
