// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { name: "Week 1", bookings: 120, earnings: 58000, passengers: 100, cancelled: 2 },
//   { name: "Week 2", bookings: 135, earnings: 72000, passengers: 110, cancelled: 1 },
//   { name: "Week 3", bookings: 90, earnings: 40000, passengers: 80, cancelled: 4 },
//   { name: "Week 4", bookings: 150, earnings: 80000, passengers: 130, cancelled: 0 },
// ];

// function CustomTooltip({ active, payload, label }) {
//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: 10, border: "1px solid #ccc" }}>
//         <p><strong>{label}</strong></p>
//         <p>Bookings: {payload[0].payload.bookings}</p>
//         <p>Passengers: {payload[0].payload.passengers}</p>
//         <p>Revenue: ${payload[0].payload.earnings.toLocaleString()}</p>
//         <p>Cancelled: {payload[0].payload.cancelled}</p>
//       </div>
//     );
//   }

//   return null;
// }

// function PerformanceChart() {
//   return (
//     <div
//       style={{
//         width: "80%",         // Set chart to 80% of parent width
//         maxWidth: "800px",    // Optional: Limit to 800px
//         margin: "0 auto",     // Center horizontally
//         padding: "20px 10px",
//         boxSizing: "border-box",
//       }}
//     >
//       <h3 style={{ textAlign: "center", marginBottom: 20 }}>Weekly Airline Performance</h3>
//       <div style={{ width: "100%", height: 350 }}>
//         <ResponsiveContainer>
//           <LineChart
//   data={data}
//   margin={{ top: 20, right: 0, left: 10, bottom: 5 }} // <-- left: 10 (or 0)
// >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend verticalAlign="top" height={36} />
//             <Line type="monotone" dataKey="bookings" stroke="#1e90ff" name="Bookings" />
//             <Line type="monotone" dataKey="earnings" stroke="#2ecc71" name="Revenue" />
//             <Line type="monotone" dataKey="passengers" stroke="#f39c12" name="Passengers" />
//             <Line type="monotone" dataKey="cancelled" stroke="#e74c3c" name="Cancellations" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default PerformanceChart;



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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: "#fff", padding: 10, border: "1px solid #ccc" }}>
        <p><strong>{label}</strong></p>
        <p>Bookings: {payload[0].payload.bookings}</p>
        <p>Passengers: {payload[0].payload.passengers}</p>
        <p>Revenue: ₹{payload[0].payload.earnings.toLocaleString()}</p>
        <p>Cancelled: {payload[0].payload.cancelled}</p>
      </div>
    );
  }

  return null;
}

function PerformanceChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/admin/weeklyPerformance") // replace with your actual backend endpoint
      .then((response) => setChartData(response.data))
      .catch((error) => console.error("Error fetching performance data", error));
  }, []);

  return (
    <div
      style={{
        width: "80%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px 10px",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Weekly Airline Performance</h3>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="bookings" fill="#1e90ff" name="Bookings" />
            <Bar dataKey="earnings" fill="#2ecc71" name="Revenue" />
            <Bar dataKey="passengers" fill="#f39c12" name="Passengers" />
            <Bar dataKey="cancelled" fill="#e74c3c" name="Cancellations" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceChart;
