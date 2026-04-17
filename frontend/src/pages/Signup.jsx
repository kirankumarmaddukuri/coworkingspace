import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'MEMBER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.signup(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--secondary)', 
            color: 'white', 
            width: '3.5rem', 
            height: '3.5rem', 
            borderRadius: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(20, 184, 166, 0.3)'
          }}>
            <UserPlus size={28} />
          </div>
          <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join our co-working community</p>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: 'var(--error)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', color: 'var(--success)', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                required
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Role</label>
              <select
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)', background: 'white' }}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="MEMBER">Member</option>
                <option value="SPACE_MANAGER">Space Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              required
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
            <input
              type="text"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>Login instead</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
