import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/PassengerDetails.css';

const PassengerDetails = () => {
  const navigate = useNavigate();
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([]);
  const [errors, setErrors] = useState({});
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load booking data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('flightBookingData');
    if (!storedData) {
      navigate('/flights');
      return;
    }

    try {
      setBookingData(JSON.parse(storedData));
      const savedPassengers = sessionStorage.getItem('flightBooking_passengers');
      if (savedPassengers) {
        const parsedPassengers = JSON.parse(savedPassengers);
        setPassengers(parsedPassengers);
        setPassengerCount(parsedPassengers.length);
      }
    } catch (error) {
      console.error("Error parsing booking data:", error);
      navigate('/customer/flightlist');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Initialize or update passengers array
  useEffect(() => {
    if (!bookingData) return;

    if (passengers.length === 0) {
      const newPassengers = Array(passengerCount).fill().map((_, i) => ({
        id: Date.now() + i,
        title: '',
        firstName: '',
        lastName: '',
        mobile: '',
        dob: '',
        gender: '',
        passport: ''
      }));
      setPassengers(newPassengers);
    } else if (passengerCount > passengers.length) {
      const newPassengers = Array(passengerCount - passengers.length)
        .fill()
        .map((_, i) => ({
          id: Date.now() + passengers.length + i,
          title: '',
          firstName: '',
          lastName: '',
          mobile: '',
          dob: '',
          gender: '',
          passport: ''
        }));
      setPassengers([...passengers, ...newPassengers]);
    } else if (passengerCount < passengers.length) {
      setPassengers(passengers.slice(0, passengerCount));
    }
  }, [passengerCount, bookingData, passengers.length]);

  // Validate individual passenger data
  const validatePassenger = (passenger) => {
    const errors = {};

    if (!passenger.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!passenger.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (passenger.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!passenger.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (passenger.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!passenger.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(passenger.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    if (!passenger.dob) {
      errors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const birthDate = new Date(passenger.dob);
      if (birthDate >= today) {
        errors.dob = 'Date of birth must be in the past';
      }
    }

    if (!passenger.gender.trim()) {
      errors.gender = 'Gender is required';
    }

    if (!passenger.passport.trim()) {
      errors.passport = 'Passport number is required';
    } else if (passenger.passport.length < 6) {
      errors.passport = 'Passport number must be at least 6 characters';
    }

    return errors;
  };

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);

    // Clear error for this field if it exists
    if (errors[index]?.[field]) {
      const updatedErrors = { ...errors };
      if (updatedErrors[index]) {
        delete updatedErrors[index][field];
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
      }
      setErrors(updatedErrors);
    }

    // Save to sessionStorage
    sessionStorage.setItem('flightBooking_passengers', JSON.stringify(updatedPassengers));
  };

  // Handle form submission
  const handleSubmit = () => {
    const newErrors = {};
    let hasErrors = false;

    passengers.forEach((passenger, index) => {
      const passengerErrors = validatePassenger(passenger);
      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      // Save passenger data and navigate to payment
      sessionStorage.setItem('flightBooking_passengers', JSON.stringify(passengers));
      navigate('/customer/bookingpreview');
    } else {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.error');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="passenger-details-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Show error if no booking data
  if (!bookingData) {
    return (
      <div className="passenger-details-container">
        <div className="error-message">No booking data found. Please start a new search.</div>
      </div>
    );
  }

  return (
    <div className="passenger-details-container">
      {/* Header Section */}
      <div className="passenger-header">
        <h2>Passenger Information</h2>
        <div className="passenger-counter">
          <button 
            onClick={() => setPassengerCount(p => Math.max(1, p - 1))}
            disabled={passengerCount <= 1}
            aria-label="Decrease passenger count"
          >
            −
          </button>
          <span>{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
          <button 
            onClick={() => setPassengerCount(p => Math.min(10, p + 1))}
            disabled={passengerCount >= 10}
            aria-label="Increase passenger count"
          >
            +
          </button>
        </div>
      </div>

      {/* Passenger Cards Grid */}
      <div className="passenger-cards-grid">
        {passengers.map((passenger, index) => (
          <div key={passenger.id} className="passenger-card">
            <div className="card-header">
              <h3>Passenger {index + 1}</h3>
            </div>
            
            {/* Personal Information Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`title-${index}`}>Title*</label>
                <select
                  id={`title-${index}`}
                  value={passenger.title}
                  onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                  className={errors[index]?.title ? 'error' : ''}
                  required
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                {errors[index]?.title && <span className="error-message">{errors[index].title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor={`firstName-${index}`}>First Name*</label>
                <input
                  id={`firstName-${index}`}
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                  className={errors[index]?.firstName ? 'error' : ''}
                  required
                />
                {errors[index]?.firstName && <span className="error-message">{errors[index].firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor={`lastName-${index}`}>Last Name*</label>
                <input
                  id={`lastName-${index}`}
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                  className={errors[index]?.lastName ? 'error' : ''}
                  required
                />
                {errors[index]?.lastName && <span className="error-message">{errors[index].lastName}</span>}
              </div>
            </div>

            {/* Contact Information Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`mobile-${index}`}>Mobile*</label>
                <div className="input-with-prefix">
                  <span>+91</span>
                  <input
                    id={`mobile-${index}`}
                    type="tel"
                    value={passenger.mobile}
                    onChange={(e) => handleInputChange(index, 'mobile', e.target.value.replace(/\D/g, ''))}
                    className={errors[index]?.mobile ? 'error' : ''}
                    required
                    maxLength="10"
                    placeholder="Mobile number"
                  />
                </div>
                {errors[index]?.mobile && <span className="error-message">{errors[index].mobile}</span>}
              </div>

              <div className="form-group">
                <label htmlFor={`dob-${index}`}>Date of Birth*</label>
                <input
                  id={`dob-${index}`}
                  type="date"
                  value={passenger.dob}
                  onChange={(e) => handleInputChange(index, 'dob', e.target.value)}
                  className={errors[index]?.dob ? 'error' : ''}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors[index]?.dob && <span className="error-message">{errors[index].dob}</span>}
              </div>

              <div className="form-group">
                <label htmlFor={`gender-${index}`}>Gender*</label>
                <select
                  id={`gender-${index}`}
                  value={passenger.gender}
                  onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                  className={errors[index]?.gender ? 'error' : ''}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors[index]?.gender && <span className="error-message">{errors[index].gender}</span>}
              </div>
            </div>

            {/* Passport Information */}
            <div className="form-group full-width">
              <label htmlFor={`passport-${index}`}>Passport Number*</label>
              <input
                id={`passport-${index}`}
                type="text"
                value={passenger.passport}
                onChange={(e) => handleInputChange(index, 'passport', e.target.value.toUpperCase())}
                className={errors[index]?.passport ? 'error' : ''}
                required
                placeholder="Passport number"
              />
              {errors[index]?.passport && <span className="error-message">{errors[index].passport}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button 
          type="button" 
          className="secondary-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button 
          type="button" 
          className="primary-button"
          onClick={handleSubmit}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;