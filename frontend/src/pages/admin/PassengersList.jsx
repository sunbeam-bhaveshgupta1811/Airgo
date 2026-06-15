import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import "../../styles/PassengerList.css";
import "bootstrap/dist/css/bootstrap.min.css";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("jwt");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const PassengersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPassengers, setAllPassengers] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.serverURL}/admin/bookings`,
        getAuthHeaders()
      );
      const bookings = response.data?.data || [];

      // Flatten: extract each passenger from each booking
      const passengerList = [];
      bookings.forEach((booking) => {
        if (booking.passengers && booking.passengers.length > 0) {
          booking.passengers.forEach((p) => {
            passengerList.push({
              id: p.id,
              name: `${p.firstName} ${p.lastName}`,
              gender: p.gender,
              dob: p.dateOfBirth,
              seatNumber: p.seatNumber || "Not Assigned",
              booking: booking.bookingReference,
              flightNumber: booking.flightNumber,
              status: booking.status,
            });
          });
        }
      });

      setAllPassengers(passengerList);
      setPassengers(passengerList);
    } catch (error) {
      console.error("Error fetching passengers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) {
      setPassengers(allPassengers);
      return;
    }

    const filtered = allPassengers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.booking.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPassengers(filtered);
  };

  return (
    <>
      <div className="passengers-card">
        {/* Heading */}
        <h1 className="passengers-heading">Passengers</h1>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, booking ref, or flight..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>

        {/* Passengers table */}
        <div className="table-container">
          {loading && (
            <div className="alert alert-info">Loading passengers...</div>
          )}
          <table className="passengers-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Name</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Seat</th>
                <th>Flight</th>
                <th>Booking Ref</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={passenger.id}>
                  <td>{index + 1}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.gender}</td>
                  <td>{passenger.dob}</td>
                  <td>{passenger.seatNumber}</td>
                  <td>{passenger.flightNumber}</td>
                  <td>{passenger.booking}</td>
                  <td>{passenger.status}</td>
                </tr>
              ))}
              {!loading && passengers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No passengers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PassengersList;
