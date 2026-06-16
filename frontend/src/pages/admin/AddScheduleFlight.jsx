
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
});

const ScheduleFlight = () => {
  const [formData, setFormData] = useState({
    flightId: '',
    journeyDate: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    totalSeats: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [airlines, setAirlines] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [airlinesRes, flightsRes] = await Promise.all([
          axios.get(`${config.serverURL}/admin/airlines`, getAuthHeaders()),
          axios.get(`${config.serverURL}/admin/flights`, getAuthHeaders()),
        ]);

        setAirlines(airlinesRes.data?.data || []);
        setFlights(flightsRes.data?.data || []);
      } catch (error) {
        toast.error('Failed to load airlines and flights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAirlineChange = (e) => {
    setSelectedAirline(e.target.value);
    setFormData((prev) => ({ ...prev, flightId: '' }));
  };

  const validateForm = () => {
    if (!selectedAirline) {
      toast.error('Please select an airline');
      return false;
    }
    if (!formData.flightId) {
      toast.error('Please select a flight');
      return false;
    }
    if (!formData.journeyDate) {
      toast.error('Please select a journey date');
      return false;
    }
    if (formData.arrivalTime && formData.departureTime && formData.arrivalTime <= formData.departureTime) {
      toast.error('Arrival time must be after departure time');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    if (!formData.totalSeats || Number(formData.totalSeats) < 1) {
      toast.error('Total seats must be at least 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        flightId: Number(formData.flightId),
        journeyDate: formData.journeyDate,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        price: Number(formData.price),
        totalSeats: Number(formData.totalSeats),
      };

      await axios.post(
        `${config.serverURL}/admin/schedules`,
        payload,
        getAuthHeaders()
      );

      toast.success('Flight scheduled successfully!');
      navigate('/admin/scheduleflight');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to schedule flight';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFlights = selectedAirline
    ? flights.filter((f) => String(f.airlineId) === String(selectedAirline))
    : [];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Schedule Flight</h2>

      {isLoading && airlines.length === 0 ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Airline Selection */}
            <div className="col-md-6">
              <label className="form-label">Select Airline</label>
              <select
                className="form-select"
                value={selectedAirline}
                onChange={handleAirlineChange}
                required
              >
                <option value="">-- Select Airline --</option>
                {airlines.map((airline) => (
                  <option key={airline.id} value={airline.id}>
                    {airline.name} ({airline.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Flight Selection */}
            <div className="col-md-6">
              <label className="form-label">Select Flight</label>
              <select
                className="form-select"
                name="flightId"
                value={formData.flightId}
                onChange={handleChange}
                required
                disabled={!selectedAirline}
              >
                <option value="">-- Select Flight --</option>
                {filteredFlights.map((flight) => (
                  <option key={flight.id} value={flight.id}>
                    {flight.flightNumber} ({flight.originCode} → {flight.destinationCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Journey Date */}
            <div className="col-md-6">
              <label className="form-label">Journey Date</label>
              <input
                type="date"
                className="form-control"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Total Seats */}
            <div className="col-md-6">
              <label className="form-label">Total Seats</label>
              <input
                type="number"
                className="form-control"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                min="1"
                max="180"
                required
              />
            </div>

            {/* Departure Time */}
            <div className="col-md-6">
              <label className="form-label">Departure Time</label>
              <input
                type="time"
                className="form-control"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Arrival Time */}
            <div className="col-md-6">
              <label className="form-label">Arrival Time</label>
              <input
                type="time"
                className="form-control"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label">Price per Seat (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="1"
                step="100"
                required
              />
            </div>

            {/* Submit */}
            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Scheduling...
                  </>
                ) : (
                  'Schedule Flight'
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ScheduleFlight;
