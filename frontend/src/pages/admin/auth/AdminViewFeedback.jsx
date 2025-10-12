import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminFeedbackTable = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Simulate API call using useEffect
  useEffect(() => {
    // Dummy data (simulating what backend would return)
    const dummyFeedback = [
      {
        feedback_id: 1,
        user_name: "John Doe",
        booking_id: 101,
        flight_name: "AI-202 Delhi → Mumbai",
        rating: 5,
        comments: "Excellent service!",
        submitted_at: "2025-08-04T10:20:00"
      },
      {
        feedback_id: 2,
        user_name: "Alice Smith",
        booking_id: 102,
        flight_name: "AI-305 Bangalore → Dubai",
        rating: 4,
        comments: "Very good experience, but food can be improved.",
        submitted_at: "2025-08-03T14:10:00"
      },
      {
        feedback_id: 3,
        user_name: "Michael Johnson",
        booking_id: 103,
        flight_name: "AI-101 New York → London",
        rating: 3,
        comments: "Average experience.",
        submitted_at: "2025-08-02T09:30:00"
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setFeedbackList(dummyFeedback);
      setLoading(false);
    }, 1000); // 1 second delay
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">All Customer Feedback (Dummy Data)</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Loading dummy data...</p>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="alert alert-info text-center">No feedback records found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Feedback ID</th>
                <th>User Name</th>
                <th>Booking ID</th>
                <th>Flight Name</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr key={fb.feedback_id}>
                  <td>{fb.feedback_id}</td>
                  <td>{fb.user_name}</td>
                  <td>{fb.booking_id}</td>
                  <td>{fb.flight_name}</td>
                  <td>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < fb.rating ? "#FFD700" : "#ccc" }}>★</span>
                    ))}
                  </td>
                  <td>{fb.comments || "No comments"}</td>
                  <td>{new Date(fb.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackTable;
