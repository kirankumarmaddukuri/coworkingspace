import React, { useState, useEffect } from 'react';
import { api, bookingService } from '../services/api';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';

const AmenityApproval = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/amenity-reservations');
      setReservations(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/amenity-reservations/${id}/${action}`);
      fetchReservations();
    } catch (err) {
      alert("Action failed: " + (err.response?.data || "Could not process"));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Resource Approval Queue</h2>
      <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>MEMBER</th>
              <th style={{ padding: '1rem' }}>AMENITY</th>
              <th style={{ padding: '1rem' }}>BOOKING REF</th>
              <th style={{ padding: '1rem' }}>STATUS</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>{res.booking.user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.booking.user.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={16} /> {res.amenity.amenityName}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                   <div style={{ fontSize: '0.9rem' }}>Desk #{res.booking.desk.deskNumber}</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.booking.bookingDate}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: res.reservationStatus === 'APPROVED' ? '#f0fdf4' : (res.reservationStatus === 'REJECTED' ? '#fef2f2' : '#fffbeb'),
                    color: res.reservationStatus === 'APPROVED' ? 'var(--success)' : (res.reservationStatus === 'REJECTED' ? 'var(--error)' : '#d97706')
                  }}>
                    {res.reservationStatus}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  {res.reservationStatus === 'REQUESTED' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleAction(res.id, 'approve')}
                        style={{ border: 'none', background: '#f0fdf4', color: 'var(--success)', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                         onClick={() => handleAction(res.id, 'reject')}
                         style={{ border: 'none', background: '#fef2f2', color: 'var(--error)', padding: '0.4rem', borderRadius: '0.4rem', cursor: 'pointer' }}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No pending reservations to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmenityApproval;
