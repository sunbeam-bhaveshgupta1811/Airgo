import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChair, FaPlane, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { config } from '../../../config';

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const stompRef = useRef(null);

  const bookingData = location.state?.bookingData || JSON.parse(sessionStorage.getItem('flightBookingData') || 'null');
  const scheduleId = bookingData?.flight?.scheduleId || bookingData?.flight?.id;
  const passengerCount = bookingData?.searchParams?.passengers || 1;

  useEffect(() => {
    if (!scheduleId) { toast.error('No flight selected'); navigate('/customer/flightsearch'); return; }
    fetchSeatMap();
    connectWS();
    return () => { if (stompRef.current) try { stompRef.current.deactivate(); } catch(e) {} };
  }, [scheduleId]);

  const fetchSeatMap = async () => {
    try { const r = await axios.get(`${config.serverURL}/api/seats/map/${scheduleId}`); setSeatMap(r.data?.data || null); } catch { toast.error('Failed to load seat map'); } finally { setLoading(false); }
  };

  const connectWS = async () => {
    try {
      const { Client } = await import('@stomp/stompjs');
      const SockJS = (await import('sockjs-client')).default;
      const client = new Client({
        webSocketFactory: () => new SockJS(`${config.serverURL}/ws`),
        reconnectDelay: 5000,
        onConnect: () => { setConnected(true); client.subscribe(`/topic/flights/${scheduleId}/seats`, (msg) => setSeatMap(JSON.parse(msg.body))); },
        onDisconnect: () => setConnected(false),
      });
      client.activate();
      stompRef.current = client;
    } catch { /* WebSocket optional */ }
  };

  const handleSeatClick = (seat) => {
    if (seat.occupied) return;
    setSelectedSeats(prev => {
      if (prev.includes(seat.seatNumber)) return prev.filter(s => s !== seat.seatNumber);
      if (prev.length >= passengerCount) { toast.warning(`Select only ${passengerCount} seat(s)`); return prev; }
      return [...prev, seat.seatNumber];
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length !== passengerCount) { toast.error(`Select exactly ${passengerCount} seat(s)`); return; }
    const updated = { ...bookingData, selectedSeats };
    sessionStorage.setItem('flightBookingData', JSON.stringify(updated));
    navigate('/customer/passengerdetails', { state: { bookingData: updated } });
  };

  const zoneColor = (zone) => ({ Business: '#fbbf24', 'Premium Economy': '#60a5fa', Economy: '#34d399' }[zone] || '#34d399');
  const seatStyle = (seat) => {
    if (seat.occupied) return { background: '#ef4444', color: '#fff', cursor: 'not-allowed', opacity: 0.6 };
    if (selectedSeats.includes(seat.seatNumber)) return { background: '#3b82f6', color: '#fff', cursor: 'pointer', transform: 'scale(1.08)' };
    return { background: zoneColor(seat.zone), color: '#1e293b', cursor: 'pointer' };
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}><div className="spinner-border text-primary"></div></div>;
  if (!seatMap) return <div className="alert alert-danger m-5">Failed to load seat map. <button className="btn btn-link p-0" onClick={fetchSeatMap}>Retry</button></div>;

  const rows = {};
  (seatMap.seats || []).forEach(s => { const r = s.seatNumber.replace(/[A-F]/g, ''); if (!rows[r]) rows[r] = []; rows[r].push(s); });

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}><FaArrowLeft className="me-1" />Back</button>
        <h5 className="mb-0 fw-bold"><FaChair className="me-2 text-primary" />Select Seats</h5>
        <div><span className={`badge ${connected ? 'bg-success' : 'bg-secondary'} me-2`} style={{ fontSize: '0.7rem' }}>{connected ? 'Live' : 'Offline'}</span><span className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedSeats.length}/{passengerCount}</span></div>
      </div>

      <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap" style={{ fontSize: '0.78rem' }}>
        {[['#34d399','Economy'],['#60a5fa','Premium'],['#fbbf24','Business'],['#3b82f6','Selected'],['#ef4444','Booked']].map(([c,l]) => (
          <div key={l} className="d-flex align-items-center gap-1"><div style={{ width: 14, height: 14, background: c, borderRadius: 3 }}></div><span>{l}</span></div>
        ))}
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="card-body py-3" style={{ overflowX: 'auto' }}>
          <div className="text-center mb-2"><FaPlane size={20} className="text-primary" style={{ transform: 'rotate(-90deg)' }} /><div className="text-muted" style={{ fontSize: '0.7rem' }}>Front</div></div>
          <div className="d-flex justify-content-center mb-1">{['', 'A','B','C','','D','E','F'].map((c,i) => <div key={i} style={{ width: c ? 34 : 16, textAlign: 'center', fontWeight: 700, fontSize: 11, color: '#64748b' }}>{c}</div>)}</div>
          {Object.keys(rows).sort((a,b) => +a - +b).map(row => {
            const seats = rows[row].sort((a,b) => a.seatNumber.localeCompare(b.seatNumber));
            return (
              <div key={row} className="d-flex justify-content-center align-items-center mb-1">
                <div style={{ width: 24, textAlign: 'center', fontSize: 10, color: '#94a3b8' }}>{row}</div>
                {seats.filter(s => 'ABC'.includes(s.seatNumber.slice(-1))).map(s => (
                  <div key={s.seatNumber} onClick={() => handleSeatClick(s)} title={`${s.seatNumber} - ${s.zone}`}
                    style={{ width: 30, height: 28, margin: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 9, fontWeight: 700, transition: 'all 0.15s', border: selectedSeats.includes(s.seatNumber) ? '2px solid #2563eb' : '1px solid rgba(0,0,0,0.1)', ...seatStyle(s) }}>{s.seatNumber.slice(-1)}</div>
                ))}
                <div style={{ width: 16 }}></div>
                {seats.filter(s => 'DEF'.includes(s.seatNumber.slice(-1))).map(s => (
                  <div key={s.seatNumber} onClick={() => handleSeatClick(s)} title={`${s.seatNumber} - ${s.zone}`}
                    style={{ width: 30, height: 28, margin: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 9, fontWeight: 700, transition: 'all 0.15s', border: selectedSeats.includes(s.seatNumber) ? '2px solid #2563eb' : '1px solid rgba(0,0,0,0.1)', ...seatStyle(s) }}>{s.seatNumber.slice(-1)}</div>
                ))}
              </div>
            );
          })}
          <div className="text-center mt-2 text-muted" style={{ fontSize: '0.7rem' }}>Rear</div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: 12 }}>
          <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between">
            <div><span className="text-muted" style={{ fontSize: '0.82rem' }}>Selected: </span>{selectedSeats.map(s => <span key={s} className="badge bg-primary me-1" style={{ fontSize: '0.8rem' }}>{s}</span>)}</div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Back</button>
        <button className="btn btn-primary px-4" onClick={handleContinue} disabled={selectedSeats.length !== passengerCount} style={{ borderRadius: 8 }}>Continue with {selectedSeats.length} seat(s)</button>
      </div>
    </div>
  );
};

export default SeatSelection;
