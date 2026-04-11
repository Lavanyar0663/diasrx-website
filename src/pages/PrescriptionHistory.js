import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { prescriptionService } from '../services/prescriptionService';
import { getAvatarUrl } from '../utils/helpers';
import { eventBus } from '../utils/eventBus';

const TABS = ['All', 'Pending', 'Dispensed'];

const StatusBadge = ({ status }) => {
    const s = status || 'Pending';
    const map = {
        'PENDING':   { bg: '#FFF7ED', color: '#F97316', label: 'Pending' },
        'CREATED':   { bg: '#FFF7ED', color: '#F97316', label: 'Pending' },
        'DISPENSED': { bg: '#F0FDF4', color: '#22C55E', label: 'Dispensed' },
    };
    const style = map[s.toUpperCase()] || map['PENDING'];
    return (
        <span style={{
            fontSize: '11px', fontWeight: '900', padding: '6px 14px',
            borderRadius: '20px', letterSpacing: '0.04em', textTransform: 'uppercase',
            backgroundColor: style.bg, color: style.color,
            border: `1px solid ${style.bg === '#FFF7ED' ? '#FFEDD5' : '#BBF7D0'}`
        }}>
            {style.label}
        </span>
    );
};

const PrescriptionHistoryPage = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab]  = useState('All');
    const [search, setSearch]        = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await prescriptionService.getPrescriptionHistory();
                setPrescriptions(data || []);
            } catch (err) {
                console.error("Failed to fetch prescription history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // 1. Sync Listeners
        const unsub = eventBus.on((type) => {
            if (type === 'prescriptionsUpdated') fetchHistory();
        });

        // 2. Polling
        const pollId = setInterval(fetchHistory, 30000);

        return () => {
            unsub();
            clearInterval(pollId);
        };
    }, []);

    const filtered = prescriptions.filter(p => {
        const q = search.toLowerCase();
        const matchQ = (p.patient_name || '').toLowerCase().includes(q) || 
                      (p.id || '').toString().includes(q) ||
                      (p.patient_id || '').toString().includes(q);
        if (!matchQ) return false;
        
        const status = (p.status || 'Pending').toUpperCase();
        if (activeTab === 'Pending')   return status === 'PENDING' || status === 'CREATED' || status === '';
        if (activeTab === 'Dispensed') return status === 'DISPENSED';
        return true;
    });

    return (
        <PharmacistLayout title="Prescription History">
            {/* ── Search Container ── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: '#fff', border: '1.5px solid #E5E7EB', borderRadius: '16px', 
                padding: '14px 20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search by Patient Name or RX ID..."
                    style={{
                        border: 'none', outline: 'none', background: 'transparent',
                        fontSize: '15px', fontWeight: '600', color: '#374151', width: '100%'
                    }}
                />
            </div>

            {/* ── Tabs Container ── */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 28px', border: 'none', borderRadius: '14px',
                            fontSize: '14px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
                            backgroundColor: activeTab === tab ? '#111827' : '#F3F4F6',
                            color: activeTab === tab ? '#fff' : '#6B7280',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* ── Prescription List ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF', fontWeight: '700' }}>Refreshing clinical history...</p>
                ) : filtered.length > 0 ? (
                    filtered.map((p, index) => {
                        const avatarUrl = getAvatarUrl(p.patient_avatar, p.gender || p.sex, p.patient_id || p.patient_name);
                        
                        return (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/prescription-detail/${p.id}`, { state: { prescription: p } })}
                                style={{
                                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 28px',
                                    display: 'flex', alignItems: 'center', gap: '20px',
                                    border: '1px solid #E5E7EB', cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                }}
                                onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'}
                                onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexShrink: 0, border: '1px solid #E5E7EB' }}>
                                    <img 
                                        src={avatarUrl} 
                                        alt="patient" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        onError={e => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.style.backgroundColor = '#F1F5F9';
                                            e.target.parentElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#94A3B8" style="margin:auto;display:block;padding-top:16px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '18px', fontWeight: '900', color: '#111827', marginBottom: '2px' }}>{p.patient_name || 'Unknown Patient'}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 8h-4a2 2 0 0 0-2 2v10H8V10a2 2 0 0 0-2-2H2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                                        <span style={{ fontSize: '13px', fontWeight: '700' }}>RX-#{p.id}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <StatusBadge status={p.status || 'Pending'} />
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF' }}>{p.formatted_date || new Date(p.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 0', border: '2px dashed #E5E7EB', borderRadius: '28px', backgroundColor: '#F9FAFB' }}>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: '#9CA3AF' }}>No clinical records match your search</p>
                    </div>
                )}
            </div>
        </PharmacistLayout>
    );
};

export default PrescriptionHistoryPage;
