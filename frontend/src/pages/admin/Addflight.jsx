import React, { useState, useEffect } from "react";
import { Button, Table, Form, InputGroup, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchAllFlights,
  fetchAirlinesForDropdown,
  fetchAirportsForDropdown,
  createFlight,
} from "../../services/admin/AddFlightService";

function AddFlight() {
  const [search, setSearch] = useState("");
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    flightNumber: "",
    airlineId: "",
    originAirportId: "",
    destinationAirportId: "",
    durationMinutes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [flightData, airlineData, airportData] = await Promise.all([
        fetchAllFlights(),
        fetchAirlinesForDropdown(),
        fetchAirportsForDropdown(),
      ]);
      setFlights(flightData);
      setAirlines(airlineData);
      setAirports(airportData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFlights = flights.filter(
    (flight) =>
      (flight.flightNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (flight.airlineName || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.originAirportId === formData.destinationAirportId) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    setSubmitting(true);
    try {
      await createFlight({
        flightNumber: formData.flightNumber,
        airlineId: Number(formData.airlineId),
        originAirportId: Number(formData.originAirportId),
        destinationAirportId: Number(formData.destinationAirportId),
        durationMinutes: Number(formData.durationMinutes),
      });
      toast.success("Flight added successfully!");
      setShowModal(false);
      setFormData({
        flightNumber: "",
        airlineId: "",
        originAirportId: "",
        destinationAirportId: "",
        durationMinutes: "",
      });
      loadData();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add flight";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDestinations = airports.filter(
    (a) => String(a.id) !== String(formData.originAirportId)
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Flight Management</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add New Flight
        </Button>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by flight number or airline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Loading flights...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive className="mt-3 text-center">
          <thead className="table-dark">
            <tr>
              <th>Sr.No</th>
              <th>Flight No</th>
              <th>Airline</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.length === 0 ? (
              <tr>
                <td colSpan="7">No flights found</td>
              </tr>
            ) : (
              filteredFlights.map((flight, index) => (
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
                    <span
                      className={`badge ${
                        flight.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Add Flight Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Flight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label>Flight Number *</Form.Label>
                <Form.Control
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g. 6E-204"
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label>Airline *</Form.Label>
                <Form.Select
                  name="airlineId"
                  value={formData.airlineId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Airline --</option>
                  {airlines.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                      {airline.name} ({airline.code})
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Origin Airport *</Form.Label>
                <Form.Select
                  name="originAirportId"
                  value={formData.originAirportId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Origin --</option>
                  {airports.map((airport) => (
                    <option key={`origin-${airport.id}`} value={airport.id}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Destination Airport *</Form.Label>
                <Form.Select
                  name="destinationAirportId"
                  value={formData.destinationAirportId}
                  onChange={handleChange}
                  required
                  disabled={!formData.originAirportId}
                >
                  <option value="">-- Select Destination --</option>
                  {filteredDestinations.map((airport) => (
                    <option key={`dest-${airport.id}`} value={airport.id}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Duration (minutes) *</Form.Label>
                <Form.Control
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  placeholder="e.g. 135"
                  min="1"
                  required
                />
              </div>

              <div className="col-12 mt-3 d-flex gap-2">
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Flight"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddFlight;
