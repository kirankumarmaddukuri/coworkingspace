import React, { useState, useEffect } from 'react';
import { bookingService, api } from '../services/api';
import { Calendar, Trash2, Clock, MapPin, Package, List } from 'lucide-react';
import BookingCalendar from './BookingCalendar';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [amenityStats, setAmenityStats] = useState({}); // bookingId -> list of variations
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('LIST'); // LIST, CALENDAR

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMy();
      const docs = response.data;
      setBookings(docs);
      
      // Fetch amenities for each booking
      const amenityMap = {};
      await Promise.all(docs.map(async b => {
        try {
          const res = await api.get(`/amenity-reservations/booking/${b.id}`);
          amenityMap[b.id] = res.data;
        } catch (e) {
          console.error("Failed to fetch amenities for booking", b.id);
        }
      }));
      setAmenityStats(amenityMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
// ... rest of handlers ...
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancel(id);
      fetchBookings();
    } catch (err) {
      alert("Cancellation failed: " + (err.response?.data || "Error"));
    }
  };

  const handleUpdate = async (id, newDate, newStart, newEnd) => {
    try {
      await bookingService.update(id, {
        bookingDate: newDate,
        startTime: `${newStart}:00`,
        endTime: `${newEnd}:00`
      });
      fetchBookings();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.response?.data || "Error"));
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await bookingService.checkIn(id);
      fetchBookings();
    } catch (err) {
      alert("Check-in failed: " + (err.response?.data?.message || err.response?.data || "Error"));
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await bookingService.checkOut(id);
      fetchBookings();
    } catch (err) {
      alert("Check-out failed: " + (err.response?.data?.message || err.response?.data || "Error"));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return '#059669';
      case 'CANCELLED': return '#dc2626';
      case 'REQUESTED': return '#d97706';
      case 'IN_USE': return '#2563eb';
      default: return 'var(--text-muted)';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>My Workspace Schedule</h2>
        <div style={{ display: 'flex', background: 'white', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setViewMode('LIST')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: 'none', 
              background: viewMode === 'LIST' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'LIST' ? 'white' : 'var(--text-main)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <List size={16} /> List
          </button>
          <button 
            onClick={() => setViewMode('CALENDAR')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: 'none', 
              background: viewMode === 'CALENDAR' ? 'var(--primary)' : 'transparent',
              color: viewMode === 'CALENDAR' ? 'white' : 'var(--text-main)',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            <Calendar size={16} /> Calendar
          </button>
        </div>
      </div>

      {viewMode === 'CALENDAR' ? (
        <BookingCalendar bookings={bookings} />
      ) : (
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No bookings found. Head to the Workspaces page to book your first desk!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>WORKSPACE</th>
                    <th style={{ padding: '1rem' }}>DESK</th>
                    <th style={{ padding: '1rem' }}>DATE / TIME</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                    <th style={{ padding: '1rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{b.desk.workspace.workspaceName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} /> {b.desk.workspace.location}
                      </div>
                      {amenityStats[b.id] && amenityStats[b.id].length > 0 && (
                        <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {amenityStats[b.id].map(ar => (
                            <span key={ar.id} style={{ 
                              fontSize: '0.7rem', 
                              padding: '0.1rem 0.4rem', 
                              borderRadius: '0.3rem', 
                              background: '#f8fafc', 
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}>
                              <Package size={10} /> {ar.amenity.amenityName}: 
                              <span style={{ 
                                color: ar.reservationStatus === 'APPROVED' ? 'var(--success)' : (ar.reservationStatus === 'REQUESTED' ? '#d97706' : 'var(--error)'),
                                fontWeight: 700
                              }}>
                                {ar.reservationStatus}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>#{b.desk.deskNumber}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.desk.deskType}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {b.bookingDate}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        backgroundColor: `${getStatusColor(b.bookingStatus)}15`,
                        color: getStatusColor(b.bookingStatus)
                      }}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.bookingStatus === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleCheckIn(b.id)}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            Check In
                          </button>
                        )}
                        {b.bookingStatus === 'IN_USE' && (
                          <button 
                            onClick={() => handleCheckOut(b.id)}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: 'none', background: 'var(--success)', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            Check Out
                          </button>
                        )}
                        {(b.bookingStatus === 'REQUESTED' || b.bookingStatus === 'CONFIRMED') && (
                          <>
                            <button 
                              onClick={() => handleCancel(b.id)}
                              style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--error)', background: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                const newEnd = prompt("Enter new end time (HH:mm):", b.endTime.slice(0,5));
                                if (newEnd) handleUpdate(b.id, b.bookingDate, b.startTime.slice(0,5), newEnd);
                              }}
                              style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--secondary)', background: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              Modify
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default MyBookings;
