import React, { useState, useEffect } from 'react';
import { reportService, api } from '../services/api';
import { BarChart3, TrendingUp, Cpu, PieChart, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [bookingStats, setBookingStats] = useState({});
  const [amenityStats, setAmenityStats] = useState({});
  const [utilization, setUtilization] = useState(0);
  const [loading, setLoading] = useState(true);

  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [bRes, aRes, uRes, allRes] = await Promise.all([
          reportService.getBookingStats(),
          reportService.getAmenityStats(),
          reportService.getUtilization(),
          api.get('/bookings')
        ]);
        setBookingStats(bRes.data);
        setAmenityStats(aRes.data);
        setUtilization(uRes.data.overallDeskUtilization);
        setAllBookings(allRes.data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = () => {
    if (allBookings.length === 0) return alert("No data to export");
    
    const headers = ["Member Name", "Email", "Workspace", "Desk", "Date", "Start Time", "End Time", "Status"];
    const rows = allBookings.map(b => [
      b.user.name,
      b.user.email,
      b.desk.workspace.workspaceName,
      b.desk.deskNumber,
      b.bookingDate,
      b.startTime,
      b.endTime,
      b.bookingStatus
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coworking_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Generating strategic overview...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Strategic Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive system analytics and performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin/users" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <Users size={16} /> Manage Users
          </Link>
          <button 
            onClick={handleExport}
            className="btn-primary" 
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', background: 'var(--secondary)' }}
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '1rem', color: 'var(--success)' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Desk Utilization</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{utilization.toFixed(1)}%</div>
          </div>
        </div>
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '1rem', color: '#3b82f6' }}>
            <BarChart3 size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Workspaces</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Object.keys(bookingStats).length}</div>
          </div>
        </div>
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '1rem', color: '#f59e0b' }}>
            <Cpu size={32} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Bookings</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{allBookings.filter(b => b.bookingStatus === 'IN_USE').length}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} color="var(--primary)" /> Bookings by Workspace
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(bookingStats).map(([name, count]) => (
              <div key={name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{count} bookings</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: 'var(--secondary)', 
                    width: `${Math.min(100, (count / 10) * 100)}%`,
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="var(--primary)" /> Popular Amenities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(amenityStats).map(([name, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <BarChart3 size={18} color="var(--secondary)" />
                  </div>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reservations</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Global Booking Log</h3>
        <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MEMBER</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SPACE</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATE</th>
                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.slice(0, 10).map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{b.user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{b.desk.workspace.workspaceName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Desk #{b.desk.deskNumber}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>{b.bookingDate}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.startTime.slice(0,5)} - {b.endTime.slice(0,5)}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '0.4rem', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      background: b.bookingStatus === 'CONFIRMED' ? '#f0fdf4' : (b.bookingStatus === 'CANCELLED' ? '#fef2f2' : '#eff6ff'),
                      color: b.bookingStatus === 'CONFIRMED' ? 'var(--success)' : (b.bookingStatus === 'CANCELLED' ? 'var(--error)' : 'var(--secondary)')
                    }}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
