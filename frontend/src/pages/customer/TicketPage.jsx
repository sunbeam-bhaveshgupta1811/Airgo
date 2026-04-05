// src/pages/TicketPage.jsx - Corrected version with Print functionality

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeNavbar from '../../components/HomeNavbar';
import {
  FaPlane, FaCheckCircle, FaUser, FaTicketAlt,
  FaMapMarkerAlt, FaRupeeSign, FaDownload, FaEnvelope,
  FaSpinner, FaClock, FaCalendarAlt, FaPrint
} from 'react-icons/fa';
import { 
  getBookingById, 
  sendBookingConfirmationEmail, 
  //generateTicketPDF 
} from '../../services/customerService/ticketService';
import '../../css/TicketPage.css';

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get booking data from navigation state or location state
  const bookingId = location.state?.bookingId || location.state?.booking?.id || location.state?.booking?.bookingId || null;
  const bookingData = location.state?.booking || null;

  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const initializeTicketData = async () => {
      console.log('Initializing ticket data with:', { bookingId, bookingData: !!bookingData });
      
      // Priority 1: Use booking data directly from payment flow
      if (bookingData && Object.keys(bookingData).length > 0) {
        console.log('Using booking data from payment flow:', bookingData);
        const formattedData = formatTicketData(bookingData);
        if (formattedData) {
          setTicketData(formattedData);
          setLoading(false);
          // Store in session storage as backup
          sessionStorage.setItem('bookingConfirmation', JSON.stringify({ booking: bookingData }));
          return;
        }
      }

      // Priority 2: If we have bookingId, fetch from API
      if (bookingId && bookingId !== 'N/A') {
        await fetchTicketFromAPI();
        return;
      }

      // Priority 3: Try to get from session storage as fallback
      await tryFromSessionStorage();
    };

    initializeTicketData();
  }, [bookingId, bookingData]);

  const fetchTicketFromAPI = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching booking with ID:', bookingId);
      const data = await getBookingById(bookingId);
      console.log('API Response:', data);
      
      if (data && Object.keys(data).length > 0) {
        const formattedData = formatTicketData(data);
        if (formattedData) {
          setTicketData(formattedData);
        } else {
          throw new Error('Invalid booking data received');
        }
      } else {
        throw new Error('No booking data found');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError('Failed to load ticket data. Please try again.');
      // Try fallback methods
      await tryFromSessionStorage();
    } finally {
      setLoading(false);
    }
  };

  const tryFromSessionStorage = async () => {
    try {
      const storedConfirmation = sessionStorage.getItem('bookingConfirmation');
      if (storedConfirmation) {
        const confirmation = JSON.parse(storedConfirmation);
        console.log('Using stored booking confirmation:', confirmation);
        
        // Handle different storage formats
        const bookingToFormat = confirmation.booking || confirmation;
        const formattedData = formatTicketData(bookingToFormat);
        
        if (formattedData) {
          setTicketData(formattedData);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error parsing stored confirmation:', error);
    }
    
    setError('No booking information found. Please try booking again.');
    setLoading(false);
  };

  // Enhanced format function to handle different response structures
  const formatTicketData = (bookingData) => {
    if (!bookingData || typeof bookingData !== 'object') {
      console.error('Invalid booking data:', bookingData);
      return null;
    }

    console.log('Formatting booking data:', bookingData);

    try {
      // Extract flight data from various possible structures
      const flightData = bookingData.flight || bookingData.flightData || bookingData;
      
      // Extract passenger data
      const passengerData = bookingData.passengers || [];
      
      return {
        bookingId: bookingData.bookingId || bookingData.id || bookingData._id || 'N/A',
        bookingDate: bookingData.bookingDate || bookingData.createdAt || bookingData.created_at || new Date().toISOString(),
        pnr: bookingData.pnr || bookingData.bookingReference || bookingData.transactionId || null,
        
        // Flight details with multiple fallback options
        flightNumber: flightData?.flightNumber || flightData?.flight_number || bookingData.flightNumber || 'N/A',
        airline: flightData?.airline || flightData?.airlineName || bookingData.airline || 'N/A',
        source: flightData?.source || flightData?.from || flightData?.departure || bookingData.source || 'N/A',
        destination: flightData?.destination || flightData?.to || flightData?.arrival || bookingData.destination || 'N/A',
        departureDate: formatDate(flightData?.departureDate || flightData?.departure_date || bookingData.departureDate),
        departureTime: formatTime(flightData?.departureTime || flightData?.departure_time || bookingData.departureTime),
        arrivalDate: formatDate(flightData?.arrivalDate || flightData?.arrival_date || bookingData.arrivalDate),
        arrivalTime: formatTime(flightData?.arrivalTime || flightData?.arrival_time || bookingData.arrivalTime),
        
        // Passenger details
        passengers: Array.isArray(passengerData) ? passengerData.map(formatPassenger) : [],
        totalPassengers: bookingData.totalPassengers || passengerData?.length || 0,
        
        // Payment details
        totalFare: parseFloat(
          bookingData.totalFare || 
          bookingData.totalAmount || 
          bookingData.amount || 
          bookingData.price || 
          0
        ),
        paymentMethod: formatPaymentMethod(bookingData.paymentMethod || bookingData.payment_method),
        paymentStatus: formatPaymentStatus(bookingData.paymentStatus || bookingData.payment_status),
        transactionId: bookingData.transactionId || bookingData.transaction_id || null,
        
        // Additional details
        classType: formatClassType(bookingData.classType || bookingData.class || flightData?.classType),
        bookingStatus: formatBookingStatus(bookingData.bookingStatus || bookingData.status),
        specialRequests: bookingData.specialRequests || bookingData.special_requests || null,
        notes: bookingData.notes || bookingData.remarks || null
      };
    } catch (error) {
      console.error('Error formatting ticket data:', error);
      return null;
    }
  };

  // Helper function to format passenger data
  const formatPassenger = (passenger) => {
    if (!passenger || typeof passenger !== 'object') return null;
    
    return {
      name: passenger.name || `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim() || 'N/A',
      firstName: passenger.firstName || null,
      lastName: passenger.lastName || null,
      age: passenger.age || null,
      gender: passenger.gender || null,
      seatNumber: passenger.seatNumber || passenger.seat || null,
      specialRequests: passenger.specialRequests || null
    };
  };

  // Helper formatting functions with null safety
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr || 'N/A';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      // Handle both "HH:MM:SS" and "HH:MM" formats
      const timeString = String(timeStr);
      if (timeString.length === 8 && timeString.includes(':')) {
        return timeString.substring(0, 5); // Remove seconds
      }
      if (timeString.length >= 5 && timeString.includes(':')) {
        return timeString.substring(0, 5);
      }
      return timeString;
    } catch {
      return timeStr || 'N/A';
    }
  };

  const formatPaymentMethod = (method) => {
    if (!method) return 'Card';
    const methodStr = String(method);
    return methodStr.charAt(0).toUpperCase() + methodStr.slice(1).toLowerCase();
  };

  const formatPaymentStatus = (status) => {
    if (!status) return 'Confirmed';
    const statusStr = String(status);
    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
  };

  const formatClassType = (classType) => {
    if (!classType) return 'Economy';
    const classStr = String(classType);
    return classStr.charAt(0).toUpperCase() + classStr.slice(1).toLowerCase();
  };

  const formatBookingStatus = (status) => {
    if (!status) return 'CONFIRMED';
    return String(status).toUpperCase();
  };

  // Print ticket functionality
  const handlePrintTicket = () => {
    setIsPrinting(true);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      setError('Please enable popups to print the ticket');
      setIsPrinting(false);
      return;
    }

    const printContent = generatePrintHTML();
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          setIsPrinting(false);
          setSuccessMessage('Ticket sent to printer successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
        };
        
        // Fallback to close window if onafterprint doesn't fire
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
          setIsPrinting(false);
        }, 2000);
      }, 500);
    };
  };

  // Generate HTML content for printing
  const generatePrintHTML = () => {
    if (!ticketData) return '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flight Ticket - ${ticketData.bookingId}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            background: white;
          }
          .print-ticket { 
            max-width: 800px; 
            margin: 0 auto;
            border: 2px solid #007bff;
            border-radius: 10px;
            overflow: hidden;
          }
          .print-header { 
            background: #007bff; 
            color: white; 
            padding: 20px; 
            text-align: center;
          }
          .print-header h1 { margin: 0; font-size: 24px; }
          .print-header p { margin: 5px 0 0 0; }
          .print-section { 
            padding: 15px 20px; 
            border-bottom: 1px solid #eee;
          }
          .print-section:last-child { border-bottom: none; }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            color: #007bff;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 5px 0;
            border-bottom: 1px dotted #ccc;
          }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: bold; }
          .flight-route { 
            text-align: center; 
            font-size: 18px; 
            font-weight: bold;
            margin: 15px 0;
            color: #007bff;
          }
          .passenger-item { 
            background: #f8f9fa; 
            padding: 10px; 
            margin: 5px 0;
            border-radius: 5px;
          }
          .total-amount { 
            font-size: 18px; 
            font-weight: bold; 
            color: #28a745;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
          }
          .status { 
            padding: 3px 8px; 
            border-radius: 3px; 
            font-size: 12px;
            font-weight: bold;
          }
          .status.confirmed { background: #d4edda; color: #155724; }
          .print-footer { 
            background: #f8f9fa; 
            padding: 15px 20px; 
            text-align: center;
            font-style: italic;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="print-ticket">
          <div class="print-header">
            <h1>✈️ E-TICKET</h1>
            <p>Booking Confirmation</p>
          </div>
          
          <div class="print-section">
            <div class="section-title">Booking Information</div>
            <div class="info-row">
              <span class="info-label">Booking ID:</span>
              <span>${ticketData.bookingId}</span>
            </div>
            ${ticketData.pnr ? `
            <div class="info-row">
              <span class="info-label">PNR:</span>
              <span>${ticketData.pnr}</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="info-label">Booking Date:</span>
              <span>${ticketData.bookingDate}</span>
            </div>
            ${ticketData.transactionId ? `
            <div class="info-row">
              <span class="info-label">Transaction ID:</span>
              <span>${ticketData.transactionId}</span>
            </div>
            ` : ''}
          </div>

          <div class="print-section">
            <div class="section-title">✈️ Flight Details</div>
            <div class="flight-route">
              ${ticketData.source} ✈️ ${ticketData.destination}
            </div>
            <div class="info-row">
              <span class="info-label">Flight Number:</span>
              <span>${ticketData.flightNumber}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Airline:</span>
              <span>${ticketData.airline}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Departure:</span>
              <span>${ticketData.departureDate} at ${ticketData.departureTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Arrival:</span>
              <span>${ticketData.arrivalDate} at ${ticketData.arrivalTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class:</span>
              <span>${ticketData.classType}</span>
            </div>
          </div>

          <div class="print-section">
            <div class="section-title">👥 Passenger Details</div>
            ${ticketData.passengers && ticketData.passengers.length > 0 
              ? ticketData.passengers.map((passenger, index) => `
                <div class="passenger-item">
                  <strong>Passenger ${index + 1}:</strong> ${passenger.name || 'N/A'}
                  ${passenger.age ? `<br/>Age: ${passenger.age}` : ''}
                  ${passenger.gender ? `, Gender: ${passenger.gender}` : ''}
                  ${passenger.seatNumber ? `<br/>Seat: ${passenger.seatNumber}` : ''}
                </div>
              `).join('')
              : '<div class="passenger-item">Passenger information will be updated</div>'
            }
          </div>

          <div class="print-section">
            <div class="section-title">💳 Payment Details</div>
            <div class="total-amount info-row">
              <span class="info-label">Total Paid:</span>
              <span>₹${ticketData.totalFare?.toLocaleString('en-IN') || '0'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span>${ticketData.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="status confirmed">${ticketData.paymentStatus}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Booking Status:</span>
              <span class="status confirmed">${ticketData.bookingStatus}</span>
            </div>
          </div>

          ${ticketData.specialRequests || ticketData.notes ? `
          <div class="print-section">
            <div class="section-title">📝 Additional Information</div>
            ${ticketData.specialRequests ? `
            <div class="info-row">
              <span class="info-label">Special Requests:</span>
              <span>${ticketData.specialRequests}</span>
            </div>
            ` : ''}
            ${ticketData.notes ? `
            <div class="info-row">
              <span class="info-label">Notes:</span>
              <span>${ticketData.notes}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="print-footer">
            <p>Thank you for choosing our airline service. Please arrive at the airport at least 2 hours before departure.</p>
            <p>This is a computer generated ticket. No signature required.</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadTicket = async () => {
    if (!ticketData?.bookingId || ticketData.bookingId === 'N/A') {
      setError('Booking ID not available for PDF generation');
      return;
    }

    try {
      setPdfGenerating(true);
      setError('');
      
      // Uncomment when generateTicketPDF is implemented
      // const pdfBlob = await generateTicketPDF(ticketData.bookingId);
      
      // For now, show a message that this feature will be available soon
      setError('PDF download feature will be available soon. Please use the print option for now.');
      
      // When PDF generation is ready, uncomment this:
      /*
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${ticketData.bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage('Ticket downloaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      */
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setError('Failed to download ticket. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleEmailTicket = async () => {
    if (!ticketData?.bookingId || ticketData.bookingId === 'N/A') {
      setError('Booking ID not available for email');
      return;
    }

    try {
      setEmailSending(true);
      setError('');
      
      await sendBookingConfirmationEmail(ticketData.bookingId);
      
      setSuccessMessage('Ticket sent to your email successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleBackToHome = () => {
    // Clear any remaining session data
    sessionStorage.removeItem('bookingConfirmation');
    navigate('/customer/dashboard');
  };

  // Auto-hide error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <div className="ticket-page">
        <div className="ticket-container">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Loading your ticket...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with no ticket data
  if (error && !ticketData) {
    return (
      <div className="ticket-page">
        <HomeNavbar />
        <div className="ticket-container">
          <div className="error-container">
            <h2>Unable to Load Ticket</h2>
            <p>{error}</p>
            <button className="back-button" onClick={handleBackToHome}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No ticket data found
  if (!ticketData) {
    return (
      <div className="ticket-page">
        <HomeNavbar />
        <div className="ticket-container">
          <div className="error-container">
            <h2>No Ticket Data Found</h2>
            <p>Unable to display ticket information.</p>
            <button className="back-button" onClick={handleBackToHome}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-page">
      <HomeNavbar />
      <div className="ticket-container">
        <div className="ticket-header">
          <FaCheckCircle className="success-icon" />
          <h1>Booking Confirmed!</h1>
          <p>Your e-ticket has been generated and saved successfully</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="ticket-card">
          {/* Ticket Info */}
          <div className="ticket-title">
            <FaTicketAlt className="ticket-icon" />
            <h2>E-Ticket</h2>
          </div>

          <div className="ticket-section">
            <div className="ticket-row">
              <span className="ticket-label">Booking ID:</span>
              <span className="ticket-value">{ticketData.bookingId}</span>
            </div>
            {ticketData.pnr && ticketData.pnr !== ticketData.bookingId && (
              <div className="ticket-row">
                <span className="ticket-label">PNR:</span>
                <span className="ticket-value">{ticketData.pnr}</span>
              </div>
            )}
            {ticketData.transactionId && (
              <div className="ticket-row">
                <span className="ticket-label">Transaction ID:</span>
                <span className="ticket-value">{ticketData.transactionId}</span>
              </div>
            )}
            <div className="ticket-row">
              <span className="ticket-label">Booking Date:</span>
              <span className="ticket-value">
                <FaCalendarAlt style={{ marginRight: '5px' }} />
                {ticketData.bookingDate}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Flight Info */}
          <div className="ticket-section">
            <h3 className="section-title">
              <FaPlane className="section-icon" /> Flight Details
            </h3>
            <div className="flight-info">
              <div className="flight-route">
                <div className="city-time">
                  <FaMapMarkerAlt className="city-icon" />
                  <div>
                    <span className="city">{ticketData.source}</span>
                    <span className="time">
                      <FaClock style={{ marginRight: '5px' }} />
                      {ticketData.departureTime}
                    </span>
                    <span className="date">{ticketData.departureDate}</span>
                  </div>
                </div>
                <div className="flight-separator">
                  <div className="flight-line"></div>
                  <FaPlane className="plane-icon" />
                </div>
                <div className="city-time">
                  <FaMapMarkerAlt className="city-icon" />
                  <div>
                    <span className="city">{ticketData.destination}</span>
                    <span className="time">
                      <FaClock style={{ marginRight: '5px' }} />
                      {ticketData.arrivalTime}
                    </span>
                    <span className="date">{ticketData.arrivalDate}</span>
                  </div>
                </div>
              </div>
              <div className="flight-details">
                <div className="detail-item">
                  <span>Flight Number:</span>
                  <span>{ticketData.flightNumber}</span>
                </div>
                <div className="detail-item">
                  <span>Airline:</span>
                  <span>{ticketData.airline}</span>
                </div>
                <div className="detail-item">
                  <span>Class:</span>
                  <span>{ticketData.classType}</span>
                </div>
                <div className="detail-item">
                  <span>Total Passengers:</span>
                  <span>{ticketData.totalPassengers}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Passenger Info */}
          <div className="ticket-section">
            <h3 className="section-title">
              <FaUser className="section-icon" /> Passenger Details
            </h3>
            <div className="passengers-list">
              {ticketData.passengers && ticketData.passengers.length > 0 ? (
                ticketData.passengers.map((passenger, index) => {
                  if (!passenger) return null;
                  return (
                    <div key={index} className="passenger-item">
                      <span className="passenger-number">Passenger {index + 1}</span>
                      <div className="passenger-details">
                        <span className="passenger-name">
                          {passenger.name || 'Name not provided'}
                        </span>
                        <div className="passenger-meta">
                          {passenger.age && (
                            <span className="passenger-age">Age: {passenger.age}</span>
                          )}
                          {passenger.gender && (
                            <span className="passenger-gender">Gender: {passenger.gender}</span>
                          )}
                          {passenger.seatNumber && (
                            <span className="passenger-seat">Seat: {passenger.seatNumber}</span>
                          )}
                        </div>
                        {passenger.specialRequests && (
                          <span className="passenger-requests">
                            Special Requests: {passenger.specialRequests}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="passenger-item">
                  <span className="passenger-name">
                    Passenger information will be updated shortly
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="divider"></div>

          {/* Payment Info */}
          <div className="ticket-section">
            <h3 className="section-title">
              <FaRupeeSign className="section-icon" /> Payment Details
            </h3>
            <div className="payment-details">
              <div className="payment-row total-amount">
                <span>Total Paid:</span>
                <span>₹{ticketData.totalFare?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="payment-row">
                <span>Payment Method:</span>
                <span>{ticketData.paymentMethod}</span>
              </div>
              <div className="payment-row">
                <span>Payment Status:</span>
                <span className={`status ${ticketData.paymentStatus?.toLowerCase()}`}>
                  {ticketData.paymentStatus}
                </span>
              </div>
              <div className="payment-row">
                <span>Booking Status:</span>
                <span className={`status ${ticketData.bookingStatus?.toLowerCase()}`}>
                  {ticketData.bookingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(ticketData.specialRequests || ticketData.notes) && (
            <>
              <div className="divider"></div>
              <div className="ticket-section">
                <h3 className="section-title">Additional Information</h3>
                {ticketData.specialRequests && (
                  <div className="info-item">
                    <span>Special Requests:</span>
                    <span>{ticketData.specialRequests}</span>
                  </div>
                )}
                {ticketData.notes && (
                  <div className="info-item">
                    <span>Notes:</span>
                    <span>{ticketData.notes}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="ticket-actions">
          <button 
            className="print-btn" 
            onClick={handlePrintTicket}
            disabled={isPrinting || !ticketData.bookingId || ticketData.bookingId === 'N/A'}
          >
            {isPrinting ? (
              <>
                <FaSpinner className="spinner-icon" />
                Printing...
              </>
            ) : (
              <>
                <FaPrint />
                Print Ticket
              </>
            )}
          </button>
          <button 
            className="download-btn" 
            onClick={handleDownloadTicket}
            disabled={pdfGenerating || !ticketData.bookingId || ticketData.bookingId === 'N/A'}
          >
            {pdfGenerating ? (
              <>
                <FaSpinner className="spinner-icon" />
                Generating PDF...
              </>
            ) : (
              <>
                <FaDownload />
                Download PDF
              </>
            )}
          </button>
          <button 
            className="email-btn" 
            onClick={handleEmailTicket}
            disabled={emailSending || !ticketData.bookingId || ticketData.bookingId === 'N/A'}
          >
            {emailSending ? (
              <>
                <FaSpinner className="spinner-icon" />
                Sending...
              </>
            ) : (
              <>
                <FaEnvelope />
                Email Ticket
              </>
            )}
          </button>
        </div>

        <div className="ticket-footer">
          <p>Thank you for choosing our airline service. Have a pleasant journey!</p>
          <button className="back-home-btn" onClick={handleBackToHome}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;