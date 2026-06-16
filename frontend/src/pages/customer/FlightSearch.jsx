import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaChevronDown } from 'react-icons/fa';
import '../../styles/FlightSearch.css';
import { useNavigate } from 'react-router-dom';
import { searchFlights, fetchAirports } from '../../services/customer/flightSearchService';
import { toast } from 'react-toastify';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadAirports = async () => {
      try {
        const data = await fetchAirports();
        setAirports(data);
      } catch {
        // Airports will just be empty, user can still type codes manually
      }
    };
    loadAirports();
  }, []);

  const filteredDestinations = airports.filter(
    (a) => a.code !== from
  );

  const calculateDuration = (departureTime, arrivalTime) => {
    const dep = new Date(`2000-01-01T${departureTime}`);
    const arr = new Date(`2000-01-01T${arrivalTime}`);
    if (arr < dep) arr.setDate(arr.getDate() + 1);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, year, dayName };
  };

  const customerSearchFlight = async (e) => {
    e.preventDefault();
    if (from === to) {
      toast.error('Origin and destination cannot be the same.');
      return;
    }

    setIsSearching(true);

    try {
      const flights = await searchFlights(from, to, departureDate, passengerCount);

      if (!flights || flights.length === 0) {
        toast.info('No flights found for your search criteria.');
        return;
      }

      const transformedFlights = flights.map((flight) => ({
        id: flight.scheduleId || flight.id,
        scheduleId: flight.scheduleId || flight.id,
        flightNumber: flight.flightNo || flight.flightNumber,
        airline: flight.airlineName,
        source: flight.fromLocation || flight.originCity,
        destination: flight.toLocation || flight.destinationCity,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: calculateDuration(flight.departureTime, flight.arrivalTime),
        journeyDate: flight.journeyDate || departureDate,
        prices: {
          economy: flight.economyFare || flight.price,
          business: flight.businessFare,
          firstClass: flight.firstFare,
        },
        seatsAvailable: {
          economy: flight.availableEconomySeats || flight.availableSeats,
          business: flight.availableBusinessSeats,
          firstClass: flight.availableFirstSeats,
        },
      }));

      navigate('/customer/flightlist', {
        state: {
          flights: transformedFlights,
          searchParams: {
            from,
            to,
            departDate: departureDate,
            passengers: passengerCount,
          },
        },
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="modern-flight-search">
      <div className="search-container">
        {/* Main Search Form */}
        <form onSubmit={customerSearchFlight} className="search-form">
          <div className="search-fields-row">
            {/* From Field */}
            <div className="search-field from-field">
              <label>From</label>
              <div className="city-input">
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', background: 'transparent', cursor: 'pointer' }}
                >
                  <option value="">-- Select Origin --</option>
                  {airports.map((airport) => (
                    <option key={`from-${airport.id}`} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="swap-button-container">
              <button type="button" className="swap-btn" onClick={swapCities}>
                <FaExchangeAlt />
              </button>
            </div>

            {/* To Field */}
            <div className="search-field to-field">
              <label>To</label>
              <div className="city-input">
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  disabled={!from}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', background: 'transparent', cursor: 'pointer' }}
                >
                  <option value="">-- Select Destination --</option>
                  {filteredDestinations.map((airport) => (
                    <option key={`to-${airport.id}`} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departure Date */}
            <div className="search-field date-field">
              <label>Departure <FaChevronDown className="dropdown-icon" /></label>
              <div className="date-input">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="date-display">
                  {departureDate ? (
                    <>
                      <span className="date-number">{formatDate(departureDate).day}</span>
                      <span className="date-month">{formatDate(departureDate).month}'{formatDate(departureDate).year}</span>
                      <span className="date-day">{formatDate(departureDate).dayName}</span>
                    </>
                  ) : (
                    <span className="date-placeholder">Select date</span>
                  )}
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="search-field travelers-field">
              <label>Travellers</label>
              <div className="travelers-input">
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Traveller' : 'Travellers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-button-container">
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? 'SEARCHING...' : 'SEARCH'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightSearch;
