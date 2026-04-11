import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { prescriptionService } from '../services/prescriptionService';
import { getAvatarUrl } from '../utils/helpers';

const Avatar = ({ gender, avatar_url, name }) => (
    <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        backgroundColor: (gender || '').toString().toLowerCase() === 'female' || (gender || '').toString().toLowerCase() === 'f' ? '#F0FDFA' : 
                        (gender || '').toString().toLowerCase() === 'male' || (gender || '').toString().toLowerCase() === 'm' ? '#EFF6FF' : '#F8FAFC',
        border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
    }}>
        <img 
            src={getAvatarUrl(avatar_url, gender, name)} 
            alt="" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} 
        />
    </div>
);

const TABS = ['All', 'Pending', 'Dispensed'];

const PendingPrescriptionsPage = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Pending');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPending = async () => {
            setLoading(true);
            try {
                const data = await prescriptionService.getPendingPrescriptions();
                setPrescriptions(data || []);
            } catch (err) {
                console.error("Failed to fetch pending prescriptions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const filterItem = (item) => {
        const matchSearch = item.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.patient_display_id?.toString().includes(search);
        if (!matchSearch) return false;
        return true;
    };

    return (
        <PharmacistLayout title="Pending Prescriptions">
            {/* Search Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div style={{
                    flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: '10px',
                    backgroundColor: '#fff', border: '1.5px solid #E5E7EB', borderRadius: '14px',
                    padding: '12px 18px'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search pending prescriptions..."
                        style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: '500', color: '#374151', width: '100%', background: 'transparent' }}
                    />
                </div>
                <button style={{
                    padding: '12px 16px', backgroundColor: '#fff', border: '1.5px solid #E5E7EB',
                    borderRadius: '14px', cursor: 'pointer'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 20px', borderRadius: '24px', border: 'none',
                            fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease',
                            backgroundColor: activeTab === tab ? '#111827' : '#F3F4F6',
                            color: activeTab === tab ? '#fff' : '#6B7280'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <p style={{ textAlign: 'center', padding: '50px', color: '#6B7280' }}>Loading pending prescriptions...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {prescriptions.filter(filterItem).map(item => (
                        <div key={item.id} style={{
                            backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px',
                            border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s ease',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                        }}
                            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                            onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                            onClick={() => navigate('/prescription-detail', { state: { prescription: item } })}
                        >
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                                <Avatar gender={item.pat_gender} avatar_url={item.avatar_url} name={item.patient_name} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                        <p style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{item.patient_name}</p>
                                        <span style={{ backgroundColor: '#FFF7ED', color: '#F97316', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' }}>
                                            + Pending
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginTop: '2px' }}>
                                        #{item.patient_display_id || item.patient_id} • {item.doctor_department || 'General Medicine'}
                                    </p>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>{item.diagnosis}</p>

                            {/* Medicines Summary */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E3D3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 8h-4a2 2 0 0 0-2 2v10H8V10a2 2 0 0 0-2-2H2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280' }}>
                                        Prescribed by Dr. {item.doctor_name || 'Staff'}
                                    </span>
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                                    {item.formatted_date || new Date(item.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {prescriptions.filter(filterItem).length === 0 && (
                        <p style={{ textAlign: 'center', padding: '50px', color: '#9CA3AF', fontStyle: 'italic' }}>
                            No pending prescriptions found.
                        </p>
                    )}
                </div>
            )}
        </PharmacistLayout>
    );
};

export default PendingPrescriptionsPage;
