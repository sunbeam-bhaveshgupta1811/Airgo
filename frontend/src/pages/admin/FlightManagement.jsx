import React, { useState, useEffect } from "react";
import "../../styles/FlightDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllFlights, deactivateFlight } from "../../services/admin/AddFlightService";

const FlightManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allFlights, setAllFlights] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadFlights = async () => {
    try {
      setLoading(true);
      const data = await fetchAllFlights();
      setAllFlights(data);
      setFlights(data);
    } catch (error) {
      toast.error("Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setFlights(allFlights);
      return;
    }
    const filtered = allFlights.filter(
      (f) =>
        (f.flightNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.airlineName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFlights(filtered);
  };

  const handleSchedule = (flightId) => {
    navigate("/admin/addscheduleflight");
  };

  const handleRemove = async (id) => {
    try {
      await deactivateFlight(id);
      toast.success("Flight deactivated successfully");
      setAllFlights((prev) => prev.filter((f) => f.id !== id));
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to deactivate flight";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="flight-card">
        <button
          onClick={() => navigate("/admin/addscheduleflight")}
          className="flight-action-btn"
        >
          ADD NEW SCHEDULE
        </button>

        <h1 className="flight-heading">Flight Details</h1>

        <div className="flight-search-container">
          <input
            type="text"
            placeholder="Search by flight number or airline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flight-search-input"
          />
          <button onClick={handleSearch} className="flight-search-btn">
            Search
          </button>
        </div>

        <div className="flight-table-container">
          {loading && <div className="alert alert-info">Loading flights...</div>}
          <table className="flight-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Flight No</th>
                <th>Airline</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Make Changes</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 && !loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No flights found
                  </td>
                </tr>
              ) : (
                flights.map((flight, index) => (
                  <tr key={flight.id}>
                    <td>{index + 1}</td>
                    <td>{flight.flightNumber}</td>
                    <td>{flight.airlineName}</td>
                    <td>{flight.originCode} - {flight.originCity}</td>
                    <td>{flight.destinationCode} - {flight.destinationCity}</td>
                    <td>
                      {flight.durationMinutes
                        ? `${Math.floor(flight.durationMinutes / 60)}h ${flight.durationMinutes % 60}m`
                        : "N/A"}
                    </td>
                    <td>
                      <span className={`badge ${flight.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                        {flight.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        onClick={() => handleSchedule(flight.id)}
                        className="schedule-btn"
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => handleRemove(flight.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FlightManagement;
