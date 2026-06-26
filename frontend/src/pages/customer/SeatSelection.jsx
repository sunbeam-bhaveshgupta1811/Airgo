import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChair, FaPlane, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  // Get booking data from navigation state or session
  const bookingData = location.state?.bookingData || JSON.parse(sessionStorage.getItem('flightBookingData') || 'null');
  const scheduleId = bookingData?.flight?.scheduleId || bookingData?.flight?.id;
  const passengerCount = bookingData?.searchParams?.passengers || 1;

  useEffect(() => {
    if (!scheduleId) {
      toast.error('No flight selected');
      navigate('/customer/flightsearch');
      return;
    }
    fetchSeatMap();
    connectWebSocket();

    return () => {
      if (stompClientRef.current) {
        try { stompClientRef.current.deactivate(); } catch (e) {}
      }
    };
  }, [scheduleId]);

  const fetchSeatMap = async () => {
    try {
      const response = await axios.get(`${config.serverURL}/api/seats/map/${scheduleId}`);
      setSeatMap(response.data?.data || null);
    } catch (error) {
      toast.error('Failed to load seat map');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = async () => {
    try {
      const { Client } = await import('@stomp/stompjs');
      const SockJS = (await import('sockjs-client')).default;

      const client = new Client({
        webSocketFactory: () => new SockJS(`${config.serverURL}/ws`),
        reconnectDelay: 5000,
        onConnect: () => {
          setConnected(true);
          client.subscribe(`/topic/flights/${scheduleId}/seats`, (message) => {
            const updatedSeatMap = JSON.parse(message.body);
            setSeatMap(updatedSeatMap);
          });
        },
        onDisconnect: () => setConnected(false),
        onStompError: () => setConnected(false),
      });

      client.activate();
      stompClientRef.current = client;
    } catch (e) {
      console.warn('WebSocket connection failed, using polling fallback');
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.occupied) return;

    const seatNumber = seat.seatNumber;
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      }
      if (prev.length >= passengerCount) {
        toast.warning(`You can only select ${passengerCount} seat(s)`);
        return prev;
      }
      return [...prev, seatNumber];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length !== passengerCount) {
      toast.error(`Please select exactly ${passengerCount} seat(s)`);
      return;
    }

    // Store selected seats in session
    const updatedBookingData = {
      ...bookingData,
      selectedSeats
    };
    sessionStorage.setItem('flightBookingData', JSON.stringify(updatedBookingData));

    navigate('/customer/passengerdetails', { state: { bookingData: updatedBookingData } });
  };

  const getZoneColor = (zone) => {
    switch (zone) {
      case 'Business': return '#ffd700';
      case 'Premium Economy': return '#87ceeb';
      default: return '#90ee90';
    }
  };

  const getSeatStyle = (seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);
    if (seat.occupied) {
      return { backgroundColor: '#dc3545', color: '#fff', cursor: 'not-allowed', opacity: 0.7 };
    }
    if (isSelected) {
      return { backgroundColor: '#0d6efd', color: '#fff', cursor: 'pointer', transform: 'scale(1.1)' };
    }
    return { backgroundColor: getZoneColor(seat.zone), color: '#333', cursor: 'pointer' };
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary"></div><p className="mt-2">Loading seat map...</p></div>;
  }

  if (!seatMap) {
    return <div className="alert alert-danger m-5">Failed to load seat map. <button className="btn btn-link" onClick={fetchSeatMap}>Retry</button></div>;
  }

  // Group seats by row
  const seatsByRow = {};
  (seatMap.seats || []).forEach(seat => {
    const row = seat.seatNumber.replace(/[A-F]/g, '');
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push(seat);
  });

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />Back
        </button>
        <h2 className="mb-0"><FaChair className="me-2" />Select Your Seats</h2>
        <div>
          <span className={`badge ${connected ? 'bg-success' : 'bg-secondary'} me-2`}>
            {connected ? 'Live' : 'Offline'}
          </span>
          <span className="text-muted">
            {selectedSeats.length}/{passengerCount} selected
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap">
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 20, height: 20, backgroundColor: '#90ee90', borderRadius: 3 }}></div>
          <small>Economy</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 20, height: 20, backgroundColor: '#87ceeb', borderRadius: 3 }}></div>
          <small>Premium</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 20, height: 20, backgroundColor: '#ffd700', borderRadius: 3 }}></div>
          <small>Business</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 20, height: 20, backgroundColor: '#0d6efd', borderRadius: 3 }}></div>
          <small>Selected</small>
        </div>
        <div className="d-flex align-items-center gap-1">
          <div style={{ width: 20, height: 20, backgroundColor: '#dc3545', borderRadius: 3 }}></div>
          <small>Booked</small>
        </div>
      </div>

      {/* Stats bar */}
      <div className="alert alert-info d-flex justify-content-around py-2 mb-3">
        <span><strong>{seatMap.availableSeats}</strong> Available</span>
        <span><strong>{seatMap.occupiedSeats}</strong> Booked</span>
        <span><strong>{seatMap.totalSeats}</strong> Total</span>
      </div>

      {/* Seat Map */}
      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          {/* Plane nose */}
          <div className="text-center mb-3">
            <FaPlane size={30} className="text-primary" style={{ transform: 'rotate(-90deg)' }} />
            <div className="text-muted small">Front</div>
          </div>

          {/* Column headers */}
          <div className="d-flex justify-content-center mb-2">
            <div style={{ width: 35 }}></div>
            {['A', 'B', 'C', '', 'D', 'E', 'F'].map((col, i) => (
              <div key={i} style={{ width: col ? 40 : 20, textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Object.keys(seatsByRow).sort((a, b) => parseInt(a) - parseInt(b)).map(row => {
            const seats = seatsByRow[row].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
            const leftSeats = seats.filter(s => ['A', 'B', 'C'].includes(s.seatNumber.slice(-1)));
            const rightSeats = seats.filter(s => ['D', 'E', 'F'].includes(s.seatNumber.slice(-1)));

            return (
              <div key={row} className="d-flex justify-content-center align-items-center mb-1">
                <div style={{ width: 35, textAlign: 'center', fontSize: 11, color: '#666' }}>{row}</div>
                {leftSeats.map(seat => (
                  <div
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    title={`${seat.seatNumber} - ${seat.zone} ${seat.occupied ? '(Booked)' : '(Available)'}`}
                    style={{
                      width: 36, height: 32, margin: '0 2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 4, fontSize: 10, fontWeight: 'bold',
                      transition: 'all 0.2s',
                      border: selectedSeats.includes(seat.seatNumber) ? '2px solid #0d6efd' : '1px solid #ddd',
                      ...getSeatStyle(seat)
                    }}
                  >
                    {seat.seatNumber.slice(-1)}
                  </div>
                ))}
                {/* Aisle */}
                <div style={{ width: 20 }}></div>
                {rightSeats.map(seat => (
                  <div
                    key={seat.seatNumber}
                    onClick={() => handleSeatClick(seat)}
                    title={`${seat.seatNumber} - ${seat.zone} ${seat.occupied ? '(Booked)' : '(Available)'}`}
                    style={{
                      width: 36, height: 32, margin: '0 2px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 4, fontSize: 10, fontWeight: 'bold',
                      transition: 'all 0.2s',
                      border: selectedSeats.includes(seat.seatNumber) ? '2px solid #0d6efd' : '1px solid #ddd',
                      ...getSeatStyle(seat)
                    }}
                  >
                    {seat.seatNumber.slice(-1)}
                  </div>
                ))}
              </div>
            );
          })}

          <div className="text-center mt-3 text-muted small">Rear</div>
        </div>
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="card mt-3">
          <div className="card-body">
            <h6>Selected Seats:</h6>
            <div className="d-flex gap-2 flex-wrap">
              {selectedSeats.map(seat => (
                <span key={seat} className="badge bg-primary fs-6">{seat}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate(-1)}>
          Back to Flights
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleContinue}
          disabled={selectedSeats.length !== passengerCount}
        >
          Continue with {selectedSeats.length} seat(s)
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
