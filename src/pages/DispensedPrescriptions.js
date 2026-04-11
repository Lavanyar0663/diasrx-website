import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { prescriptionService } from '../services/prescriptionService';

const DispensedPrescriptionsPage = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDispensed = async () => {
            setLoading(true);
            try {
                const data = await prescriptionService.getPrescriptions();
                // Filter for DISPENSED status
                const dispensed = data.filter(p => p.status?.toUpperCase() === 'DISPENSED');
                setPrescriptions(dispensed);
            } catch (err) {
                console.error("Failed to fetch dispensed prescriptions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDispensed();
    }, []);

    const filtered = prescriptions.filter(p => 
        p.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm)
    );

    return (
        <PharmacistLayout title="Dispensed Prescriptions">
            {/* Search Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: '#fff', border: '1.5px solid #F3F4F6',
                borderRadius: '16px', padding: '14px 20px', marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                    type="text" 
                    placeholder="Search by patient name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', color: '#111827' }}
                />
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '50px', color: '#6B7280' }}>Loading dispensed prescriptions...</p>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '24px' }}>
                    <p style={{ color: '#9CA3AF', fontWeight: '600' }}>No dispensed prescriptions found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => navigate(`/prescription-detail/${item.id}`, { state: { prescription: item } })}
                            style={{
                            backgroundColor: '#fff', borderRadius: '20px', padding: '20px 24px',
                            border: '1px solid #F3F4F6', cursor: 'pointer', transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                        onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)'}
                        onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6 9 17 4 12"/></svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>{item.patient_name}</h3>
                                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#22C55E' }}>{item.formatted_date || new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: '13px', fontWeight: '500', color: '#6B7280', marginTop: '2px' }}>ID: #RX-{item.id} • {item.drugs?.length || 0} Medicines</p>
                            </div>
                            <div style={{ color: '#E5E7EB' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PharmacistLayout>
    );
};

export default DispensedPrescriptionsPage;
