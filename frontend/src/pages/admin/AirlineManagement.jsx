import React, { useEffect, useState } from "react";
import "../../css/AirlineManagement.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminNavbar from "./../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { deleteAirline, fetchAirline } from "../../services/AdminServices/airlineManagementServies";
import { toast } from "react-toastify";

const AirlineManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = (id) => {
    console.log("Edit airline with id:", id);
    // Edit logic would go here
  };

  const navigate = useNavigate();

  const handleDelete = async(id) => {

    const data = await deleteAirline(id);
    // using delete operation here not working properly beause we delete the parent record but still the child record is present in the database
    if(data.error){
      toast.error(data.error);
      return;
    }else{
      toast.success("Airline deleted successfully");
    }

    setAirlines(data.filter((airline) => airline.airlineId !== id));
    setLoading(false);
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
    }finally {
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
