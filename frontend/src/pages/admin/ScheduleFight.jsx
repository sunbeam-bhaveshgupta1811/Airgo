import React, { useState, useEffect } from "react";
import { Button, Table, Form, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { config } from "../../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  },
});

function ScheduleFight() {
  const [search, setSearch] = useState("");
  const [allSchedules, setAllSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.serverURL}/admin/schedules`,
        getAuthHeaders()
      );
      const data = response.data?.data || [];
      setAllSchedules(data);
      setSchedules(data);
    } catch (error) {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleSearch = () => {
    if (!search) {
      setSchedules(allSchedules);
      return;
    }
    const filtered = allSchedules.filter(
      (s) =>
        (s.flightNumber || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.airlineName || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.originCity || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.destinationCity || "").toLowerCase().includes(search.toLowerCase())
    );
    setSchedules(filtered);
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `${config.serverURL}/admin/schedules/${id}/cancel`,
        {},
        getAuthHeaders()
      );
      toast.success("Schedule cancelled successfully");
      loadSchedules();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel schedule";
      toast.error(msg);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-primary";
      case "DEPARTED":
        return "bg-warning text-dark";
      case "ARRIVED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Scheduled Flight Details</h3>
        <Button
          variant="warning"
          onClick={() => navigate("/admin/addscheduleflight")}
        >
          + Schedule New Flight
        </Button>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by flight number, airline, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </InputGroup>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Loading schedules...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive className="mt-3 text-center">
          <thead className="table-dark">
            <tr>
              <th>Sr.No</th>
              <th>Flight No</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price (₹)</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="11">No schedules found</td>
              </tr>
            ) : (
              schedules.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.flightNumber}</td>
                  <td>{s.airlineName}</td>
                  <td>
                    {s.originAirportCode} → {s.destinationAirportCode}
                  </td>
                  <td>{s.journeyDate}</td>
                  <td>{s.departureTime}</td>
                  <td>{s.arrivalTime}</td>
                  <td>₹{Number(s.price).toLocaleString("en-IN")}</td>
                  <td>
                    {s.availableSeats}/{s.totalSeats}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    {s.status === "SCHEDULED" && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(s.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default ScheduleFight;
