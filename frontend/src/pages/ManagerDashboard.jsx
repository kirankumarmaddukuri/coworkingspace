import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LayoutDashboard, Users, CheckCircle, Clock, Package, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import AmenityApproval from './AmenityApproval';

const ManagerDashboard = () => {
  const [activeBookings, setActiveBookings] = useState(0);
  const [pendingAmenities, setPendingAmenities] = useState(0);
  const [allBookings, setAllBookings] = useState([]);
  const [pendingBookingsList, setPendingBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('PENDING'); // PENDING, ACTIVITY

  useEffect(() => {
    fetchOperationalData();
  }, []);

  const fetchOperationalData = async () => {
    try {
      const [bookingsRes, amenitiesRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/amenity-reservations')
      ]);
      
      const allData = bookingsRes.data;
      setAllBookings(allData);
      setActiveBookings(allData.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'IN_USE').length);
      setPendingBookingsList(allData.filter(b => b.bookingStatus === 'REQUESTED'));
      
      setPendingAmenities(amenitiesRes.data.filter(r => r.reservationStatus === 'REQUESTED').length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingConfirm = async (id) => {
    try {
      await api.put(`/bookings/${id}/confirm`);
      fetchOperationalData();
    } catch (err) {
      alert("Failed to confirm booking: " + (err.response?.data || "Error"));
    }
  };

  if (loading) return <div>Loading manager overview...</div>;

  return (
    <div>
      <div className="stat-grid">
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Occupancy</h3>
            <div style={{ color: 'var(--primary)' }}><Users size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{activeBookings}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Across your center</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking Approvals</h3>
            <div style={{ color: 'var(--secondary)' }}><CalendarIcon size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{pendingBookingsList.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>Desk reservations pending</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amenity Requests</h3>
            <div style={{ color: 'var(--error)' }}><Package size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{pendingAmenities}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '0.5rem' }}>Resource requests pending</div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
        <button 
           onClick={() => setActiveView('PENDING')}
           style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: activeView === 'PENDING' ? 'var(--primary)' : 'white', color: activeView === 'PENDING' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
        >
          Approval Queue ({pendingBookingsList.length})
        </button>
        <button 
           onClick={() => setActiveView('ACTIVITY')}
           style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: activeView === 'ACTIVITY' ? 'var(--primary)' : 'white', color: activeView === 'ACTIVITY' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}
        >
          System Activity Log
        </button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {activeView === 'PENDING' ? (
          <>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Booking Approvals Queue</h2>
            <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>MEMBER</th>
                    <th style={{ padding: '1rem' }}>WORKSPACE / DESK</th>
                    <th style={{ padding: '1rem' }}>DATE & TIME</th>
                    <th style={{ padding: '1rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookingsList.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                       <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{b.user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.user.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{b.desk.workspace.workspaceName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} /> #{b.desk.deskNumber} ({b.desk.deskType})
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{b.bookingDate}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.startTime.slice(0,5)} - {b.endTime.slice(0,5)}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button 
                          onClick={() => handleBookingConfirm(b.id)}
                          style={{ 
                            border: 'none', 
                            background: '#f0fdf4', 
                            color: 'var(--success)', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '0.5rem', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                          }}
                        >
                          <CheckCircle size={18} /> Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pendingBookingsList.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No desk bookings awaiting approval.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Full System Activity</h2>
            <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem' }}>MEMBER</th>
                    <th style={{ padding: '1rem' }}>WORKSPACE</th>
                    <th style={{ padding: '1rem' }}>DATE</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                       <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{b.user.name}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.9rem' }}>{b.desk.workspace.workspaceName} (# {b.desk.deskNumber})</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.9rem' }}>{b.bookingDate}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.6rem', 
                          borderRadius: '0.4rem', 
                          fontSize: '0.7rem', 
                          fontWeight: 700,
                          background: b.bookingStatus === 'COMPLETED' ? '#f0fdf4' : (b.bookingStatus === 'CANCELLED' ? '#fef2f2' : '#eff6ff'),
                          color: b.bookingStatus === 'COMPLETED' ? 'var(--success)' : (b.bookingStatus === 'CANCELLED' ? 'var(--error)' : 'var(--secondary)')
                        }}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <AmenityApproval />
      </div>
    </div>
  );
};

export default ManagerDashboard;
