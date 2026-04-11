import React, { useState, useEffect } from 'react';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';
import { prescriptionService } from '../services/prescriptionService';
import { patientService } from '../services/patientService';

/* ── Icon helpers ── */
const BellIcon = ({ color = '#00BFB3' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
);

const RxIcon = ({ color = '#00BFB3' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const CheckIcon = ({ color = '#10B981' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
    </svg>
);

const UserPlusIcon = ({ color = '#6366F1' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
);

const AlertIcon = ({ color = '#EF4444' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);

/* ── Relative time formatter ── */
const relativeTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

/* ── Convert real data → notification items ── */
const buildNotifications = (prescriptions = [], patients = []) => {
    const list = [];

    // 1. Pending prescriptions → "Prescription Pending" notifications
    prescriptions
        .filter(p => ['PENDING', 'CREATED', 'ISSUED'].includes((p.status || '').toUpperCase()))
        .slice(0, 5)
        .forEach(p => {
            list.push({
                id: `rx-${p.id}`,
                type: 'PRESCRIPTION',
                title: `Prescription Pending`,
                body: `Rx for ${p.patient_name || 'a patient'} is awaiting dispensing.`,
                time: relativeTime(p.created_at),
                createdAt: new Date(p.created_at),
                unread: true,
                icon: 'rx',
                bg: '#F0FDFA', border: '#CCFBF1', iconBg: '#E6FFFA', iconColor: '#00BFB3',
                typeColor: '#00BFB3',
            });
        });

    // 2. Dispensed prescriptions → "Dispensed" notifications
    prescriptions
        .filter(p => (p.status || '').toUpperCase() === 'DISPENSED')
        .slice(0, 3)
        .forEach(p => {
            list.push({
                id: `disp-${p.id}`,
                type: 'DISPENSED',
                title: `Prescription Dispensed`,
                body: `Rx for ${p.patient_name || 'a patient'} has been dispensed successfully.`,
                time: relativeTime(p.created_at),
                createdAt: new Date(p.created_at),
                unread: false,
                icon: 'check',
                bg: '#fff', border: '#F3F4F6', iconBg: '#F0FDF4', iconColor: '#10B981',
                typeColor: '#10B981',
            });
        });

    // 3. New (unvisited) patients → "New Patient Registered"
    patients
        .filter(p => !p.is_visited || p.is_visited === 0)
        .slice(0, 3)
        .forEach(p => {
            list.push({
                id: `pt-${p.id}`,
                type: 'NEW PATIENT',
                title: `New Patient Registered`,
                body: `${p.name || 'A patient'} (${p.pid || `PID-${p.id}`}) has been added to your department.`,
                time: relativeTime(p.created_at),
                createdAt: p.created_at ? new Date(p.created_at) : new Date(),
                unread: true,
                icon: 'user',
                bg: '#F5F3FF', border: '#EDE9FE', iconBg: '#EDE9FE', iconColor: '#6366F1',
                typeColor: '#6366F1',
            });
        });

    // Sort by date descending
    list.sort((a, b) => b.createdAt - a.createdAt);

    return list;
};

const NotificationCard = ({ n, onRead }) => {
    const iconMap = {
        rx:    <RxIcon      color={n.iconColor} />,
        check: <CheckIcon   color={n.iconColor} />,
        user:  <UserPlusIcon color={n.iconColor} />,
        alert: <AlertIcon   color={n.iconColor} />,
    };

    return (
        <div
            onClick={onRead}
            style={{
                backgroundColor: n.bg,
                border: `1.5px solid ${n.unread ? n.border : '#F3F4F6'}`,
                borderRadius: '28px', padding: '20px 24px',
                display: 'flex', gap: '18px', position: 'relative',
                boxShadow: n.unread ? '0 6px 20px rgba(0,0,0,0.04)' : '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease', cursor: 'pointer'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
            {/* Icon */}
            <div style={{
                width: '50px', height: '50px', borderRadius: '16px',
                backgroundColor: n.iconBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                {iconMap[n.icon] || <BellIcon color={n.iconColor} />}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                        fontSize: '10px', fontWeight: '900', textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: n.typeColor,
                    }}>
                        {n.type}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {n.time}
                    </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#111827', margin: '0 0 4px 0', lineHeight: '1.25' }}>
                    {n.title}
                </h3>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', margin: 0, lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.body}
                </p>
            </div>

            {/* Unread dot */}
            {n.unread && (
                <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#00BFB3'
                }} />
            )}
        </div>
    );
};

/* ── Main Page ── */
const DoctorNotificationsPage = () => {
    const user = authService.getCurrentUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readIds, setReadIds] = useState(new Set());

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [prescData, ptData] = await Promise.all([
                    prescriptionService.getPrescriptionsByDoctor(user?.id),
                    patientService.getPatients(),
                ]);
                const built = buildNotifications(
                    Array.isArray(prescData) ? prescData : [],
                    Array.isArray(ptData) ? ptData : []
                );
                setNotifications(built);
            } catch (err) {
                console.error('Notifications load error:', err);
                setError('Could not load notifications. Please refresh.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user?.id]);

    const markRead = (id) => setReadIds(prev => new Set([...prev, id]));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    const unreadCount = notifications.filter(n => n.unread && !readIds.has(n.id)).length;

    const displayedNotifications = notifications.map(n => ({
        ...n,
        unread: n.unread && !readIds.has(n.id),
    }));

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '90px', fontFamily: "'Inter', sans-serif" }}>

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#111827', marginBottom: '6px', margin: '0 0 6px 0' }}>Updates</h1>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#9CA3AF', margin: 0 }}>
                            {loading ? 'Loading...' : `${unreadCount} unread clinical alert${unreadCount !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BellIcon />
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', color: '#EF4444', fontWeight: '700', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {/* ── Loading skeletons ── */}
                {loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: '28px', padding: '24px', display: 'flex', gap: '18px', border: '1.5px solid #F3F4F6' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '16px', backgroundColor: '#E2E8F0', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: '10px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginBottom: '10px', width: '30%' }} />
                                    <div style={{ height: '16px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginBottom: '8px', width: '70%' }} />
                                    <div style={{ height: '12px', backgroundColor: '#E2E8F0', borderRadius: '6px', width: '90%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Notification List ── */}
                {!loading && (
                    displayedNotifications.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                            {displayedNotifications.map(n => (
                                <NotificationCard
                                    key={n.id}
                                    n={n}
                                    onRead={() => markRead(n.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 0', border: '2px dashed #F3F4F6', borderRadius: '28px', backgroundColor: '#FAFAFA' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                <BellIcon />
                            </div>
                            <p style={{ color: '#9CA3AF', fontSize: '16px', fontWeight: '700' }}>No notifications yet</p>
                            <p style={{ color: '#D1D5DB', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Clinical alerts will appear here once activity begins.</p>
                        </div>
                    )
                )}

                {/* ── Mark All Read ── */}
                {!loading && unreadCount > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <button
                            onClick={markAllRead}
                            style={{ background: 'none', border: 'none', color: '#00BFB3', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                        >
                            ✓ Mark all as read
                        </button>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default DoctorNotificationsPage;
