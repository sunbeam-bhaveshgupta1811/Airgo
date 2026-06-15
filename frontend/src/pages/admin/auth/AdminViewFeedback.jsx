import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../../config";
import "bootstrap/dist/css/bootstrap.min.css";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  },
});

const AdminFeedbackTable = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${config.serverURL}/admin/feedback`,
          getAuthHeaders()
        );
        setFeedbackList(response.data || []);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">All Customer Feedback</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p>Loading feedback...</p>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="alert alert-info text-center">No feedback records found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Booking Ref</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((fb) => (
                <tr key={fb.id}>
                  <td>{fb.id}</td>
                  <td>{fb.userName || "N/A"}</td>
                  <td>{fb.bookingReference || fb.bookingId}</td>
                  <td>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < fb.rating ? "#FFD700" : "#ccc" }}>★</span>
                    ))}
                  </td>
                  <td>{fb.comments || "No comments"}</td>
                  <td>{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : "N/A"}</td>
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
