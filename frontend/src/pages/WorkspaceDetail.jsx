import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceService, api, bookingService, amenityService } from '../services/api';
import { Calendar, Clock, Monitor, Wifi, Coffee, MapPin, Package, Check } from 'lucide-react';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [desks, setDesks] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wsRes = await workspaceService.getAll(); // Simplified for demo, should be getById
        const ws = wsRes.data.find(w => w.id === parseInt(id));
        setWorkspace(ws);
        
        const deskRes = await api.get(`/desks?workspaceId=${id}`);
        setDesks(deskRes.data);

        const amenityRes = await amenityService.getAvailable();
        setAmenities(amenityRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDesk) return setError("Please select a desk");
    
    setError('');
    try {
      await bookingService.create({
        deskId: selectedDesk.id,
        bookingDate,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        amenityIds: selectedAmenities
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Booking failed. Check for overlaps.");
    }
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  if (!workspace) return <div>Loading...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button onClick={() => navigate('/workspaces')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}>← Back</button>
          <h2 style={{ margin: 0 }}>{workspace.workspaceName}</h2>
        </div>
        
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Select a Desk</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '1rem' }}>
            {desks.map(desk => (
              <div
                key={desk.id}
                onClick={() => desk.availabilityStatus === 'AVAILABLE' && setSelectedDesk(desk)}
                style={{
                  height: '60px',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: desk.availabilityStatus === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                  border: selectedDesk?.id === desk.id ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  backgroundColor: desk.availabilityStatus === 'AVAILABLE' ? (selectedDesk?.id === desk.id ? '#f0fdfa' : 'white') : '#f1f5f9',
                  color: desk.availabilityStatus === 'AVAILABLE' ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {desk.deskNumber}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '12px', height: '12px', background: 'white', border: '1px solid var(--border)' }}></div> Available</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '12px', height: '12px', background: 'var(--secondary)' }}></div> Selected</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><div style={{ width: '12px', height: '12px', background: '#f1f5f9' }}></div> Occupied</div>
          </div>
        </div>

        <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Add Amenities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {amenities.map(amenity => (
              <div
                key={amenity.id}
                onClick={() => toggleAmenity(amenity.id)}
                style={{
                  padding: '1rem',
                  borderRadius: '0.8rem',
                  border: selectedAmenities.includes(amenity.id) ? '2px solid var(--secondary)' : '1px solid var(--border)',
                  backgroundColor: selectedAmenities.includes(amenity.id) ? '#f0fdfa' : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ color: selectedAmenities.includes(amenity.id) ? 'var(--secondary)' : 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <Package size={24} style={{ margin: '0 auto' }} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{amenity.amenityName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ background: 'white', padding: '2rem', height: 'fit-content', position: 'sticky', top: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Reservation Details</h3>
        {error && <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', background: '#fef2f2', borderRadius: '0.4rem' }}>{error}</div>}
        {success && <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.5rem', background: '#f0fdf4', borderRadius: '0.4rem' }}>Success! Redirecting...</div>}
        
        <form onSubmit={handleBooking}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Date</label>
            <input type="date" required className="booking-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }} value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Start Time</label>
              <input type="time" required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }} value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>End Time</label>
              <input type="time" required style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }} value={endTime} onChange={e => setEndTime(e.target.value)} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Selected Desk</span>
              <span style={{ fontWeight: 600 }}>{selectedDesk ? `#${selectedDesk.deskNumber}` : 'None'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Workspace</span>
              <span style={{ fontWeight: 600 }}>{workspace.location}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Confirm Reservation</button>
        </form>
      </div>
    </div>
  );
};

export default WorkspaceDetail;
