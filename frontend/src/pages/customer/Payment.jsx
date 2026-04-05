// Fixed Payment.jsx - Comprehensive null value prevention

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheckCircle, FaRupeeSign } from 'react-icons/fa';
import { processPayment } from '../../services/customerService/bookingService';
import '../../css/Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [bookingData, setBookingData] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    try {
      let flightData = null;
      let passengerData = null;
      let calculatedTotal = 0;

      if (location.state?.bookingDetails) {
        const { bookingDetails } = location.state;
        flightData = bookingDetails.flightData || bookingDetails;
        passengerData = bookingDetails.passengers || [];
        calculatedTotal = location.state.totalPrice || 0;
      } else {
        const storedFlightData = sessionStorage.getItem('flightBookingData');
        const storedPassengers = sessionStorage.getItem('flightBooking_passengers');
        const storedFinalBooking = sessionStorage.getItem('finalBookingData');

        if (storedFinalBooking) {
          const finalBooking = JSON.parse(storedFinalBooking);
          flightData = {
            flight: finalBooking.flight || {},
            classType: finalBooking.classType || 'ECONOMY',
            selectedPrice: finalBooking.selectedPrice || 0,
            searchParams: finalBooking.searchParams || {}
          };
          passengerData = finalBooking.passengers || [];
          calculatedTotal = finalBooking.totalPrice || 0;
        } else if (storedFlightData && storedPassengers) {
          flightData = JSON.parse(storedFlightData);
          passengerData = JSON.parse(storedPassengers) || [];
          calculatedTotal = passengerData.length * (flightData.selectedPrice || 0);
        }
      }

      // Enhanced validation with null checks
      if (!flightData || !passengerData || !Array.isArray(passengerData) || passengerData.length === 0) {
        console.error('Missing or invalid booking data:', { flightData, passengerData });
        navigate('/customer/flightlist');
        return;
      }

      // Validate passengers data
      const validPassengers = passengerData.filter(passenger => 
        passenger && 
        typeof passenger === 'object' && 
        passenger.firstName && 
        passenger.lastName
      );

      if (validPassengers.length === 0) {
        console.error('No valid passengers found:', passengerData);
        navigate('/customer/flightlist');
        return;
      }

      console.log('Valid Flight Data:', flightData);
      console.log('Valid Passengers:', validPassengers);

      setBookingData(flightData);
      setPassengers(validPassengers);
      setTotalPrice(calculatedTotal || 0);
    } catch (error) {
      console.error('Error loading booking data:', error);
      navigate('/customer/flightlist');
    }
  }, [navigate, location.state]);

  // Enhanced helper function with comprehensive null checks
  const extractFlightData = (bookingData) => {
    console.log('Extracting flight data from:', bookingData);
    
    if (!bookingData) {
      console.error('Booking data is null or undefined');
      return null;
    }
    
    let flightObj = null;
    
    // Priority 1: Check if bookingData.flight exists and has flightNumber
    if (bookingData.flight && bookingData.flight.flightNumber) {
      flightObj = { ...bookingData.flight };
    }
    // Priority 2: Check if bookingData itself is the flight object
    else if (bookingData.flightNumber) {
      flightObj = { ...bookingData };
    }
    // Priority 3: Check nested flightData
    else if (bookingData.flightData && bookingData.flightData.flightNumber) {
      flightObj = { ...bookingData.flightData };
    }
    // Priority 4: Try to construct from available fields
    else {
      flightObj = {
        flightNumber: bookingData.flightNumber || null,
        airline: bookingData.airline || null,
        source: bookingData.source || bookingData.from || null,
        destination: bookingData.destination || bookingData.to || null,
        departureDate: bookingData.departureDate || bookingData.date || null,
        departureTime: bookingData.departureTime || bookingData.time || null,
        arrivalDate: bookingData.arrivalDate || null,
        arrivalTime: bookingData.arrivalTime || null,
        price: bookingData.price || bookingData.selectedPrice || 0,
        id: bookingData.id || bookingData.flightId || null
      };
    }
    
    // Ensure essential fields are not null
    if (flightObj) {
      flightObj = {
        ...flightObj,
        flightNumber: flightObj.flightNumber || 'UNKNOWN',
        airline: flightObj.airline || 'Unknown Airline',
        source: flightObj.source || 'Unknown Source',
        destination: flightObj.destination || 'Unknown Destination',
        departureDate: flightObj.departureDate || new Date().toISOString().split('T')[0],
        departureTime: flightObj.departureTime || '00:00',
        arrivalDate: flightObj.arrivalDate || new Date().toISOString().split('T')[0],
        arrivalTime: flightObj.arrivalTime || '00:00',
        price: flightObj.price || 0,
        id: flightObj.id || `temp_${Date.now()}`
      };
    }
    
    console.log('Final flight object:', flightObj);
    
    // Final validation
    if (!flightObj || !flightObj.flightNumber || flightObj.flightNumber === 'UNKNOWN') {
      console.error('Invalid flight object - missing critical data:', flightObj);
      return null;
    }
    
    return flightObj;
  };

  const validateCardNumber = (number) => /^\d{13,19}$/.test(number.replace(/\s/g, ''));
  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);
  const validateUPI = (upiId) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(upiId);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = v.match(/\d{4,16}/g);
    const parts = [];
    const matched = match && match[0] || '';
    for (let i = 0; i < matched.length; i += 4) parts.push(matched.substring(i, i + 4));
    return parts.join(' ');
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value || '';

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.length > 19) return;
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    } else if (name === 'cardholderName') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleUpiChange = (e) => {
    const value = (e.target.value || '').toLowerCase();
    setUpiId(value);

    if (validationErrors.upiId) {
      setValidationErrors((prev) => ({ ...prev, upiId: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (paymentMethod === 'card') {
      if (!cardDetails.cardholderName || !cardDetails.cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }
      if (!cardDetails.cardNumber || !cardDetails.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!validateCardNumber(cardDetails.cardNumber)) {
        errors.cardNumber = 'Invalid card number';
      }
      if (!cardDetails.expiryMonth) errors.expiryMonth = 'Expiry month is required';
      if (!cardDetails.expiryYear) errors.expiryYear = 'Expiry year is required';
      if (cardDetails.expiryMonth && cardDetails.expiryYear) {
        const currentDate = new Date();
        const cardExpiry = new Date(cardDetails.expiryYear, cardDetails.expiryMonth - 1);
        if (cardExpiry < currentDate) errors.expiryMonth = 'Card has expired';
      }
      if (!cardDetails.cvv || !cardDetails.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!validateCVV(cardDetails.cvv)) {
        errors.cvv = 'Invalid CVV';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.trim()) errors.upiId = 'UPI ID is required';
      else if (!validateUPI(upiId)) errors.upiId = 'Invalid UPI ID';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateTransactionId = () => `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const handleBack = () => navigate(-1);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    // Enhanced flight data extraction with null safety
    const flightData = extractFlightData(bookingData);
    
    if (!flightData) {
      setError('Flight information is incomplete or invalid. Please go back and select flight again.');
      console.error('Cannot extract valid flight data from:', bookingData);
      return;
    }

    // Validate passengers before proceeding
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      setError('Passenger information is missing. Please go back and add passengers.');
      return;
    }

    // Ensure each passenger has required fields
    const validatedPassengers = passengers.map((passenger, index) => ({
      firstName: passenger.firstName || `Passenger${index + 1}`,
      lastName: passenger.lastName || 'Unknown',
      age: passenger.age || 0,
      gender: passenger.gender || 'OTHER',
      email: passenger.email || null,
      phone: passenger.phone || null,
      seatNumber: passenger.seatNumber || null,
      specialRequests: passenger.specialRequests || null
    }));

    console.log('Validated flight data:', flightData);
    console.log('Validated passengers:', validatedPassengers);

    setIsProcessing(true);

    try {
      // Construct payment data with comprehensive null safety
      const paymentData = {
        bookingDetails: {
          flight: flightData,
          classType: bookingData?.classType || 'ECONOMY',
          passengers: validatedPassengers,
          totalPrice: totalPrice || 0,
          searchParams: bookingData?.searchParams || {
            from: flightData.source,
            to: flightData.destination,
            departureDate: flightData.departureDate,
            passengers: validatedPassengers.length
          },
          specialRequests: bookingData?.specialRequests || '',
          notes: bookingData?.notes || '',
          departureDate: flightData.departureDate,
          arrivalDate: flightData.arrivalDate
        },
        paymentInfo: {
          method: (paymentMethod || 'CARD').toUpperCase(),
          transactionId: generateTransactionId(),
          amount: totalPrice || 0,
          currency: 'INR',
          details: paymentMethod === 'card'
            ? {
                cardNumber: '****' + (cardDetails.cardNumber || '').replace(/\s/g, '').slice(-4),
                cardholderName: cardDetails.cardholderName || 'Unknown'
              }
            : {
                upiId: upiId || 'unknown@upi'
              }
        }
      };

      console.log('Payment data being sent:', JSON.stringify(paymentData, null, 2));

      const bookingConfirmation = await processPayment(paymentData);
      
      console.log('Booking confirmation received:', bookingConfirmation);

      if (!bookingConfirmation || !bookingConfirmation.booking) {
        throw new Error('Invalid booking confirmation received');
      }

      // Store booking confirmation with null safety
      sessionStorage.setItem('bookingConfirmation', JSON.stringify(bookingConfirmation));
      
      // Clear temporary booking data
      sessionStorage.removeItem('flightBookingData');
      sessionStorage.removeItem('flightBooking_passengers');
      sessionStorage.removeItem('finalBookingData');

      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/customer/ticketpage', {
          state: {
            booking: bookingConfirmation.booking,
            bookingId: bookingConfirmation.booking?.id || bookingConfirmation.booking?.bookingId || 'unknown',
            fromPayment: true
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData || !passengers || passengers.length === 0) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-success">
          <FaCheckCircle className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Your booking has been confirmed. Redirecting to ticket...</p>
          <div className="booking-summary">
            <p><strong>Amount Paid:</strong> ₹{(totalPrice || 0).toLocaleString()}</p>
            <p><strong>Passengers:</strong> {passengers.length}</p>
            <p><strong>Flight:</strong> {bookingData?.flight?.flightNumber || bookingData?.flightNumber || 'Unknown'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>PAYMENT</h1>
        {error && <div className="error-message">{error}</div>}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px'}}>
            <strong>Debug Info:</strong><br/>
            Flight Number: {bookingData?.flight?.flightNumber || bookingData?.flightNumber || 'Missing'}<br/>
            Class Type: {bookingData?.classType || 'Missing'}<br/>
            Passengers: {passengers.length}<br/>
            Total Price: ₹{(totalPrice || 0).toLocaleString()}
          </div>
        )}

        <div className="payment-methods">
          <div className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
            <FaCreditCard className="method-icon" />
            <span>Card</span>
          </div>
          <div className={`method-tab ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>
            <FaRupeeSign className="method-icon" />
            <span>UPI</span>
          </div>
        </div>

        <div className="divider" />
        <div className="total-fare-box">
          <span>Total Fare:</span>
          <span>₹{(totalPrice || 0).toLocaleString()}</span>
        </div>

        {paymentMethod === 'card' ? (
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>Cardholder Name*</label>
              <input
                type="text"
                name="cardholderName"
                value={cardDetails.cardholderName || ''}
                onChange={handleCardInputChange}
                className={validationErrors.cardholderName ? 'error' : ''}
                required
              />
              {validationErrors.cardholderName && <span className="error-text">{validationErrors.cardholderName}</span>}
            </div>

            <div className="form-group">
              <label>Card Number*</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber || ''}
                onChange={handleCardInputChange}
                maxLength="19"
                className={validationErrors.cardNumber ? 'error' : ''}
                required
              />
              {validationErrors.cardNumber && <span className="error-text">{validationErrors.cardNumber}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month*</label>
                <select name="expiryMonth" value={cardDetails.expiryMonth || ''} onChange={handleCardInputChange} required>
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {validationErrors.expiryMonth && <span className="error-text">{validationErrors.expiryMonth}</span>}
              </div>

              <div className="form-group">
                <label>Expiry Year*</label>
                <select name="expiryYear" value={cardDetails.expiryYear || ''} onChange={handleCardInputChange} required>
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                {validationErrors.expiryYear && <span className="error-text">{validationErrors.expiryYear}</span>}
              </div>

              <div className="form-group">
                <label>CVV*</label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv || ''}
                  onChange={handleCardInputChange}
                  maxLength="4"
                  className={validationErrors.cvv ? 'error' : ''}
                  required
                />
                {validationErrors.cvv && <span className="error-text">{validationErrors.cvv}</span>}
              </div>
            </div>

            <div className="security-note">
              <FaLock className="lock-icon" />
              <span>Secured Payment</span>
            </div>

            <button type="submit" className="pay-button" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${(totalPrice || 0).toLocaleString()}`}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="payment-form">
            <div className="form-group">
              <label>UPI ID*</label>
              <input
                type="text"
                value={upiId || ''}
                onChange={handleUpiChange}
                className={validationErrors.upiId ? 'error' : ''}
                required
              />
              <p className="upi-example">e.g. username@paytm</p>
              {validationErrors.upiId && <span className="error-text">{validationErrors.upiId}</span>}
            </div>

            <div className="security-note">
              <FaLock className="lock-icon" />
              <span>Secured Payment</span>
            </div>

            <button type="submit" className="pay-button" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay ₹${(totalPrice || 0).toLocaleString()}`}
            </button>
          </form>
        )}

        <button type="button" className="back-button" onClick={handleBack}>
          Back to Preview
        </button>
      </div>
    </div>
  );
};

export default Payment;