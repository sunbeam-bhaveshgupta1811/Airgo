import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlane, FaClock, FaUserFriends, FaMoneyBillWave } from 'react-icons/fa';
import '../../css/BookingPreview.css';
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to hold booking data
  const [bookingData, setBookingData] = useState({
    flightData: null,
    passengers: [],
    totalPrice: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookingDataFromStorage = () => {
      try {
        // Try to get data from location state first (if navigated with state)
        if (location.state?.bookingDetails) {
          setBookingData({
            flightData: location.state.bookingDetails,
            passengers: location.state.bookingDetails.passengers || [],
            totalPrice: location.state.totalPrice || 0
          });
          setLoading(false);
          return;
        }

        // Get flight booking data from session storage (set by FlightList)
        const storedFlightData = sessionStorage.getItem('flightBookingData');
        // Get passenger data from session storage (set by PassengerDetails)
        const storedPassengers = sessionStorage.getItem('flightBooking_passengers');

        if (!storedFlightData || !storedPassengers) {
          console.error('Missing booking data in session storage');
          navigate('/customer/flightlist');
          return;
        }

        const flightData = JSON.parse(storedFlightData);
        const passengers = JSON.parse(storedPassengers);
        
        // Calculate total price
        const totalPrice = passengers.length * flightData.selectedPrice;

        setBookingData({
          flightData,
          passengers,
          totalPrice
        });

      } catch (error) {
        console.error('Error retrieving data from session storage:', error);
        navigate('/customer/flightlist');
        return;
      }
      
      setLoading(false);
    };

    getBookingDataFromStorage();
  }, [location.state, navigate]);

  // Show loading while data is being retrieved
  if (loading) {
    return (
      <div className="booking-preview-page">
        <div className="booking-preview-container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no booking data available, don't render
  if (!bookingData.flightData || !bookingData.passengers.length) {
    return (
      <div className="booking-preview-page">
        <div className="booking-preview-container">
          <div className="alert alert-warning text-center">
            <h4>No Booking Data Found</h4>
            <p>Please start a new flight search.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/customer/flightlist')}
            >
              Search Flights
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { flightData, passengers, totalPrice } = bookingData;
  const { flight, classType, selectedPrice } = flightData;

  // Function to save final booking data to session storage (for payment page)
  const saveFinalBookingToStorage = () => {
    try {
      const finalBookingData = {
        flight,
        classType,
        selectedPrice,
        passengers,
        totalPrice,
        bookingDate: new Date().toISOString(),
        searchParams: flightData.searchParams || {}
      };
      
      sessionStorage.setItem('finalBookingData', JSON.stringify(finalBookingData));
    } catch (error) {
      console.error('Error saving final booking data:', error);
    }
  };

  const handleProceedToPayment = () => {
    // Save final booking data to session storage
    saveFinalBookingToStorage();
    
    // Navigate to payment page
    navigate('/customer/payment', { 
      state: { 
        bookingDetails: bookingData,
        totalPrice 
      } 
    });
  };

  // Format class type for display
  const formatClassType = (classType) => {
    if (classType === 'firstClass') return 'First Class';
    return classType.charAt(0).toUpperCase() + classType.slice(1);
  };

  return (
    <div className="booking-preview-page">
      <div className="booking-preview-container">
        <h2>Booking Preview</h2>
        <p className="subtitle">Please review your booking details before proceeding</p>

        <div className="flight-summary">
          <div className="flight-header">
            <FaPlane className="icon" />
            <h3>Flight Details</h3>
          </div>
          <div className="flight-details">
            <div className="route">
              <span className="city">{flight.source}</span>
              <span className="time">{flight.departureTime}</span>
            </div>
            <div className="duration">
              <FaClock className="icon" />
              <span>{flight.duration}</span>
            </div>
            <div className="route">
              <span className="city">{flight.destination}</span>
              <span className="time">{flight.arrivalTime}</span>
            </div>
          </div>
          <div className="flight-info">
            <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
            <p><strong>Airline:</strong> {flight.airline}</p>
            <p><strong>Class:</strong> {formatClassType(classType)}</p>
            <p><strong>Route:</strong> {flight.source} to {flight.destination}</p>
            {flightData.searchParams?.departureDate && (
              <p><strong>Date:</strong> {new Date(flightData.searchParams.departureDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div className="passengers-summary">
          <div className="passengers-header">
            <FaUserFriends className="icon" />
            <h3>Passenger Details ({passengers.length})</h3>
          </div>
          <div className="passengers-list">
            {passengers.map((passenger, index) => (
              <div key={passenger.id || index} className="passenger-detail">
                <p><strong>Passenger {index + 1}:</strong> {passenger.title} {passenger.firstName} {passenger.lastName}</p>
                <p><strong>Mobile:</strong> +91-{passenger.mobile}</p>
                <p><strong>DOB:</strong> {new Date(passenger.dob).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {passenger.gender}</p>
                <p><strong>Passport:</strong> {passenger.passport}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="price-summary">
          <div className="price-header">
            <FaMoneyBillWave className="icon" />
            <h3>Price Summary</h3>
          </div>
          <div className="price-details">
            <div className="price-row">
              <span>{formatClassType(classType)} Fare (x{passengers.length})</span>
              <span>₹{(selectedPrice * passengers.length).toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Taxes & Fees</span>
              <span>₹0</span>
            </div>
            <div className="price-row">
              <span>Available Seats</span>
              <span>{flight.seatsAvailable[classType]} left</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
          <button 
            className="proceed-button" 
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPreview;