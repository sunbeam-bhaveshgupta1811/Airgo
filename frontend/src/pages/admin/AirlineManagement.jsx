import React, { useEffect, useState } from "react";
import "../../css/AirlineManagement.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./../../components/AdminNavbar";
import { data, useNavigate } from "react-router-dom";
import { fetchAirline } from "../../services/AdminServices/airlineManagementServies";
import { deleteAirline } from './../../services/AdminServices/airlineManagementServies';
import { toast } from "react-toastify";

const AirlineManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/addscheduleflight`);
  };

  const handleDelete = async(id) => {
    const result = await deleteAirline(id);
    if(result){
      toast.success("successful delete")
    }else{
      toast.error("failed delete")
    }
  };

  const handleAddNew = () => {
    navigate("/admin/addairline");
  };

  const handleSearch = () => {
    if (!searchTerm) {
      fetchAirlines();
      return;
    }

    const filteredAirlines = airlines.filter((airline) =>
      airline.airlineName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAirlines(filteredAirlines);
  };

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      const data = await fetchAirline();
      setAirlines(data);
    } catch (error) {
      console.error("Error fetching airlines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  if (loading && searchTerm.trim() === "") {
    fetchAirline().then((data) => setAirlines(data));
  }

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
                <tr key={airline.airlineId}>
                  <td>{index + 1}</td>
                  <td>{airline.airlineName}</td>
                  <td>{airline.noOfFlights}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEdit(airline.airlineId)}
                      className="edit-btn"
                    >
                      Add Flight
                    </button>
                    <button
                      onClick={() => handleDelete(airline.airlineId)}
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
