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
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    booking_id: "",
    rating: 0,
    comments: ""
  });
  const [alert, setAlert] = useState({ type: "", message: "" });

  // ✅ Fetch users and bookings from backend
  useEffect(() => {
    axios.get(`${config.serverURL}/customer/feedback`, getAuthHeaders())
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axios.get(`${config.serverURL}/customer/booking`, getAuthHeaders())
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle star rating
  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.booking_id || formData.rating === 0) {
      setAlert({ type: "danger", message: "Please fill all required fields." });
      return;
    }
    try {
      const response = await axios.post(`${config.serverURL}/api/feedback`, formData, getAuthHeaders());
      if (response.status === 200) {
        setAlert({ type: "success", message: "Feedback submitted successfully!" });
        setFormData({ user_id: "", booking_id: "", rating: 0, comments: "" });
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setAlert({ type: "danger", message: "Error submitting feedback. Try again later." });
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="text-center mb-3">Submit Feedback</h2>

        {alert.message && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

        <form onSubmit={handleSubmit}>

          {/* ✅ User Selection */}
          <div className="mb-3">
            <label className="form-label">User *</label>
            <select className="form-select" name="user_id" value={formData.user_id} onChange={handleChange} required>
              <option value="">--Select User--</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.name} (ID: {user.user_id})
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Booking Selection */}
          <div className="mb-3">
            <label className="form-label">Booking *</label>
            <select className="form-select" name="booking_id" value={formData.booking_id} onChange={handleChange} required>
              <option value="">--Select Booking--</option>
              {bookings.map((booking) => (
                <option key={booking.booking_id} value={booking.booking_id}>
                  Booking #{booking.booking_id} - {booking.flight_name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Star Rating */}
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

          {/* ✅ Comments */}
          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea className="form-control" name="comments" value={formData.comments} onChange={handleChange} placeholder="Write your feedback..."></textarea>
          </div>

          {/* ✅ Submit Button */}
          <button type="submit" className="btn btn-primary btn-xl">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerFeedback;

