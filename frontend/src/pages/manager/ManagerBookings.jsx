import React, { useState, useEffect } from 'react';
import { getManagerBookings } from '../../services/manager/managerService';
import { toast } from 'react-toastify';

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getManagerBookings();
        setBookings(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b =>
    (b.bookingReference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.flightNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'CANCELLED': return 'bg-danger';
      case 'COMPLETED': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Airport Bookings</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by reference, passenger, or flight..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Booking Ref</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Date</th>
              <th>Passengers</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" className="text-center text-muted py-4">No bookings found for your airport.</td></tr>
            ) : (
              filtered.map((b, i) => (
                <tr key={b.id}>
                  <td>{i + 1}</td>
                  <td><strong>{b.bookingReference}</strong></td>
                  <td>{b.flightNumber}</td>
                  <td>{b.originCity} → {b.destinationCity}</td>
                  <td>{b.journeyDate}</td>
                  <td>{b.numberOfPassengers}</td>
                  <td>₹{b.totalAmount?.toLocaleString()}</td>
                  <td><span className={`badge ${getStatusBadge(b.status)}`}>{b.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total: {filtered.length} bookings</p>
    </div>
  );
};

export default ManagerBookings;
