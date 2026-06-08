import React, { useState } from "react";
import "../../styles/FlightDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";


const FlightManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [flights, setFlights] = useState([
    {
      id: 1,
      airline: "Emirates",
      flightNo: "EK589",
      economySeats: 200,
      firstClassSeats: 20,
      businessSeats: 50,
      dateAdded: "2023-05-15",
    },
    {
      id: 2,
      airline: "Qatar Airways",
      flightNo: "QR782",
      economySeats: 180,
      firstClassSeats: 15,
      businessSeats: 40,
      dateAdded: "2023-06-22",
    },
    {
      id: 3,
      airline: "Singapore Airlines",
      flightNo: "SQ321",
      economySeats: 220,
      firstClassSeats: 25,
      businessSeats: 60,
      dateAdded: "2023-04-10",
    },
  ]);
  
  const navigate = useNavigate()

  const addNewFlight = () =>{
    navigate("/admin/addscheduleflight")
  }

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Actual search/filter logic would go here
  };

  const handleEdit = (id) => {
    console.log("Edit flight with id:", id);
  };

  const handleSchedule = (id) => {
    console.log("Schedule flight with id:", id);
  };

  const handleRemove = (id) => {
    console.log("Remove flight with id:", id);
    setFlights(flights.filter((flight) => flight.id !== id));
  };

  return (
    <>
      <div className="flight-card">
        {/* Top right button */}
        <button 
        onClick={addNewFlight}
        className="flight-action-btn">ADD NEW FLIGHT</button>

        {/* Heading */}
        <h1 className="flight-heading">Flight Details</h1>

        {/* Search bar */}
        <div className="flight-search-container">
          <input
            type="text"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flight-search-input"
          />
          <button onClick={handleSearch} className="flight-search-btn">
            Search
          </button>
        </div>

        {/* Flights table */}
        <div className="flight-table-container">
          <table className="flight-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Airline Name</th>
                <th>Flight No.</th>
                <th>Economy Seats</th>
                <th>First Class</th>
                <th>Business Class</th>
                <th>Total Seats</th>
                <th>Make Changes</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={flight.id}>
                  <td>{index + 1}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.flightNo}</td>
                  <td>{flight.economySeats}</td>
                  <td>{flight.firstClassSeats}</td>
                  <td>{flight.businessSeats}</td>
                  <td>
                    {flight.economySeats +
                      flight.firstClassSeats +
                      flight.businessSeats}
                  </td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEdit(flight.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FlightManagement;
