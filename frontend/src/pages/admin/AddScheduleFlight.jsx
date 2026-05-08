
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const ScheduleFlight = () => {
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    flightDate: '',
    hasEconomy: true,
    hasBusiness: true,
    hasFirstClass: true,
    economySeats: '',
    businessSeats: '',
    firstClassSeats: '',
    source: '',
    destination: '',
    departureDateTime: '',
    arrivalDateTime: '',
    economyCost: '',
    businessCost: '',
    firstClassCost: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API calls
        const mockAirlines = [
          { id: 'AI', name: 'Air India' },
          { id: 'SG', name: 'SpiceJet' },
          { id: 'I5', name: 'AirAsia India' },
          { id: '6E', name: 'IndiGo' }
        ];
        
        const mockFlights = [
          { number: 'AI101', airline: 'AI' },
          { number: 'SG202', airline: 'SG' },
          { number: 'I5303', airline: 'I5' },
          { number: '6E404', airline: '6E' }
        ];
        
        const mockAirports = [
          { code: 'NSK', name: 'Nashik' },
          { code: 'BOM', name: 'Mumbai' },
          { code: 'DEL', name: 'Delhi' },
          { code: 'BLR', name: 'Bangalore' }
        ];
        
        setAirlines(mockAirlines);
        setFlights(mockFlights);
        setAirports(mockAirports);
      } catch {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.airline) {
      toast.error('Please select an airline');
      return false;
    }
    
    if (!formData.flightNumber) {
      toast.error('Please select a flight number');
      return false;
    }
    
    if (formData.source === formData.destination) {
      toast.error('Source and destination cannot be the same');
      return false;
    }
    
    if (new Date(formData.arrivalDateTime) <= new Date(formData.departureDateTime)) {
      toast.error('Arrival time must be after departure time');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Replace with actual API call
      console.log('Submitting flight data:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Flight scheduled successfully!');
      navigate('/scheduleflight');
    } catch {
      toast.error('Failed to schedule flight');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFlights = flights.filter(flight => flight.airline === formData.airline);
  const filteredDestinations = airports.filter(airport => airport.code !== formData.source);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Schedule Flight</h2>
      <ToastContainer />
      
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading flight data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Airline Selection */}
            <div className="col-md-6">
              <label className="form-label">Select Airline</label>
              <select
                className="form-select"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Airline --</option>
                {airlines.map(airline => (
                  <option key={airline.id} value={airline.id}>{airline.name}</option>
                ))}
              </select>
            </div>

            {/* Flight Number */}
            <div className="col-md-6">
              <label className="form-label">Select Flight Number</label>
              <select
                className="form-select"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                required
                disabled={!formData.airline}
              >
                <option value="">-- Select Flight --</option>
                {filteredFlights.map(flight => (
                  <option key={flight.number} value={flight.number}>{flight.number}</option>
                ))}
              </select>
            </div>

            {/* Flight Date */}
            <div className="col-md-12">
              <label className="form-label">Flight Date</label>
              <input
                type="date"
                className="form-control"
                name="flightDate"
                value={formData.flightDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Flight Classes */}
            <div className="col-md-12">
              <label className="form-label">Flight Has</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="hasEconomy"
                  checked={formData.hasEconomy}
                  onChange={handleChange}
                  id="economyCheck"
                />
                <label className="form-check-label" htmlFor="economyCheck">
                  Economy Class
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="hasBusiness"
                  checked={formData.hasBusiness}
                  onChange={handleChange}
                  id="businessCheck"
                />
                <label className="form-check-label" htmlFor="businessCheck">
                  Business Class
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="hasFirstClass"
                  checked={formData.hasFirstClass}
                  onChange={handleChange}
                  id="firstClassCheck"
                />
                <label className="form-check-label" htmlFor="firstClassCheck">
                  First Class
                </label>
              </div>
            </div>

            {/* Seats Configuration */}
            {formData.hasEconomy && (
              <div className="col-md-4">
                <label className="form-label">Enter Number of Economy Class Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="economySeats"
                  value={formData.economySeats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            )}

            {formData.hasBusiness && (
              <div className="col-md-4">
                <label className="form-label">Enter Number of Business Class Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="businessSeats"
                  value={formData.businessSeats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            )}

            {formData.hasFirstClass && (
              <div className="col-md-4">
                <label className="form-label">Enter Number of First Class Seats</label>
                <input
                  type="number"
                  className="form-control"
                  name="firstClassSeats"
                  value={formData.firstClassSeats}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            )}

            {/* Source and Destination */}
            <div className="col-md-6">
              <label className="form-label">Select Source</label>
              <select
                className="form-select"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Source --</option>
                {airports.map(airport => (
                  <option key={`src-${airport.code}`} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Destination</label>
              <select
                className="form-select"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                disabled={!formData.source}
              >
                <option value="">-- Select Destination --</option>
                {filteredDestinations.map(airport => (
                  <option key={`dest-${airport.code}`} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="col-md-6">
              <label className="form-label">Select Departure Date-Time of Flight</label>
              <input
                type="datetime-local"
                className="form-control"
                name="departureDateTime"
                value={formData.departureDateTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Select Arrival Date-Time of Flight</label>
              <input
                type="datetime-local"
                className="form-control"
                name="arrivalDateTime"
                value={formData.arrivalDateTime}
                onChange={handleChange}
                required
                min={formData.departureDateTime}
              />
            </div>

            {/* Seat Costs */}
            {formData.hasEconomy && (
              <div className="col-md-4">
                <label className="form-label">Enter Seat Cost for Economy Class (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="economyCost"
                  value={formData.economyCost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                />
              </div>
            )}

            {formData.hasBusiness && (
              <div className="col-md-4">
                <label className="form-label">Enter Seat Cost for Business Class (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="businessCost"
                  value={formData.businessCost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                />
              </div>
            )}

            {formData.hasFirstClass && (
              <div className="col-md-4">
                <label className="form-label">Enter Seat Cost for First Class (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="firstClassCost"
                  value={formData.firstClassCost}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="col-12 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Scheduling...
                  </>
                ) : 'Schedule Flight'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ScheduleFlight;
