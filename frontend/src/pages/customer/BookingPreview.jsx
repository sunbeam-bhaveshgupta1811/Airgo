import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeNavbar from "../../components/HomeNavbar";
import {
  FaPlane,
  FaClock,
  FaUserFriends,
  FaMoneyBillWave,
} from "react-icons/fa";
import "../../CSS/BookingPreview.css";
import "bootstrap/dist/css/bootstrap.min.css";

const BookingPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // In a real app, these would come from location.state or your state management
  const bookingDetails = {
    source: "New York (JFK)",
    destination: "London (LHR)",
    departureDate: "2023-12-15",
    departureTime: "08:30",
    arrivalTime: "20:45",
    flightNumber: "MX101",
    airline: "MX Airlines",
    passengers: [
      {
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        seat: "12A",
      },
      {
        title: "Mrs",
        firstName: "Jane",
        lastName: "Doe",
        seat: "12B",
      },
    ],
    seatClass: "Economy",
    pricePerSeat: 450,
    totalPrice: 900,
  };

  const handleProceed = () => {
    navigate("/payment");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="booking-preview-page">
        <HomeNavbar />

        <div className="booking-preview-container">
          <h2>Booking Preview</h2>
          <p className="subtitle">
            Please review your booking details before proceeding
          </p>

          <div className="booking-summary-card">
            <div className="flight-route-section">
              <div className="route-info">
                <div className="city-time">
                  <span className="city">{bookingDetails.source}</span>
                  <span className="time">{bookingDetails.departureTime}</span>
                </div>

                <div className="route-separator">
                  <div className="duration">
                    <FaClock className="duration-icon" />
                  </div>
                  <div className="flight-line"></div>
                  <FaPlane className="plane-icon" />
                </div>

                <div className="city-time">
                  <span className="city">{bookingDetails.destination}</span>
                  <span className="time">{bookingDetails.arrivalTime}</span>
                </div>
              </div>

              <div className="flight-details">
                <div className="detail-item">
                  <span className="detail-label">Flight Number:</span>
                  <span className="detail-value">
                    {bookingDetails.flightNumber}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Airline:</span>
                  <span className="detail-value">{bookingDetails.airline}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(bookingDetails.departureDate).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Class:</span>
                  <span className="detail-value">
                    {bookingDetails.seatClass}
                  </span>
                </div>
              </div>
            </div>

            <div className="passengers-section">
              <h3 className="section-title">
                <FaUserFriends className="section-icon" />
                Passengers ({bookingDetails.passengers.length})
              </h3>

              <div className="passengers-list">
                {bookingDetails.passengers.map((passenger, index) => (
                  <div key={index} className="passenger-item">
                    <span className="passenger-number">
                      Passenger {index + 1}
                    </span>
                    <div className="passenger-details">
                      <span className="passenger-name">
                        {passenger.title} {passenger.firstName}{" "}
                        {passenger.lastName}
                      </span>
                      <span className="passenger-seat">
                        Seat: {passenger.seat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="price-section">
              <h3 className="section-title">
                <FaMoneyBillWave className="section-icon" />
                Price Summary
              </h3>

              <div className="price-details">
                <div className="price-row">
                  <span>Price per seat ({bookingDetails.seatClass}):</span>
                  <span>${bookingDetails.pricePerSeat}</span>
                </div>
                <div className="price-row">
                  <span>Number of passengers:</span>
                  <span>{bookingDetails.passengers.length}</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>${bookingDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <button className="proceed-button" onClick={handleProceed}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPreview;
