import React, { useEffect, useState } from "react";
import "../../styles/AirlineManagement.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { deactivateAirline, fetchAllAirlines } from "../../services/admin/airlineManagementServies";
import { toast } from "react-toastify";

const AirlineManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allAirlines, setAllAirlines] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = (id) => {
    console.log("Edit airline with id:", id);
    // Edit logic would go here
  };

  const navigate = useNavigate();

  const handleDelete = async(id) => {
    try {
      await deactivateAirline(id);
      toast.success("Airline deleted successfully");
      setAllAirlines((current) =>
        current.filter((airline) => (airline.airlineId || airline.id) !== id)
      );
      setAirlines((current) =>
        current.filter((airline) => (airline.airlineId || airline.id) !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete airline");
    }
  };

  const handleAddNew = () => {
    navigate("/admin/addairline");
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setAirlines(allAirlines);
      return;
    }

    const filteredAirlines = allAirlines.filter((airline) =>
      (airline.airlineName || airline.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAirlines(filteredAirlines);
  };

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAirlines();
      const activeAirlines = data.filter(
        (airline) => !airline.status || airline.status === "ACTIVE"
      );
      setAllAirlines(activeAirlines);
      setAirlines(activeAirlines);
    } catch (error) {
      console.error("Error fetching airlines:", error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  return (
    <>
      <div className="airline-card">
        <button onClick={handleAddNew} className="add-new-btn">
          ADD NEW AIRLINE
        </button>
        <h1 className="airline-heading">Airline Details</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search airlines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>

        {/* Airlines table */}
        <div className="table-container">
          {loading && <div className="alert alert-info">Loading airlines...</div>}
          <table className="airline-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Airline Name</th>
                <th>No. of Flights</th>
                <th>Make Changes</th>
                <th>Added Date</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline, index) => (
                <tr key={airline.airlineId || airline.id}>
                  <td>{index + 1}</td>
                  <td>{airline.airlineName || airline.name}</td>
                  <td>{airline.noOfFlights || airline.flightCount || 0}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEdit(airline.airlineId || airline.id)}
                      className="edit-btn"
                    >
                      Add Flight
                    </button>
                    <button
                      onClick={() => handleDelete(airline.airlineId || airline.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                  <td>{airline.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AirlineManagement;
