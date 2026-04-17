import React, { useState, useEffect } from 'react';
import { api, workspaceService, deskService, amenityService } from '../services/api';
import { Edit2, ToggleLeft, ToggleRight, PlusCircle, Package, X } from 'lucide-react';

const SpaceManagement = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWs, setSelectedWs] = useState(null);
    const [desks, setDesks] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('DESKS'); // DESKS, AMENITIES
    const [showModal, setShowModal] = useState({ type: null, data: null }); // 'WS', 'DESK', 'AMENITY'
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchWorkspaces();
        fetchAmenities();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await workspaceService.getAll();
            setWorkspaces(response.data);
            if (response.data.length > 0 && !selectedWs) {
                handleWsSelect(response.data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAmenities = async () => {
        try {
            const response = await amenityService.getAll();
            setAmenities(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleWsSelect = async (ws) => {
        setSelectedWs(ws);
        try {
            const response = await api.get(`/desks?workspaceId=${ws.id}`);
            setDesks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            if (showModal.type === 'WS') {
                await workspaceService.create({ 
                    ...formData, 
                    totalDesks: parseInt(formData.totalDesks),
                    availableDesks: parseInt(formData.totalDesks), 
                    status: 'ACTIVE' 
                });
            } else if (showModal.type === 'DESK') {
                await deskService.create(selectedWs.id, { 
                    ...formData, 
                    availabilityStatus: 'AVAILABLE' 
                });
            } else if (showModal.type === 'AMENITY') {
                await amenityService.create({ 
                    ...formData, 
                    availabilityStatus: 'AVAILABLE' 
                });
            }
            setShowModal({ type: null, data: null });
            setFormData({});
            fetchWorkspaces();
            if (selectedWs) handleWsSelect(selectedWs);
            fetchAmenities();
        } catch (err) {
            alert("Operation failed: " + (err.response?.data?.message || "Check your inputs"));
        }
    };

    const toggleDeskStatus = async (desk) => {
        const newStatus = desk.availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
        try {
            await api.put(`/desks/${desk.id}/status?status=${newStatus}`);
            if (selectedWs) {
                const response = await api.get(`/desks?workspaceId=${selectedWs.id}`);
                setDesks(response.data);
            }
        } catch (err) {
            alert("Failed to toggle status: " + (err.response?.data || "Error"));
        }
    };

    const toggleAmenityStatus = async (amenity) => {
        const newStatus = amenity.availabilityStatus === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
        try {
            await amenityService.updateStatus(amenity.id, newStatus);
            fetchAmenities();
        } catch (err) {
            alert("Failed to toggle status");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                <button 
                    onClick={() => setActiveTab('DESKS')}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', background: activeTab === 'DESKS' ? 'var(--primary)' : 'white', color: activeTab === 'DESKS' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
                >
                    Workspaces & Desks
                </button>
                <button 
                    onClick={() => setActiveTab('AMENITIES')}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', border: 'none', background: activeTab === 'AMENITIES' ? 'var(--primary)' : 'white', color: activeTab === 'AMENITIES' ? 'white' : 'var(--text-main)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}
                >
                    Shared Amenities
                </button>
            </div>

            {activeTab === 'DESKS' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2rem' }}>
                    <div className="glass-card" style={{ background: 'white', padding: '1.5rem', height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Workspaces</h3>
                            <button 
                                onClick={() => setShowModal({ type: 'WS' })}
                                style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}
                            >
                                <PlusCircle size={22} />
                            </button>
                        </div>
                        {workspaces.map(ws => (
                            <div
                                key={ws.id}
                                onClick={() => handleWsSelect(ws)}
                                style={{
                                    padding: '1.2rem',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    marginBottom: '0.75rem',
                                    backgroundColor: selectedWs?.id === ws.id ? '#f0fdf4' : 'white',
                                    border: selectedWs?.id === ws.id ? '2px solid var(--secondary)' : '1px solid var(--border)',
                                    transition: 'all 0.2s',
                                    transform: selectedWs?.id === ws.id ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                <div style={{ fontWeight: 700, color: selectedWs?.id === ws.id ? 'var(--secondary)' : 'var(--text-main)' }}>{ws.workspaceName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ws.location}</div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0 }}>Desks in {selectedWs?.workspaceName}</h3>
                            <button 
                                className="btn-primary" 
                                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                                onClick={() => setShowModal({ type: 'DESK' })}
                            >
                                + Add Desk
                            </button>
                        </div>
                        
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>DESK #</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>TYPE</th>
                                        <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>STATUS</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>MANAGEMENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {desks.map(desk => (
                                        <tr key={desk.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>#{desk.deskNumber}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '0.4rem', fontWeight: 600 }}>{desk.deskType}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ 
                                                    padding: '0.25rem 0.75rem', 
                                                    borderRadius: '1.5rem', 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 700,
                                                    backgroundColor: desk.availabilityStatus === 'AVAILABLE' ? '#f0fdf4' : '#fef2f2',
                                                    color: desk.availabilityStatus === 'AVAILABLE' ? 'var(--success)' : 'var(--error)'
                                                }}>
                                                    {desk.availabilityStatus}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        onClick={() => toggleDeskStatus(desk)}
                                                        style={{ background: 'none', border: 'none', color: desk.availabilityStatus === 'AVAILABLE' ? 'var(--success)' : 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                    >
                                                        {desk.availabilityStatus === 'AVAILABLE' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card" style={{ background: 'white', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ margin: 0 }}>Shared Amenities Inventory</h3>
                        <button className="btn-primary" style={{ padding: '0.6rem 1.5rem' }} onClick={() => setShowModal({ type: 'AMENITY' })}>
                            <Package size={18} style={{ marginRight: '0.5rem' }} /> Add Amenity
                        </button>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>AMENITY NAME</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>DESCRIPTION</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>STATUS</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {amenities.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem', fontWeight: 700 }}>{item.amenityName}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.description}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '0.25rem 0.75rem', 
                                                borderRadius: '1.5rem', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 700,
                                                backgroundColor: item.availabilityStatus === 'AVAILABLE' ? '#f0fdf4' : '#fffbeb',
                                                color: item.availabilityStatus === 'AVAILABLE' ? 'var(--success)' : '#d97706'
                                            }}>
                                                {item.availabilityStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => toggleAmenityStatus(item)}
                                                style={{ background: 'none', border: 'none', color: item.availabilityStatus === 'AVAILABLE' ? 'var(--success)' : 'var(--error)', cursor: 'pointer' }}
                                            >
                                                {item.availabilityStatus === 'AVAILABLE' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Premium Modals */}
            {showModal.type && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card" style={{ background: 'white', padding: '2.5rem', width: '450px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <button onClick={() => setShowModal({ type: null })} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
                        
                        <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                             {showModal.type === 'WS' && 'Create New Workspace'}
                             {showModal.type === 'DESK' && `Add Desk to ${selectedWs?.workspaceName}`}
                             {showModal.type === 'AMENITY' && 'Register Global Amenity'}
                        </h3>

                        <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {showModal.type === 'WS' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Workspace Name</label>
                                        <input required placeholder="e.g., Innovation Hub" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, workspaceName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Floor / Location</label>
                                        <input required placeholder="e.g., 4th Floor, Area B" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, location: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Capacity (Total Desks)</label>
                                        <input required type="number" min="1" placeholder="e.g., 20" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, totalDesks: e.target.value})} />
                                    </div>
                                </>
                            )}

                            {showModal.type === 'DESK' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Desk Identifier</label>
                                        <input required placeholder="e.g., D-101" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, deskNumber: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Desk Category</label>
                                        <select required style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, deskType: e.target.value})}>
                                            <option value="">Select Type</option>
                                            <option value="HOT_DESK">Hot Desk</option>
                                            <option value="DEDICATED_DESK">Dedicated Desk</option>
                                            <option value="PRIVATE_OFFICE">Private Office</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {showModal.type === 'AMENITY' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Amenity Branding</label>
                                        <input required placeholder="e.g., High-Speed Fiber" style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem' }} onChange={e => setFormData({...formData, amenityName: e.target.value})} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Service Description</label>
                                        <textarea required rows="3" placeholder="Explain what is included..." style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border)', marginTop: '0.5rem', fontFamily: 'inherit' }} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem', fontSize: '1rem' }}>
                                Confirm Creation
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpaceManagement;
