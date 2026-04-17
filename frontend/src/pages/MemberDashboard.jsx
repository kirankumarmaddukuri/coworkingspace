import React, { useState, useEffect } from 'react';
import { bookingService, workspaceService } from '../services/api';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MemberDashboard = () => {
  const [stats, setStats] = useState({ active: 0, completed: 0, cancelled: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await bookingService.getMy();
        const bookings = response.data;
        setRecentBookings(bookings.slice(0, 5));
        
        const counts = bookings.reduce((acc, b) => {
          acc[b.bookingStatus.toLowerCase()] = (acc[b.bookingStatus.toLowerCase()] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          active: (counts.confirmed || 0) + (counts.requested || 0) + (counts.in_use || 0),
          completed: counts.completed || 0,
          cancelled: counts.cancelled || 0
        });
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'CONFIRMED': return { color: '#059669', bg: '#ecfdf5' };
      case 'CANCELLED': return { color: '#dc2626', bg: '#fef2f2' };
      case 'REQUESTED': return { color: '#d97706', bg: '#fffbeb' };
      default: return { color: '#4b5563', bg: '#f3f4f6' };
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="stat-grid">
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Active Reservations</h3>
            <div style={{ color: 'var(--secondary)' }}><Calendar size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.active}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem' }}>↗ 12% from last week</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Completed Visits</h3>
            <div style={{ color: 'var(--success)' }}><CheckCircle size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.completed}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Across all workspaces</div>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Cancelled</h3>
            <div style={{ color: 'var(--error)' }}><AlertCircle size={20} /></div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.cancelled}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No impact on credits</div>
        </div>
      </div>

      <div className="glass-card" style={{ background: 'white', padding: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>WORKSPACE / DESK</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATE</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIME</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{b.desk.workspace.workspaceName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desk #{b.desk.deskNumber}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{b.bookingDate}</td>
                  <td style={{ padding: '1rem' }}>{b.startTime.slice(0, 5)} - {b.endTime.slice(0, 5)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: getStatusStyle(b.bookingStatus).bg,
                      color: getStatusStyle(b.bookingStatus).color
                    }}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                   <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No recent activity found. Start by booking a desk!
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
