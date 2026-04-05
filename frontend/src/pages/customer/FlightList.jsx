import React, { useState, useMemo, useEffect } from 'react';
import { FaPlane, FaClock, FaChair, FaArrowLeft, FaFilter, FaSort, FaStar, FaWifi, FaUtensils } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/FlightList.css';
import "bootstrap/dist/css/bootstrap.min.css";

const FlightList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flights = location.state?.flights || [];
  const searchParams = location.state?.searchParams || {};

  // State for filters and sorting
  const [sortBy, setSortBy] = useState('price'); // price, duration, departure
  const [filterBy, setFilterBy] = useState({
    maxPrice: '',
    airlines: [],
    classTypes: [],
    timeOfDay: 'all' // morning, afternoon, evening, all
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get unique airlines for filter
  const uniqueAirlines = useMemo(() => {
    return [...new Set(flights.map(flight => flight.airline))];
  }, [flights]);

  // Filter and sort flights
  const filteredAndSortedFlights = useMemo(() => {
    let filtered = [...flights];

    // Apply filters
    if (filterBy.maxPrice) {
      filtered = filtered.filter(flight => 
        Math.min(...Object.values(flight.prices)) <= parseInt(filterBy.maxPrice)
      );
    }

    if (filterBy.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filterBy.airlines.includes(flight.airline)
      );
    }

    if (filterBy.timeOfDay !== 'all') {
      filtered = filtered.filter(flight => {
        const hour = parseInt(flight.departureTime.split(':')[0]);
        switch (filterBy.timeOfDay) {
          case 'morning': return hour < 12;
          case 'afternoon': return hour >= 12 && hour < 18;
          case 'evening': return hour >= 18;
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return Math.min(...Object.values(a.prices)) - Math.min(...Object.values(b.prices));
        case 'duration':
          const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]?.replace('m', '') || 0);
          const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]?.replace('m', '') || 0);
          return aDuration - bDuration;
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filterBy, sortBy]);

  const handleSelect = async (flight, classType) => {
    setLoading(true);
    setSelectedFlight({ flight, classType });

    try {
      // Simulate API call or validation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prepare complete booking data
      const bookingData = {
        flight: {
          id: flight.id,
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          source: flight.source,
          destination: flight.destination,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          duration: flight.duration,
          prices: flight.prices,
          seatsAvailable: flight.seatsAvailable,
          amenities: flight.amenities || []
        },
        classType: classType,
        searchParams: searchParams,
        selectedPrice: flight.prices[classType.toLowerCase()],
        selectedSeats: flight.seatsAvailable[classType.toLowerCase()],
        timestamp: new Date().toISOString()
      };

      // Store complete booking data
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('flightBookingData', JSON.stringify(bookingData));
      }
      
      // Navigate to passenger details
      navigate('/customer/passengerdetails', { state: { bookingData } });
    } catch (error) {
      console.error('Error selecting flight:', error);
      alert('There was an error selecting this flight. Please try again.');
    } finally {
      setLoading(false);
      setSelectedFlight(null);
    }
  };

  const handleFilterChange = (type, value) => {
    setFilterBy(prev => {
      if (type === 'airlines') {
        const airlines = prev.airlines.includes(value)
          ? prev.airlines.filter(a => a !== value)
          : [...prev.airlines, value];
        return { ...prev, airlines };
      }
      return { ...prev, [type]: value };
    });
  };

  const clearFilters = () => {
    setFilterBy({
      maxPrice: '',
      airlines: [],
      classTypes: [],
      timeOfDay: 'all'
    });
  };

  const formatClassType = (type) => {
    switch (type) {
      case 'firstClass': return 'First Class';
      case 'business': return 'Business';
      case 'premium': return 'Premium Economy';
      case 'economy': return 'Economy';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getClassIcon = (type) => {
    switch (type) {
      case 'firstClass': return 'text-warning';
      case 'business': return 'text-info';
      case 'premium': return 'text-success';
      default: return 'text-secondary';
    }
  };

  const renderAmenities = (amenities = []) => {
    const amenityIcons = {
      wifi: <FaWifi className="text-primary" title="WiFi Available" />,
      meals: <FaUtensils className="text-success" title="Meals Included" />,
      entertainment: <FaStar className="text-warning" title="Entertainment System" />
    };

    return (
      <div className="amenities d-flex gap-2 mt-2">
        {amenities.map((amenity, idx) => (
          <span key={idx} className="amenity-icon">
            {amenityIcons[amenity] || amenity}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="compact-flight-list container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          <FaArrowLeft className="me-2" />
          Back to Search
        </button>
        <div className="text-center">
          <h2>Available Flights</h2>
          <small className="text-muted">
            {searchParams.from} → {searchParams.to} | {searchParams.departDate}
            {searchParams.passengers && ` | ${searchParams.passengers} passenger(s)`}
          </small>
        </div>
        <div className="d-flex gap-2">
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Sort by:</label>
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="duration">Duration (Short to Long)</option>
                  <option value="departure">Departure Time</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Max Price:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter max price"
                  value={filterBy.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Time of Day:</label>
                <select 
                  className="form-select"
                  value={filterBy.timeOfDay}
                  onChange={(e) => handleFilterChange('timeOfDay', e.target.value)}
                >
                  <option value="all">All Times</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                  <option value="evening">Evening (6 PM - 12 AM)</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Airlines:</label>
                <div className="mt-2">
                  {uniqueAirlines.slice(0, 3).map(airline => (
                    <div key={airline} className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={filterBy.airlines.includes(airline)}
                        onChange={() => handleFilterChange('airlines', airline)}
                      />
                      <label className="form-check-label small">
                        {airline}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
              <span className="ms-3 text-muted">
                Showing {filteredAndSortedFlights.length} of {flights.length} flights
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Flight Results */}
      {filteredAndSortedFlights.length === 0 ? (
        <div className="alert alert-info text-center">
          <h5>No flights found</h5>
          <p>Try adjusting your filters or search criteria.</p>
          {(filterBy.maxPrice || filterBy.airlines.length > 0 || filterBy.timeOfDay !== 'all') && (
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="compact-flights-container">
          {filteredAndSortedFlights.map((flight, index) => (
            <div key={`${flight.id}-${index}`} className="compact-flight-card card mb-4 shadow-sm">
              <div className="compact-flight-header card-header d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaPlane className="compact-flight-icon me-2 text-primary" />
                  <span className="compact-flight-number fw-bold me-3">{flight.flightNumber}</span>
                  <span className="compact-airline text-muted">{flight.airline}</span>
                </div>
                {flight.rating && (
                  <div className="flight-rating">
                    <FaStar className="text-warning me-1" />
                    <span className="small">{flight.rating}</span>
                  </div>
                )}
              </div>

              <div className="compact-route-info card-body">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div className="compact-route-section text-center">
                      <span className="compact-city fw-bold d-block">{flight.source}</span>
                      <span className="compact-time text-primary fs-5">{flight.departureTime}</span>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="compact-route-separator text-center">
                      <div className="compact-duration mb-2">
                        <FaClock className="compact-duration-icon me-1" />
                        <span className="fw-semibold">{flight.duration}</span>
                      </div>
                      <div className="compact-flight-line position-relative">
                        <div className="flight-path"></div>
                        <FaPlane className="flight-icon-path" />
                      </div>
                      {flight.stops && (
                        <small className="text-muted">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="compact-route-section text-center">
                      <span className="compact-city fw-bold d-block">{flight.destination}</span>
                      <span className="compact-time text-primary fs-5">{flight.arrivalTime}</span>
                    </div>
                  </div>
                </div>

                {flight.amenities && renderAmenities(flight.amenities)}
              </div>

              <div className="compact-class-options card-footer bg-light">
                {Object.entries(flight.prices).map(([type, price]) => (
                  <div key={type} className="compact-class-option border rounded p-3 mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="compact-class-info d-flex align-items-center">
                        <FaChair className={`compact-class-icon me-2 ${getClassIcon(type)}`} />
                        <div>
                          <span className="compact-class-name fw-bold d-block">
                            {formatClassType(type)}
                          </span>
                          <span className="compact-price text-success fw-bold fs-5">
                            ₹{price.toLocaleString()}
                          </span>
                          <small className={`d-block ${flight.seatsAvailable[type] < 10 ? 'text-danger' : 'text-muted'}`}>
                            {flight.seatsAvailable[type]} seats available
                          </small>
                        </div>
                      </div>
                      
                      <button
                        className={`compact-select-btn btn ${
                          flight.seatsAvailable[type] <= 0 
                            ? 'btn-secondary' 
                            : loading && selectedFlight?.flight.id === flight.id && selectedFlight?.classType === type
                              ? 'btn-primary'
                              : 'btn-primary'
                        }`}
                        onClick={() => handleSelect(flight, type)}
                        disabled={
                          flight.seatsAvailable[type] <= 0 || 
                          (loading && selectedFlight?.flight.id === flight.id && selectedFlight?.classType === type)
                        }
                      >
                        {flight.seatsAvailable[type] <= 0 
                          ? 'Sold Out'
                          : loading && selectedFlight?.flight.id === flight.id && selectedFlight?.classType === type
                            ? 'Selecting...'
                            : 'Select Flight'
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{zIndex: 1050}}>
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightList;