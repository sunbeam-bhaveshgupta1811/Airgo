import React, { useState } from 'react';
import { FaPlane, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt, FaUser, FaChevronDown } from 'react-icons/fa';
import { Button, Dropdown, Badge } from 'react-bootstrap';
import '../../css/FlightSearch.css';
import { useNavigate } from 'react-router-dom';
import { searchFlights } from '../../services/customerService/flightSearchService';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 });
  const [travelClass, setTravelClass] = useState('economy');
  const [specialFare, setSpecialFare] = useState('regular');
  const [isSearching, setIsSearching] = useState(false);

  const specialFares = [
    { id: 'regular', label: 'Regular Fares', description: 'Standard ticket prices', badge: null },
    { id: 'senior', label: 'Senior Citizen', description: 'Special discounts for seniors (60+)', badge: '10% OFF' },
    { id: 'student', label: 'Student Discount', description: 'Valid student ID required', badge: '15% OFF' },
    { id: 'family', label: 'Family Package', description: 'Book for 4+ family members', badge: '20% OFF' }
  ];


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

  const getTotalTravelers = () => {
    return travelers.adults + travelers.children + travelers.infants;
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
    setIsSearching(true);

    try {
      const flights = await searchFlights(from, to, departureDate);
      
      if (!flights || flights.length === 0) {
        alert('No flights found for your search criteria.');
        return;
      }

      const transformedFlights = flights.map((flight) => ({
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
    <div className="modern-flight-search">
      <div className="search-container">
        {/* Main Search Form */}
        <form onSubmit={customerSearchFlight} className="search-form">
          <div className="search-fields-row">
            {/* From Field */}
            <div className="search-field from-field">
              <label>From</label>
              <div className="city-input">
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Delhi"
                  required
                />
                <div className="city-details">
                  <span className="city-name">{from || 'Delhi'}</span>
                  <span className="airport-name">DEL, Delhi Airport India</span>
                </div>
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
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Bengaluru"
                  required
                />
                <div className="city-details">
                  <span className="city-name">{to || 'Bengaluru'}</span>
                  <span className="airport-name">BLR, Bengaluru International Airport</span>
                </div>
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
                    <>
                      <span className="date-number">20</span>
                      <span className="date-month">Apr'26</span>
                      <span className="date-day">Monday</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Return Date */}
            {tripType === 'roundtrip' && (
              <div className="search-field date-field">
                <label>Return <FaChevronDown className="dropdown-icon" /></label>
                <div className="date-input">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate || new Date().toISOString().split('T')[0]}
                  />
                  <div className="date-display">
                    {returnDate ? (
                      <>
                        <span className="date-number">{formatDate(returnDate).day}</span>
                        <span className="date-month">{formatDate(returnDate).month}'{formatDate(returnDate).year}</span>
                        <span className="date-day">{formatDate(returnDate).dayName}</span>
                      </>
                    ) : (
                      <div className="add-return">
                        <span>Tap to add a return</span>
                        <span>date for bigger discounts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Travelers & Class */}
            <div className="search-field travelers-field">
              <label>Travellers & Class <FaChevronDown className="dropdown-icon" /></label>
              <div className="travelers-input">
                <div className="travelers-display">
                  <span className="travelers-count">{getTotalTravelers()}</span>
                  <span className="travelers-text">Traveller</span>
                  <span className="class-text">Economy/Premium Economy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Fares */}
          <div className="special-fares-section">
            <div className="special-fares-label">SPECIAL FARES</div>
            <div className="special-fares-options">
              {specialFares.map((fare) => (
                <label key={fare.id} className={`fare-option ${specialFare === fare.id ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="specialFare"
                    value={fare.id}
                    checked={specialFare === fare.id}
                    onChange={(e) => setSpecialFare(e.target.value)}
                  />
                  <div className="fare-content">
                    <span className="fare-label">
                      {fare.label}
                      {fare.badge && <Badge bg="danger" className="ms-1">{fare.badge}</Badge>}
                    </span>
                    <span className="fare-description">{fare.description}</span>
                  </div>
                </label>
              ))}
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