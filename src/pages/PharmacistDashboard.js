import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { authService } from '../services/authService';
import { prescriptionService } from '../services/prescriptionService';
import { getAvatarUrl } from '../utils/helpers';
import { eventBus } from '../utils/eventBus';

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

/* ── Donut / Ring chart (SVG) ── */
const DonutChart = ({ percent, size = 96, stroke = 12 }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (percent / 100) * circ;
    const cx = size / 2;

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* track */}
            <circle cx={cx} cy={cx} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
            {/* progress */}
            <circle
                cx={cx} cy={cx} r={r} fill="none"
                stroke="#00E3D3" strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            {/* label */}
            <text
                x={cx} y={cx} textAnchor="middle" dominantBaseline="central"
                style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cx}px` }}
                fontSize="18" fontWeight="900" fill="#111827"
            >
                {percent}%
            </text>
        </svg>
    );
};

const PharmacistDashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ totalPending: 0, totalDispensed: 0, dispensedToday: 0, totalToday: 0 });
    const [latestOrders, setLatestOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            
            const fetchData = () => {
                Promise.all([
                    prescriptionService.getPharmacistStats(),
                    prescriptionService.getPrescriptionHistory()
                ]).then(([statsData, historyData]) => {
                    setStats({
                        totalPending: statsData.totalPending || 0,
                        totalDispensed: statsData.totalDispensed || 0,
                        dispensedToday: statsData.dispensedToday || 0,
                        totalToday: statsData.totalToday || 0
                    });

                    // Parity Filter: Unique patients, latest first, limit 3
                    if (Array.isArray(historyData)) {
                        const sorted = [...historyData].sort((a, b) => 
                            new Date(b.created_at) - new Date(a.created_at)
                        );
                        
                        const uniquePatients = [];
                        const seenNames = new Set();
                        for (const order of sorted) {
                            const pname = (order.patient_name || 'Unknown').trim().toLowerCase();
                            if (!seenNames.has(pname)) {
                                seenNames.add(pname);
                                uniquePatients.push(order);
                            }
                            if (uniquePatients.length >= 3) break;
                        }
                        setLatestOrders(uniquePatients);
                    } else {
                        setLatestOrders([]);
                    }
                }).catch(err => {
                    console.error("Failed to fetch pharmacist dashboard data", err);
                }).finally(() => setLoading(false));
            };

            fetchData();

            // 1. Listen for global refresh events (e.g. from Pharmacist dispense)
            const unsub = eventBus.on((type) => {
                if (type === 'prescriptionsUpdated') {
                    console.log('Refreshing pharmacist dashboard due to global update...');
                    fetchData();
                }
            });

            // 2. Fallback Polling (Every 30s)
            const pollId = setInterval(fetchData, 30000);

            return () => {
                if (unsub) unsub();
                clearInterval(pollId);
            };
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Donut Chart logic to match mobile: Overall fulfillment (Dispensed / (Pending + Dispensed))
    const totalPrescriptions = stats.totalPending + stats.totalDispensed;
    const percent = totalPrescriptions === 0 ? 0 : Math.round((stats.totalDispensed / totalPrescriptions) * 100);

    // Greeting logic: Cleanup "Ph. " and keep only "Pharmacist [Name]"
    const cleanName = (user?.full_name || user?.name || '')
        .replace(/^(Ph\.?)\s*/i, '')
        .trim();

    return (
        <PharmacistLayout>
            {/* ── Greeting ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#6B7280', marginBottom: '4px' }}>Welcome back,</p>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111827' }}>
                        Pharmacist {cleanName || 'Admin'}
                    </h1>
                </div>
            </div>

            {/* ── Dashboard Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Pending Orders Card */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '28px', padding: '32px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ color: '#00BFB3' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 8h-4a2 2 0 0 0-2 2v10H8V10a2 2 0 0 0-2-2H2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                            </div>
                            <p style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Latest Prescriptions</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ fontSize: '56px', fontWeight: '950', color: '#111827', lineHeight: '1' }}>{stats.totalPending}</span>
                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#9CA3AF' }}>Pending</span>
                        </div>
                    </div>
                    <DonutChart percent={percent} size={100} stroke={12} />
                </div>

                {/* Today's Fulfillment Card */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '28px', padding: '32px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6'
                }}>
                    <p style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>Overall Dispensing Progress</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '800', color: '#374151' }}>System Total</p>
                        <p style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>{stats.totalDispensed}<span style={{ color: '#9CA3AF', fontSize: '16px' }}>/{totalPrescriptions}</span></p>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#F3F4F6', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${percent}%`, borderRadius: '6px',
                            background: 'linear-gradient(90deg, #00E3D3, #06B6D4)',
                            transition: 'width 0.6s ease'
                        }} />
                    </div>
                </div>
            </div>

            {/* ── Recent Queue ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '950', color: '#111827' }}>Latest Prescriptions</h2>
                <button
                    onClick={() => navigate('/prescription-history')}
                    style={{ backgroundColor: '#00E3D3', color: '#fff', border: 'none', borderRadius: '24px', padding: '10px 24px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }}
                >
                    View Entire History
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: '96px', backgroundColor: '#fff', borderRadius: '24px', animation: 'pulse 1.5s infinite ease-in-out', border: '1px solid #F3F4F6' }} />
                    ))}
                </div>
            ) : latestOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {latestOrders.map(order => {
                        const avatarUrl = getAvatarUrl(order.avatar_url, order.gender || order.sex, order.patient_id || order.patient_name);

                        return (
                            <div
                                key={order.id}
                                onClick={() => navigate(`/prescription-detail/${order.id}`, { state: { prescription: order } })}
                                style={{
                                    backgroundColor: '#fff', borderRadius: '24px', padding: '20px 28px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)', border: '1px solid #E5E7EB',
                                    display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.005)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img 
                                    src={avatarUrl} 
                                    alt="patient" 
                                    style={{ width: '56px', height: '56px', borderRadius: '18px', objectFit: 'cover' }} 
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '18px', fontWeight: '900', color: '#111827', marginBottom: '2px' }}>{order.patient_name || 'Unknown Patient'}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontWeight: '700', fontSize: '13px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 8h-4a2 2 0 0 0-2 2v10H8V10a2 2 0 0 0-2-2H2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                                        RX-#{order.id}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                    <StatusBadge status={order.status || 'Pending'} />
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#9CA3AF' }}>{order.formatted_date || new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={{ backgroundColor: '#F9FAFB', borderRadius: '32px', padding: '80px 40px', textAlign: 'center', border: '2.5px dashed #E5E7EB' }}>
                    <div style={{ color: '#CBD5E1', marginBottom: '16px' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 3-3 3 3"/><path d="M12 12v6"/></svg>
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '18px', fontWeight: '800' }}>No recent prescriptions</p>
                    <p style={{ color: '#CBD5E1', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>No systematic activity records found.</p>
                </div>
            )}
        </PharmacistLayout>
    );
};

export default PharmacistDashboardPage;
