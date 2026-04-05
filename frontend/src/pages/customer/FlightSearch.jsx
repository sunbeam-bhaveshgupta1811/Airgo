import React, { useState } from 'react';
import { FaPlane, FaSearch } from 'react-icons/fa';
import '../../css/FlightSearch.css';
import { useNavigate } from 'react-router-dom';
import { searchFlights } from '../../services/customerService/flightSearchService';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const calculateDuration = (departureTime, arrivalTime) => {
    const dep = new Date(`2000-01-01T${departureTime}`);
    const arr = new Date(`2000-01-01T${arrivalTime}`);
    if (arr < dep) arr.setDate(arr.getDate() + 1);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const customerSearchFlight = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const flights = await searchFlights(from, to, departureDate);
      navigate('/flightlist', { state: { flights } });

      const apiFlights = await searchFlights(from, to, departureDate);
      if (!apiFlights || apiFlights.length === 0) {
        alert('No flights found for your search criteria.');
        return;
      }

      const transformedFlights = apiFlights.map((flight) => ({
        flightNumber: flight.flightNo,
        airline: flight.airlineName,
        source: flight.fromLocation,
        destination: flight.toLocation,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: calculateDuration(flight.departureTime, flight.arrivalTime),
        prices: {
          economy: flight.economyFare,
          business: flight.businessFare,
          firstClass: flight.firstFare,
        },
        seatsAvailable: {
          economy: flight.availableEconomySeats,
          business: flight.availableBusinessSeats,
          firstClass: flight.availableFirstSeats,
        },
      }));

      navigate('/customer/flightlist', { state: { flights: transformedFlights } });
    } catch (error) {
      alert('Failed to fetch flights. Please try again.');
      console.error('Flight search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flight-search-container">
      <div className="hero-section">
        <div className="booking-card">
          <div className="booking-header">
            <FaPlane className="booking-icon" />
            <h2>Book A Flight</h2>
          </div>

          <form className="booking-form" onSubmit={customerSearchFlight}>
            <div className="form-row">
              <div className="form-group">
                <div className="input-container">
                  <label>From</label>
                  <input
                    type="text"
                    placeholder="Enter departure city"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="booking-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <label>To</label>
                  <input
                    type="text"
                    placeholder="Enter destination city"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="booking-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <label>Departure Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="booking-input"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="search-btn" disabled={isSearching}>
              <FaSearch className="search-icon" />
              {isSearching ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
