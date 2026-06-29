import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaChevronDown } from 'react-icons/fa';
import '../../styles/FlightSearch.css';
import { useNavigate } from 'react-router-dom';
import { searchFlights, fetchAirports, searchRoundTripFlights } from '../../services/customer/flightSearchService';
import { toast } from 'react-toastify';

const FlightSearch = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [tripType, setTripType] = useState('ONE_WAY');
  const [returnDate, setReturnDate] = useState('');
  const [travelClass, setTravelClass] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('CHEAPEST');

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
      if (tripType === 'ROUND_TRIP') {
        if (!returnDate) {
          toast.error('Please select a return date for round trip.');
          setIsSearching(false);
          return;
        }

        const result = await searchRoundTripFlights(from, to, departureDate, returnDate, passengerCount, {
          travelClass, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sortBy
        });

        const transformFlights = (flights) => (flights || []).map((flight) => ({
          id: flight.id,
          scheduleId: flight.id,
          flightNumber: flight.flightNumber,
          airline: flight.airlineName,
          source: flight.originCity,
          destination: flight.destinationCity,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          duration: flight.durationFormatted || calculateDuration(flight.departureTime, flight.arrivalTime),
          journeyDate: flight.journeyDate || departureDate,
          prices: { economy: flight.price },
          seatsAvailable: { economy: flight.availableSeats },
        }));

        const outbound = transformFlights(result.outboundFlights);
        const returnFlts = transformFlights(result.returnFlights);

        if (outbound.length === 0 && returnFlts.length === 0) {
          toast.info('No flights found for your round trip search.');
          setIsSearching(false);
          return;
        }

        navigate('/customer/flightlist', {
          state: {
            flights: outbound,
            returnFlights: returnFlts,
            isRoundTrip: true,
            searchParams: { from, to, departDate: departureDate, returnDate, passengers: passengerCount },
          },
        });
      } else {
        const flights = await searchFlights(from, to, departureDate, passengerCount, {
          travelClass, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, sortBy,
          tripType, returnDate: undefined
        });

        if (!flights || flights.length === 0) {
          toast.info('No flights found for your search criteria.');
          setIsSearching(false);
          return;
        }

        const transformedFlights = flights.map((flight) => ({
          id: flight.id,
          scheduleId: flight.id,
          flightNumber: flight.flightNumber,
          airline: flight.airlineName,
          source: flight.originCity,
          destination: flight.destinationCity,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          duration: flight.durationFormatted || calculateDuration(flight.departureTime, flight.arrivalTime),
          journeyDate: flight.journeyDate || departureDate,
          prices: { economy: flight.price },
          seatsAvailable: { economy: flight.availableSeats },
        }));

        navigate('/customer/flightlist', {
          state: {
            flights: transformedFlights,
            searchParams: { from, to, departDate: departureDate, passengers: passengerCount },
          },
        });
      }
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
              <label>Departure</label>
              <div className="date-input">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '16px', background: 'transparent', cursor: 'pointer', padding: 0 }}
                />
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

          {/* Advanced Filters */}
          <div className="mt-3 p-4" style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <p className="fw-bold mb-3" style={{ fontSize: '0.95rem', color: '#0f172a' }}>Advanced Filters</p>
            <div className="row g-3">
              <div className="col-md-4">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Trip Type</label>
                <select className="form-select" value={tripType} onChange={(e) => setTripType(e.target.value)}
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50, background: '#f8fafc' }}>
                  <option value="ONE_WAY">One Way</option>
                  <option value="ROUND_TRIP">Round Trip</option>
                </select>
              </div>
              {tripType === 'ROUND_TRIP' && (
                <div className="col-md-4">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Return Date</label>
                  <input type="date" className="form-control" value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)} min={departureDate || new Date().toISOString().split('T')[0]}
                    style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50 }} />
                </div>
              )}
              <div className="col-md-4">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Class</label>
                <select className="form-select" value={travelClass} onChange={(e) => setTravelClass(e.target.value)}
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50, background: '#f8fafc' }}>
                  <option value="">All Classes</option>
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST_CLASS">First Class</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Min Price (₹)</label>
                <input type="number" className="form-control" placeholder="2,000" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50 }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Max Price (₹)</label>
                <input type="number" className="form-control" placeholder="50,000" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50 }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: 8, display: 'block' }}>Sort By</label>
                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  style={{ borderRadius: 10, padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '0.95rem', height: 50, background: '#f8fafc' }}>
                  <option value="CHEAPEST">Cheapest</option>
                  <option value="FASTEST">Fastest</option>
                  <option value="EARLIEST">Earliest</option>
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
