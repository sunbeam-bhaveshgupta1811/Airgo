import React, { useState, useMemo } from 'react';
import { FaPlane, FaClock, FaChair, FaArrowLeft, FaFilter, FaStar } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const FlightList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flights = useMemo(() => location.state?.flights || [], [location.state]);
  const returnFlights = useMemo(() => location.state?.returnFlights || [], [location.state]);
  const isRoundTrip = location.state?.isRoundTrip || false;
  const searchParams = location.state?.searchParams || {};

  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState({ maxPrice: '', airlines: [], timeOfDay: 'all' });
  const [showFilters, setShowFilters] = useState(false);

  const uniqueAirlines = useMemo(() => [...new Set(flights.map(f => f.airline))], [flights]);

  const filteredFlights = useMemo(() => {
    let filtered = [...flights];
    if (filterBy.maxPrice) filtered = filtered.filter(f => Math.min(...Object.values(f.prices)) <= parseInt(filterBy.maxPrice));
    if (filterBy.airlines.length > 0) filtered = filtered.filter(f => filterBy.airlines.includes(f.airline));
    if (filterBy.timeOfDay !== 'all') {
      filtered = filtered.filter(f => {
        const h = parseInt(f.departureTime.split(':')[0]);
        if (filterBy.timeOfDay === 'morning') return h < 12;
        if (filterBy.timeOfDay === 'afternoon') return h >= 12 && h < 18;
        return h >= 18;
      });
    }
    filtered.sort((a, b) => {
      if (sortBy === 'price') return Math.min(...Object.values(a.prices)) - Math.min(...Object.values(b.prices));
      if (sortBy === 'duration') {
        const d = (s) => parseInt(s.split('h')[0]) * 60 + parseInt(s.split('h')[1]?.replace('m', '') || 0);
        return d(a.duration) - d(b.duration);
      }
      return a.departureTime.localeCompare(b.departureTime);
    });
    return filtered;
  }, [flights, filterBy, sortBy]);

  const handleSelect = (flight, classType) => {
    const classKey = classType.toLowerCase();
    const seats = flight.seatsAvailable?.[classKey];
    if (seats === undefined || seats <= 0) { toast.error('No seats available.'); return; }
    const bookingData = {
      flight: { id: flight.id, flightNumber: flight.flightNumber, airline: flight.airline, source: flight.source, destination: flight.destination, departureTime: flight.departureTime, arrivalTime: flight.arrivalTime, duration: flight.duration, prices: flight.prices, seatsAvailable: flight.seatsAvailable },
      classType, searchParams, selectedPrice: flight.prices[classKey] || 0, selectedSeats: seats, timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('flightBookingData', JSON.stringify(bookingData));

    // If not logged in, save pending booking and redirect to login
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      sessionStorage.setItem('pendingBookingRedirect', '/customer/seatselection');
      toast.info('Please login to continue booking.');
      navigate('/auth');
      return;
    }

    navigate('/customer/seatselection', { state: { bookingData } });
  };

  const formatTime = (t) => { if (!t) return ''; const parts = t.split(':'); return `${parts[0]}:${parts[1]}`; };
  const formatClass = (t) => ({ firstClass: 'First Class', business: 'Business', premium: 'Premium', economy: 'Economy' }[t] || t.charAt(0).toUpperCase() + t.slice(1));

  const FlightCard = ({ flight, index, isReturn }) => {
    const lowestPrice = Math.min(...Object.values(flight.prices));
    return (
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ecf0', transition: 'all 0.25s ease', cursor: 'default', overflow: 'hidden' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>

        {/* Main flight info row */}
        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Airline */}
          <div style={{ minWidth: 110, flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: isReturn ? '#fef3c7' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <FaPlane size={18} style={{ color: isReturn ? '#d97706' : '#3b82f6', transform: isReturn ? 'rotate(180deg)' : 'none' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{flight.flightNumber}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{flight.airline}</div>
          </div>

          {/* Departure */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{formatTime(flight.departureTime)}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{flight.source}</div>
          </div>

          {/* Duration line */}
          <div style={{ flex: 1.2, textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>{flight.duration}</div>
            <div style={{ position: 'relative', height: 2, background: '#e2e8f0', borderRadius: 2 }}>
              <div style={{ position: 'absolute', left: 0, top: -3, width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div>
              <div style={{ position: 'absolute', right: 0, top: -3, width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></div>
              <FaPlane size={12} style={{ position: 'absolute', left: '50%', top: -5, transform: 'translateX(-50%)', color: '#3b82f6' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, marginTop: 6 }}>Non-stop</div>
          </div>

          {/* Arrival */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>{formatTime(flight.arrivalTime)}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{flight.destination}</div>
          </div>

          {/* Price + Select */}
          <div style={{ minWidth: 160, textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>₹{lowestPrice.toLocaleString()}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 8 }}>per person</div>
          </div>
        </div>

        {/* Class options — expandable bottom */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 28px 16px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(flight.prices).map(([type, price]) => {
            const seats = flight.seatsAvailable?.[type] ?? 0;
            const soldOut = seats <= 0;
            return (
              <div key={type} style={{ flex: '1 1 0', minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: soldOut ? '#f8fafc' : '#fafbfc', borderRadius: 10, border: `1px solid ${soldOut ? '#e2e8f0' : '#e8ecf0'}`, transition: 'all 0.2s' }}
                onMouseEnter={(e) => !soldOut && (e.currentTarget.style.borderColor = '#3b82f6')}
                onMouseLeave={(e) => !soldOut && (e.currentTarget.style.borderColor = '#e8ecf0')}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{formatClass(type)}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: soldOut ? '#94a3b8' : '#0f172a' }}>₹{price.toLocaleString()}</div>
                  <div style={{ fontSize: '0.7rem', color: seats < 10 ? '#ef4444' : '#94a3b8', fontWeight: 500 }}>
                    {soldOut ? 'Sold out' : `${seats} seats left`}
                  </div>
                </div>
                <button disabled={soldOut} onClick={() => handleSelect(flight, type)}
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: '0.82rem', fontWeight: 600, cursor: soldOut ? 'not-allowed' : 'pointer', background: soldOut ? '#e2e8f0' : '#0f172a', color: soldOut ? '#94a3b8' : '#fff', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => !soldOut && (e.currentTarget.style.background = '#3b82f6')}
                  onMouseLeave={(e) => !soldOut && (e.currentTarget.style.background = '#0f172a')}>
                  {soldOut ? 'Sold Out' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '14px 0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', color: '#475569', fontWeight: 500 }}>
            <FaArrowLeft size={13} /> Back
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              {searchParams.from} → {searchParams.to}
              {isRoundTrip && <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, marginLeft: 8 }}>Round Trip</span>}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {searchParams.departDate} {searchParams.passengers && `· ${searchParams.passengers} passenger(s)`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: '0.85rem', color: '#475569', background: '#fff', cursor: 'pointer' }}>
              <option value="price">Cheapest</option>
              <option value="duration">Fastest</option>
              <option value="departure">Earliest</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{ background: showFilters ? '#0f172a' : '#fff', color: showFilters ? '#fff' : '#475569', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500 }}>
              <FaFilter size={12} /> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{ maxWidth: 1100, margin: '12px auto 0', padding: '0 24px' }}>
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'end', flexWrap: 'wrap', border: '1px solid #e8ecf0' }}>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Max Price</label>
                <input type="number" placeholder="Any" value={filterBy.maxPrice} onChange={(e) => setFilterBy({ ...filterBy, maxPrice: e.target.value })}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: '0.88rem' }} />
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Time</label>
                <select value={filterBy.timeOfDay} onChange={(e) => setFilterBy({ ...filterBy, timeOfDay: e.target.value })}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: '0.88rem', background: '#fff' }}>
                  <option value="all">Any time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              <div style={{ flex: '2 1 250px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Airlines</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {uniqueAirlines.map(a => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', cursor: 'pointer', color: '#475569' }}>
                      <input type="checkbox" checked={filterBy.airlines.includes(a)} onChange={() => setFilterBy(p => ({ ...p, airlines: p.airlines.includes(a) ? p.airlines.filter(x => x !== a) : [...p.airlines, a] }))} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => setFilterBy({ maxPrice: '', airlines: [], timeOfDay: 'all' })}
                style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', color: '#64748b', whiteSpace: 'nowrap' }}>
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{ maxWidth: 1100, margin: '20px auto 0', padding: '0 24px' }}>
        <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500, marginBottom: 16 }}>
          {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Flight cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredFlights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 16, border: '1px solid #e8ecf0' }}>
            <FaPlane size={40} style={{ color: '#cbd5e1', marginBottom: 16 }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>No flights found</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: 16 }}>Try adjusting your filters or search criteria.</div>
            {(filterBy.maxPrice || filterBy.airlines.length > 0 || filterBy.timeOfDay !== 'all') && (
              <button onClick={() => setFilterBy({ maxPrice: '', airlines: [], timeOfDay: 'all' })}
                style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : filteredFlights.map((flight, i) => <FlightCard key={`${flight.id}-${i}`} flight={flight} index={i} />)}
      </div>

      {/* Return flights */}
      {isRoundTrip && returnFlights.length > 0 && (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 40px' }}>
          <div style={{ textAlign: 'center', margin: '20px 0 24px', padding: '16px', background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#92400e' }}>
              <FaPlane style={{ transform: 'rotate(180deg)', marginRight: 8 }} />
              Return — {searchParams.to} → {searchParams.from}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#b45309' }}>{searchParams.returnDate}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {returnFlights.map((flight, i) => <FlightCard key={`ret-${flight.id}-${i}`} flight={flight} index={i} isReturn />)}
          </div>
        </div>
      )}

      {isRoundTrip && returnFlights.length === 0 && (
        <div style={{ maxWidth: 1100, margin: '20px auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', padding: '40px', background: '#fffbeb', borderRadius: 12, border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#92400e' }}>No return flights found</div>
            <div style={{ fontSize: '0.88rem', color: '#b45309' }}>Try a different return date.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightList;
