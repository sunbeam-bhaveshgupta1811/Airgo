import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../config";
import "bootstrap/dist/css/bootstrap.min.css";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("jwt");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const CustomerFeedback = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: "",
    rating: 0,
    comments: ""
  });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${config.serverURL}/bookings/my`,
          getAuthHeaders()
        );
        const allBookings = response.data?.data || [];
        // Only show confirmed bookings for feedback
        const confirmed = allBookings.filter((b) => b.status === "CONFIRMED");
        setBookings(confirmed);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookingId || formData.rating === 0) {
      setAlert({ type: "danger", message: "Please select a booking and give a rating." });
      return;
    }
    try {
      await axios.post(
        `${config.serverURL}/user/feedback`,
        {
          bookingId: Number(formData.bookingId),
          rating: formData.rating,
          comments: formData.comments,
        },
        getAuthHeaders()
      );
      setAlert({ type: "success", message: "Feedback submitted successfully!" });
      setFormData({ bookingId: "", rating: 0, comments: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting feedback. Try again later.";
      setAlert({ type: "danger", message: msg });
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="text-center mb-3">Submit Feedback</h2>

        {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Booking Selection */}
            <div className="mb-3">
              <label className="form-label">Select Booking *</label>
              <select
                className="form-select"
                name="bookingId"
                value={formData.bookingId}
                onChange={handleChange}
                required
              >
                <option value="">--Select Booking--</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.bookingReference} — {booking.airlineName} ({booking.originCity} → {booking.destinationCity})
                  </option>
                ))}
              </select>
              {bookings.length === 0 && (
                <small className="text-muted">No confirmed bookings found. Book a flight first.</small>
              )}
            </div>

            {/* Star Rating */}
            <div className="mb-3">
              <label className="form-label">Rating *</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: "28px",
                      cursor: "pointer",
                      color: formData.rating >= star ? "#FFD700" : "#ccc"
                    }}
                    onClick={() => handleStarClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="mb-3">
              <label className="form-label">Comments</label>
              <textarea
                className="form-control"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Write your feedback..."
                maxLength={1000}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CustomerFeedback;
