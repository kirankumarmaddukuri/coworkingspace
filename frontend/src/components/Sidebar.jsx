import React from 'react';
import { LayoutDashboard, Calendar, Box, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['ROLE_MEMBER', 'ROLE_SPACE_MANAGER', 'ROLE_ADMIN'] },
    { name: 'My Bookings', icon: <Calendar size={20} />, path: '/my-bookings', roles: ['ROLE_MEMBER'] },
    { name: 'Space Management', icon: <Box size={20} />, path: '/manage-spaces', roles: ['ROLE_SPACE_MANAGER', 'ROLE_ADMIN'] },
    { name: 'Admin Reports', icon: <ShieldCheck size={20} />, path: '/admin', roles: ['ROLE_ADMIN'] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'white', color: 'var(--primary)', padding: '0.4rem', borderRadius: '0.5rem' }}>GO</div>
        WORK
      </div>
      
      <div style={{ flex: 1 }}>
        {menuItems
          .filter(item => item.roles.includes(user?.roles[0]))
          .map(item => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.8rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '0.5rem',
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.name}</span>
            </div>
          ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--secondary)', padding: '0.5rem', borderRadius: '50%' }}>
            <UserIcon size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user?.roles[0].replace('ROLE_', '')}</div>
          </div>
        </div>
        <div 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', cursor: 'pointer', opacity: 0.8 }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
