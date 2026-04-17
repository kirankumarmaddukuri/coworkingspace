import React, { useState } from 'react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      // Backend returns { token, id, name, email, roles }
      login(response.data, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
      <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            width: '3.5rem', 
            height: '3.5rem', 
            borderRadius: '1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 15px -3px rgba(15, 76, 92, 0.3)'
          }}>
            <LogIn size={28} />
          </div>
          <h1 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to manage your workspace</p>
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fef2f2', 
            color: 'var(--error)', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                border: '1px solid var(--border)',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                border: '1px solid var(--border)',
                outline: 'none'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
