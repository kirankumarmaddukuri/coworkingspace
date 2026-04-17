import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Users, UserPlus, Filter, Trash2, ShieldCheck, Mail, Phone } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll(roleFilter);
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await userService.delete(id);
            fetchUsers();
        } catch (err) {
            alert("Deletion failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.create(formData);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', role: 'MEMBER', phoneNumber: '' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "User creation failed");
        }
    };

    if (loading) return <div>Loading user directory...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users color="var(--primary)" /> User Directory
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage system access and roles across the organization</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                >
                    <UserPlus size={18} /> Add User
                </button>
            </div>

            <div className="glass-card" style={{ background: 'white', padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Filter size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Filter by Role:</span>
                <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid var(--border)' }}
                >
                    <option value="">All Roles</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="SPACE_MANAGER">Space Manager</option>
                    <option value="MEMBER">Member</option>
                </select>
            </div>

            <div className="glass-card" style={{ background: 'white', padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>NAME</th>
                            <th style={{ padding: '1rem' }}>CONTACT</th>
                            <th style={{ padding: '1rem' }}>ROLE</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{u.id}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <Mail size={12} /> {u.email}
                                    </div>
                                    {u.phoneNumber && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <Phone size={12} /> {u.phoneNumber}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.2rem 0.6rem', 
                                        borderRadius: '0.4rem', 
                                        fontSize: '0.7rem', 
                                        fontWeight: 700,
                                        background: u.role === 'ADMIN' ? '#fef2f2' : (u.role === 'SPACE_MANAGER' ? '#eff6ff' : '#f0fdf4'),
                                        color: u.role === 'ADMIN' ? '#dc2626' : (u.role === 'SPACE_MANAGER' ? '#2563eb' : '#059669'),
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.3rem'
                                    }}>
                                        <ShieldCheck size={12} /> {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="glass-card" style={{ background: 'white', padding: '2rem', width: '400px' }}>
                        <h3>Add New User</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                            <input 
                                placeholder="Full Name" 
                                required 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                            <input 
                                placeholder="Email Address" 
                                type="email" 
                                required 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                            <input 
                                placeholder="Temporary Password" 
                                type="password" 
                                required 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                            <select 
                                value={formData.role} 
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            >
                                <option value="ADMIN">Administrator</option>
                                <option value="SPACE_MANAGER">Space Manager</option>
                                <option value="MEMBER">Member</option>
                            </select>
                            <input 
                                placeholder="Phone Number" 
                                value={formData.phoneNumber} 
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create User</button>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid var(--border)', background: 'none', borderRadius: '0.5rem' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
