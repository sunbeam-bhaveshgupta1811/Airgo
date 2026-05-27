import React, { useState } from "react";
import { Button, Table, Form, InputGroup, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function AddFlight() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    flightDate: "",
    hasEconomy: true,
    hasBusiness: true,
    hasFirstClass: true,
    economySeats: "",
    businessSeats: "",
    firstClassSeats: "",
    source: "",
    destination: "",
    departureDateTime: "",
    arrivalDateTime: "",
    economyCost: "",
    businessCost: "",
    firstClassCost: ""
  });

  const flights = [
    {
      id: 40,
      airline: "Emirates",
      flightNo: 102,
      src: "NSK",
      dest: "BOM",
      adt: "2024-05-22 23:30:00",
      ddt: "2024-05-23 01:25:00",
      cec: 1002,
      cbc: 8002,
      cfc: 5002,
      status: "",
    },
    {
      id: 50,
      airline: "bke",
      flightNo: 103,
      src: "NSK",
      dest: "BOM",
      adt: "2024-05-22 23:30:00",
      ddt: "2024-05-23 01:25:00",
      cec: 1002,
      cbc: 8002,
      cfc: 5002,
      status: "",
    },
  ];

  const airlines = [
    { id: "AI", name: "Air India" },
    { id: "SG", name: "SpiceJet" },
    { id: "I5", name: "AirAsia India" },
    { id: "6E", name: "IndiGo" }
  ];

  const airports = [
    { code: "NSK", name: "Nashik" },
    { code: "BOM", name: "Mumbai" },
    { code: "DEL", name: "Delhi" },
    { code: "BLR", name: "Bangalore" }
  ];

  const filteredFlights = flights.filter((flight) =>
    flight.flightNo.toString().includes(search)
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Flight scheduled:", formData);
    setShowModal(false);
  };

  const navigate = useNavigate()

  const addflightscheduler = () =>{
    navigate("/admin/scheduleflight")
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Add Schedule Flight</h3>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by flight number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="outline-secondary">Search</Button>
      </InputGroup>
      <small className="text-muted">Search flight details using flight number</small>

      <Table striped bordered hover responsive className="mt-3 text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Airline</th>
            <th>Flight No</th>
            <th>From</th>
            <th>To</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Economy</th>
            <th>Business</th>
            <th>First Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredFlights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.id}</td>
              <td>{flight.airline}</td>
              <td>{flight.flightNo}</td>
              <td>{flight.src}</td>
              <td>{flight.dest}</td>
              <td>{flight.adt}</td>
              <td>{flight.ddt}</td>
              <td>₹{flight.cec}</td>
              <td>{flight.cbc }</td>
              <td>{flight.cfc }</td>
              <td>
                <Button
                onClick={addflightscheduler}
                >
                <span className="badge bg-primary">Scheduled</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Flight Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Flight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label>Airline</Form.Label>
                <Form.Select
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Airline</option>
                  {airlines.map(airline => (
                    <option key={airline.id} value={airline.id}>{airline.name}</option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Flight Number</Form.Label>
                <Form.Control
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label>Source</Form.Label>
                <Form.Select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Source</option>
                  {airports.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.name} ({airport.code})
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Destination</Form.Label>
                <Form.Select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Destination</option>
                  {airports
                    .filter(airport => airport.code !== formData.source)
                    .map(airport => (
                      <option key={airport.code} value={airport.code}>
                        {airport.name} ({airport.code})
                      </option>
                    ))}
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label>Departure Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="departureDateTime"
                  value={formData.departureDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label>Arrival Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="arrivalDateTime"
                  value={formData.arrivalDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <Form.Check
                  type="checkbox"
                  label="Economy Class"
                  name="hasEconomy"
                  checked={formData.hasEconomy}
                  onChange={handleChange}
                />
                {formData.hasEconomy && (
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <Form.Label>Number of Seats</Form.Label>
                      <Form.Control
                        type="number"
                        name="economySeats"
                        value={formData.economySeats}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <Form.Label>Seat Cost (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="economyCost"
                        value={formData.economyCost}
                        onChange={handleChange}
                        min="0"
                        step="100"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Similar sections for Business and First Class */}

              <div className="col-12 mt-3">
                <Button variant="primary" type="submit">
                  Schedule Flight
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
