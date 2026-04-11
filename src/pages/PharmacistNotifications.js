import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { authService } from '../services/authService';
import { prescriptionService } from '../services/prescriptionService';

const IconForType = ({ icon, color }) => {
    switch (icon) {
        case 'urgent':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
        case 'rx':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M10 2 2 10l8 8 8-8-8-8z" /><circle cx="10" cy="10" r="3" /></svg>; // pill-like symbol
        case 'shield':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
        case 'inventory':
            return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
        default:
            return null;
    }
}

const PharmacistNotificationsPage = () => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifs = async () => {
            setLoading(true);
            try {
                const pendings = await prescriptionService.getPendingPrescriptions();
                const mapped = (pendings || []).slice(0, 8).map((p, i) => {
                    const isRecent = i < 2; // Arbitrary logic to make first few pop out
                    const docName = p.doctor_name || 'System';
                    const patName = p.patient_name || 'Unknown Patient';
                    
                    return {
                        id: p.id,
                        type: 'New Prescription',
                        title: `Patient: ${patName}`,
                        body: p.drugs && p.drugs.length > 0 ? `To dispense ${p.drugs.length} item(s). Prescribed by Dr. ${docName}` : `Prescribed by Dr. ${docName}`,
                        time: p.iso_created_at ? new Date(p.iso_created_at).toLocaleDateString() : 'Recent',
                        icon: 'rx',
                        unread: isRecent,
                        bg: isRecent ? '#F0FDFA' : '#fff',
                        border: isRecent ? '#CCFBF1' : '#F3F4F6',
                        iconBg: isRecent ? '#E6FFFA' : '#F3F4F6',
                        iconColor: isRecent ? '#00E3D3' : '#9CA3AF'
                    };
                });

                // Add a static System Alert for realism to match app
                if (mapped.length > 0) {
                    mapped.splice(1, 0, {
                        id: 'sys-1', type: 'System Update', title: 'Access Approved', body: 'Your access to the High-Risk Medication Vault has been granted.',
                        time: '2h ago', icon: 'shield', unread: false, bg: '#fff', border: '#F3F4F6', iconBg: '#F3F4F6', iconColor: '#6B7280'
                    });
                }
                
                setNotifications(mapped);
            } catch (err) {
                console.error("Failed to load notifications", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({...n, unread: false, bg: '#fff', border: '#F3F4F6', iconBg: '#F3F4F6', iconColor: '#9CA3AF'})));
    };

    return (
        <PharmacistLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px', fontFamily: "'Inter', sans-serif" }}>
                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>Notifications</h1>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#6B7280', margin: 0 }}>Hospital-wide alerts</p>
                    </div>
                    {/* Mark All Read Button */}
                    <div>
                        <button onClick={markAllRead} style={{
                            width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E5E7EB',
                            backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }} title="Mark all as read">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {loading && <p style={{ color: '#9CA3AF', fontSize: '15px' }}>Loading alerts...</p>}
                {!loading && notifications.length === 0 && (
                    <p style={{ color: '#9CA3AF', fontSize: '15px' }}>No pending alerts at the moment.</p>
                )}

                {/* ── Today List ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {notifications.map(n => (
                        <div key={n.id} style={{
                            backgroundColor: n.bg, border: `1px solid ${n.border}`, borderRadius: '24px',
                            padding: '20px', display: 'flex', gap: '16px', position: 'relative',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                            {/* Icon */}
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: n.iconBg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <IconForType icon={n.icon} color={n.iconColor} />
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em',
                                        backgroundColor: n.type === 'URGENT' ? '#FEE2E2' : (n.type === 'New Prescription' ? '#E6FCFA' : 'transparent'),
                                        color: n.type === 'URGENT' ? '#EF4444' : (n.type === 'New Prescription' ? '#00BFB3' : '#6B7280'),
                                        padding: n.type === 'URGENT' || n.type === 'New Prescription' ? '4px 8px' : '0',
                                        borderRadius: '6px'
                                    }}>
                                        {n.type === 'URGENT' ? 'URGENT REQUEST' : n.type}
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                                        {n.time}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                                    {n.title}
                                </h3>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>
                                    {n.body}
                                </p>
                            </div>

                            {/* Unread Dot */}
                            {n.unread && (
                                <div style={{ position: 'absolute', right: '20px', bottom: '20px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E3D3' }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PharmacistLayout>
    );
};

export default PharmacistNotificationsPage;
