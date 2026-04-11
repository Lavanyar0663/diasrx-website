import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';
import { doctorService } from '../services/doctorService';
import { prescriptionService } from '../services/prescriptionService';
import { getAvatarUrl } from '../utils/helpers';
import { eventBus } from '../utils/eventBus';

const StatusBadge = ({ status }) => {
    const s = (status || 'PENDING').toUpperCase();
    const map = {
        'PENDING':   { bg: '#FFF7ED', color: '#F97316', label: 'Pending' },
        'CREATED':   { bg: '#FFF7ED', color: '#F97316', label: 'Pending' },
        'ISSUED':    { bg: '#FFF7ED', color: '#F97316', label: 'Pending' },
        'DISPENSED': { bg: '#F0FDF4', color: '#00BFB3', label: 'Dispensed' },
        'CANCELLED': { bg: '#FEF2F2', color: '#EF4444', label: 'Cancelled' },
    };
    const style = map[s] || map['PENDING'];
    return (
        <span style={{
            backgroundColor: style.bg, color: style.color,
            fontSize: '11px', fontWeight: '900',
            padding: '4px 12px', borderRadius: '20px', whiteSpace: 'nowrap'
        }}>
            {style.label}
        </span>
    );
};

const DoctorDashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [stats, setStats] = useState({ pending: 0, dispensed: 0, totalPatients: 0 });
    const [info, setInfo] = useState({ doctorName: '', department: '', opdLoad: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            const uid = currentUser.id || currentUser.user_id;
            setUser(currentUser);
            fetchDashboardData(uid);

            // 1. Listen for global refresh events (e.g. from Pharmacist dispense)
            const unsub = eventBus.on((type) => {
                if (type === 'prescriptionsUpdated') {
                    console.log('Refreshing doctor dashboard due to global update...');
                    fetchDashboardData(uid);
                }
            });

            // 2. Fallback Polling (Every 30s) for cross-session/cross-machine sync
            const pollId = setInterval(() => {
                fetchDashboardData(uid);
            }, 30000);

            return () => {
                if (unsub) unsub();
                clearInterval(pollId);
            };
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchDashboardData = async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const [iData, sData, pData] = await Promise.all([
                doctorService.getDashboardInfo(),
                doctorService.getStats(),
                prescriptionService.getPrescriptionsByDoctor(userId),
            ]);

            setInfo({
                doctorName: (iData.doctorName || '').replace(/^(dr\.?\s*)+/gi, '').trim() || '',
                department: iData.department || 'General Medicine',
                opdLoad: iData.opdLoad || 0,
            });
            setStats({
                pending:      sData.pendingPrescriptions  || 0,
                dispensed:    sData.dispensedPrescriptions || 0,
                totalPatients: sData.totalPatients          || 0,
            });
            setPrescriptions(Array.isArray(pData) ? pData : []);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Failed to load dashboard data. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h >= 5  && h < 12) return 'Good Morning,';
        if (h >= 12 && h < 17) return 'Good Afternoon,';
        return 'Good Evening,';
    };

    const loadPercent = Math.min(100, (info.opdLoad * 5));
    const displayName = info.doctorName || (user?.full_name || user?.name || '').replace(/^Dr\.\s*/i, '');

    const formatDateLabel = (isoDate) => {
        if (!isoDate) return "Recently";
        try {
            const dateObj = new Date(isoDate);
            if (isNaN(dateObj.getTime())) return isoDate;
            
            const timeFormat = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            const isToday = dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
            const isYesterday = dateObj.getDate() === yesterday.getDate() && dateObj.getMonth() === yesterday.getMonth() && dateObj.getFullYear() === yesterday.getFullYear();
            
            if (isToday) return `Today, ${timeFormat}`;
            if (isYesterday) return `Yesterday, ${timeFormat}`;
            
            return `${dateObj.toISOString().split('T')[0]}, ${timeFormat}`;
        } catch {
            return isoDate;
        }
    };

    // Grouping Recent Activity like mobile app (LinkedHashMap equivalent)
    const recentActivity = [];
    if (prescriptions && prescriptions.length > 0) {
        const patientMap = new Map();
        for (const presc of prescriptions) {
            const pid = (presc.patient_name || "unknown").trim().toLowerCase();
            if (!patientMap.has(pid)) {
                patientMap.set(pid, presc);
            }
            if (patientMap.size >= 3) break;
        }
        patientMap.forEach((value) => recentActivity.push(value));
    }

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* ── Error Banner ── */}
                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px', color: '#EF4444', fontWeight: '700', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                {/* ── Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#94A3B8', marginBottom: '2px' }}>{getGreeting()}</p>
                        <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#1E293B', margin: 0 }}>
                            Dr. {displayName || 'Doctor'}
                        </h1>
                    </div>
                    {/* Profile Avatar - Admin Style Pill */}
                    <div 
                        onClick={() => navigate('/doctor-settings')}
                        style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            padding: '8px 20px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #F1F5F9'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#F0FDFA'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    >
                        <img 
                            src={getAvatarUrl(user?.avatar_url, user?.gender, user?.id, displayName)} 
                            alt="Profile"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{displayName}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'capitalize' }}>Doctor</span>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </div>
                </div>

                {/* ── Department Status Card ── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '28px', padding: '24px 28px',
                    border: '1.5px solid #F1F5F9', marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '900', color: '#1E293B', margin: 0 }}>Department Status</h3>
                                <span style={{ color: '#0D9488', fontSize: '13px', fontWeight: '900' }}>
                                    {loading ? '...' : `${stats.totalPatients} Patients`}
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#6B7280', margin: 0 }}>
                                {loading ? '...' : `${info.department} OPD Load`}
                            </p>
                        </div>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', position: 'relative', marginBottom: '24px' }}>
                        <div style={{ width: `${loadPercent}%`, height: '100%', backgroundColor: '#00BFB3', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                        <span style={{ position: 'absolute', right: 0, top: '-24px', fontSize: '13px', fontWeight: '900', color: '#1E293B' }}>{Math.round(loadPercent)}%</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                                OPD: {loading ? '...' : `${info.opdLoad} today`}
                            </span>
                        </div>
                        <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B' }}>
                                Dept: {loading ? '...' : info.department}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Metrics Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                    {/* Pending */}
                    <div
                        style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '20px' }}
                    >
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B', margin: 0, lineHeight: 1 }}>
                                {loading ? <span style={{ color: '#CBD5E1' }}>–</span> : stats.pending}
                            </p>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginTop: '4px' }}>Pending</p>
                        </div>
                    </div>

                    {/* Dispensed */}
                    <div
                        style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '24px', border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '20px' }}
                    >
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: '28px', fontWeight: '900', color: '#1E293B', margin: 0, lineHeight: 1 }}>
                                {loading ? <span style={{ color: '#CBD5E1' }}>–</span> : stats.dispensed}
                            </p>
                            <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginTop: '4px' }}>Dispensed</p>
                        </div>
                    </div>
                </div>

                {/* ── Recent Activity ── */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1E293B', margin: 0 }}>Recent Activity</h2>
                        <button
                            onClick={() => navigate('/doctor-prescriptions')}
                            style={{ border: 'none', background: 'none', color: '#64748B', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                        >
                            View All
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '20px', border: '1.5px solid #F1F5F9', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#E2E8F0' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ height: '14px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
                                        <div style={{ height: '11px', backgroundColor: '#E2E8F0', borderRadius: '6px', width: '40%' }} />
                                    </div>
                                </div>
                            ))
                        ) : recentActivity.length > 0 ? (
                            recentActivity.map(item => {
                                const rxId = `RX-${String(item.id || '0000').padStart(4, '0')}`;
                                const dateLabel = formatDateLabel(item.created_at);
                                const genderVal = (item.pat_gender || item.gender || '').toString().toLowerCase();
                                const statusStr = (item.status || "").toUpperCase() === "DISPENSED" ? "DISPENSED" : "PENDING";
                                
                                return (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: '#fff', borderRadius: '20px', padding: '16px 20px',
                                        border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center',
                                        gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{ 
                                        width: '48px', height: '48px', borderRadius: '50%', 
                                        backgroundColor: genderVal === 'female' || genderVal === 'f' ? '#F0FDFA' : 
                                                        genderVal === 'male' || genderVal === 'm' ? '#EFF6FF' : '#F8FAFC', 
                                        border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' 
                                    }}>
                                        <img 
                                            src={getAvatarUrl(item.avatar_url, genderVal, item.patient_id || item.patient_name)} 
                                            alt="" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 1 }} 
                                        />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#1E293B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.patient_name || 'Patient'}
                                        </p>
                                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', marginTop: '2px' }}>
                                            {rxId} • {dateLabel}
                                        </p>
                                    </div>
                                    <StatusBadge status={statusStr} />
                                </div>
                            )})
                        ) : (
                            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '24px', padding: '48px', textAlign: 'center', border: '2px dashed #E5E7EB' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px auto', display: 'block' }}>
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <p style={{ color: '#94A3B8', fontSize: '15px', fontWeight: '800' }}>No clinical activity recorded yet.</p>
                                <p style={{ color: '#CBD5E1', fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Prescriptions you create will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboardPage;
