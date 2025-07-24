import React from 'react';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import '../../CSS/FlightSearch.css';
import { useNavigate } from 'react-router-dom';


const FlightSearch = () => {

  const navigate = useNavigate()

  const customerSearchFlight = () =>{
    // make the customer dashboard to have the customer all info about flight
    navigate("/flightlist")
  }



  return (
    <div className="hero-section">
      {/* Flight Booking Card */}
      <div className="booking-card">
        <div className="booking-header">
          <FaPlane className="booking-icon" />
          <h2>Book A Flight</h2>
        </div>
        
        <form className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <FaMapMarkerAlt className="input-icon" />
              <div className="input-container">
                <label>From</label>
                <input 
                  type="text" 
                  placeholder="Enter departure city" 
                  className="booking-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <FaMapMarkerAlt className="input-icon" />
              <div className="input-container">
                <label>To</label>
                <input 
                  type="text" 
                  placeholder="Enter destination city" 
                  className="booking-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <FaCalendarAlt className="input-icon" />
              <div className="input-container">
                <label>Departure Date</label>
                <input 
                  type="date" 
                  className="booking-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <FaUser className="input-icon" />
              <div className="input-container">
                <label>Passengers</label>
                <select className="booking-input">
                  <option value="">Select passengers</option>
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="4+">4+ Passengers</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
          onClick={customerSearchFlight}
           type="submit" className="search-btn">
            <FaSearch className="search-icon" />
            Search Flights
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightSearch;