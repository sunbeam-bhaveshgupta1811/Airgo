import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { config } from "../../config";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  },
});

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: "#fff", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}>
        <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
        <p style={{ margin: "4px 0", color: "#2ecc71" }}>
          Revenue: ₹{Number(payload[0]?.value || 0).toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
}

function PerformanceChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.serverURL}/admin/dashboard/revenue-by-airline`,
          getAuthHeaders()
        );
        const data = response.data?.data || [];
        const formatted = data.map((item) => ({
          airline: item.airline || "Unknown",
          revenue: Number(item.revenue) || 0,
        }));
        setChartData(formatted);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
        <p>No revenue data available yet. Revenue will appear after confirmed bookings.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px 10px",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Revenue by Airline</h3>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="airline" />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="revenue" fill="#2ecc71" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceChart;
