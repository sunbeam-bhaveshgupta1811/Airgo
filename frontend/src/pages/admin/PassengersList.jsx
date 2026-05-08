import React, { useState } from "react";
import "../../css/PassengerList.css";
import "bootstrap/dist/css/bootstrap.min.css";

const PassengersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const passengers = [
    {
      id: 1,
      name: "John Doe",
      mobile: "+1 555-123-4567",
      dob: "1985-05-15",
      gender: "Male",
      booking: "FL-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      mobile: "+1 555-987-6543",
      dob: "1990-08-22",
      gender: "Female",
      booking: "FL-6543",
    },
    {
      id: 3,
      name: "Robert Johnson",
      mobile: "+1 555-456-7890",
      dob: "1978-11-30",
      gender: "Male",
      booking: "FL-3210",
    },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Filter logic would go here
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    console.log("Filter changed to:", e.target.value);
  };

  return (
    <>
      <div className="passengers-card">
        <div className="top-right-controls">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="filter-dropdown"
          >
            <option value="all">All Passengers</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Heading */}
        <h1 className="passengers-heading">Passengers</h1>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search passengers..."
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
          <table className="passengers-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Booking</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={passenger.id}>
                  <td>{index + 1}</td>
                  <td>{passenger.name}</td>
                  <td>{passenger.mobile}</td>
                  <td>{passenger.dob}</td>
                  <td>{passenger.gender}</td>
                  <td>{passenger.booking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PassengersList;
