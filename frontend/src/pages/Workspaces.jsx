import React, { useState, useEffect } from 'react';
import { workspaceService } from '../services/api';
import { MapPin, Users, ArrowRight, PlusCircle, Monitor, Briefcase, Users as UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, HOT_DESK, DEDICATED_DESK, MEETING_ROOM
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await workspaceService.getAll();
        setWorkspaces(response.data);
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const filteredWorkspaces = workspaces.filter(ws => filter === 'ALL' || ws.type === filter);

  if (loading) return <div>Loading workspaces...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Browse Workspaces</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['ALL', 'HOT_DESK', 'DEDICATED_DESK', 'MEETING_ROOM'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              border: '1px solid var(--border)',
              background: filter === type ? 'var(--secondary)' : 'white',
              color: filter === type ? 'white' : 'var(--text-main)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="stat-grid">
        {filteredWorkspaces.map(ws => (
          <div key={ws.id} className="glass-card" style={{ background: 'white', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '160px', background: 'linear-gradient(45deg, var(--primary), var(--secondary))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {ws.type === 'HOT_DESK' && <Monitor size={48} color="white" opacity={0.5} />}
              {ws.type === 'DEDICATED_DESK' && <Briefcase size={48} color="white" opacity={0.5} />}
              {ws.type === 'MEETING_ROOM' && <UsersIcon size={48} color="white" opacity={0.5} />}
              <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>
                {ws.workspaceName}
              </div>
            </div>
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <MapPin size={16} />
                {ws.location}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{ws.availableDesks} / {ws.totalDesks}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>available</span>
                </div>
                <div style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  backgroundColor: ws.status === 'ACTIVE' ? '#f0fdf4' : '#fef2f2',
                  color: ws.status === 'ACTIVE' ? 'var(--success)' : 'var(--error)'
                }}>
                  {ws.status}
                </div>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => navigate(`/workspace/${ws.id}`)}
              >
                Select Workspace <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
        {workspaces.length === 0 && (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', background: 'white' }}>
            <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}><PlusCircle size={48} /></div>
            <h3>No Workspaces Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Spaces need to be created by an Admin or Space Manager first.</p>
            <button className="btn-primary" onClick={() => navigate('/manage-spaces')}>Go to Management</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspaces;
