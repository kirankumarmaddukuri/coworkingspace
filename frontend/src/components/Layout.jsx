import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShieldAlert, Key, X } from 'lucide-react';
import { authService } from '../services/api';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await authService.changePassword(formData);
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(() => {
        onClose();
        setFormData({ currentPassword: '', newPassword: '' });
        setMsg({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.response?.data || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
       <div className="glass-card" style={{ background: 'white', padding: '2rem', width: '380px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', right: '1rem', top: '1rem', border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert color="var(--primary)" size={20} /> Security Settings
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
               <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Current Password</label>
               <input 
                 type="password" 
                 required 
                 value={formData.currentPassword}
                 onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                 style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.4rem' }} 
               />
            </div>
            <div>
               <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>New Password</label>
               <input 
                 type="password" 
                 required 
                 minLength={6}
                 value={formData.newPassword}
                 onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                 style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.4rem' }} 
               />
            </div>
            {msg.text && (
              <div style={{ fontSize: '0.8rem', color: msg.type === 'success' ? 'var(--success)' : 'var(--error)', textAlign: 'center' }}>
                {msg.text}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
               {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
       </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <Sidebar />
      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <main className="main-content">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Overview</div>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Welcome back, {user.name}!</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <button 
               onClick={() => setIsModalOpen(true)}
               style={{ border: '1px solid var(--border)', background: 'white', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
               <Key size={16} color="var(--secondary)" /> Security
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
              onClick={() => window.location.href = '/workspaces'}
            >
              + New Booking
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
