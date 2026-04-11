import React, { useState, useEffect } from 'react';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';
import { prescriptionService } from '../services/prescriptionService';
import { getAvatarUrl } from '../utils/helpers';

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

const DoctorPrescriptionsPage = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            prescriptionService.getPrescriptionsByDoctor(user.id)
                .then(data => setPrescriptions(data || []))
                .catch(err => console.error("Error fetching prescriptions:", err))
                .finally(() => setLoading(false));
        }
    }, []);

    const getGroup = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'TODAY';
        if (date.toDateString() === yesterday.toDateString()) return 'YESTERDAY';
        return 'OLDER';
    };

    const groupedData = prescriptions.reduce((acc, p) => {
        const group = getGroup(p.created_at);
        if (!acc[group]) acc[group] = [];
        acc[group].push(p);
        return acc;
    }, {});

    const groups = Object.keys(groupedData).map(key => ({
        group: key,
        items: groupedData[key]
    })).sort((a, b) => {
        const order = { TODAY: 0, YESTERDAY: 1, OLDER: 2 };
        return order[a.group] - order[b.group];
    });

    const pendingCount = prescriptions.filter(p => !p.status || ['PENDING', 'CREATED', 'ISSUED'].includes(p.status.toUpperCase())).length;
    const dispensedCount = prescriptions.filter(p => p.status && p.status.toUpperCase() === 'DISPENSED').length;

    const TABS = [`All`, `Pending (${pendingCount})`, `Dispensed (${dispensedCount})` || 'Dispensed (0)'];

    const filterItem = (item) => {
        const q = search.toLowerCase();
        const name = (item.patient_name || '').toLowerCase();
        const phone = (item.phone || '').toLowerCase();
        const matchSearch = name.includes(q) || phone.includes(q);
        
        if (!matchSearch) return false;
        const status = (item.status || 'PENDING').toUpperCase();

        if (activeTab.startsWith('Pending')) return ['PENDING', 'CREATED', 'ISSUED'].includes(status);
        if (activeTab.startsWith('Dispensed')) return status === 'DISPENSED';
        return true;
    };

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

    return (
        <DoctorLayout title="Prescription History">
            {/* Search + Filter Row */}
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
                        placeholder="Search by patient name or mobile..."
                        style={{ border: 'none', outline: 'none', fontSize: '14px', fontWeight: '500', color: '#374151', width: '100%', background: 'transparent' }}
                    />
                </div>
                <button style={{
                    padding: '12px 16px', backgroundColor: '#fff', border: '1.5px solid #E5E7EB',
                    borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center'
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

            {/* Grouped List */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Loading prescriptions...</p>
            ) : groups.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>No prescriptions found.</p>
            ) : groups.map(group => {
                const filtered = group.items.filter(filterItem);
                if (filtered.length === 0) return null;
                return (
                    <div key={group.group} style={{ marginBottom: '28px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '12px' }}>
                            {group.group}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filtered.map(item => {
                                const rxId = `RX-${String(item.id || '0000').padStart(4, '0')}`;
                                const dateLabel = formatDateLabel(item.created_at);
                                const statusStr = (item.status || "").toUpperCase() === "DISPENSED" ? "DISPENSED" : "PENDING";
                                
                                return (
                                    <div 
                                        key={item.id}
                                        style={{
                                            cursor: 'default', backgroundColor: '#fff', borderRadius: '20px', padding: '16px 20px',
                                            border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center',
                                            gap: '16px', transition: 'all 0.2s ease',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                                        onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                                    >
                                        <div style={{ 
                                            width: '48px', height: '48px', borderRadius: '50%', 
                                            backgroundColor: (item.pat_gender || '').toLowerCase() === 'female' || (item.pat_gender || '').toLowerCase() === 'f' ? '#F0FDFA' : 
                                                            (item.pat_gender || '').toLowerCase() === 'male' || (item.pat_gender || '').toLowerCase() === 'm' ? '#EFF6FF' : '#F8FAFC', 
                                            border: '1.5px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' 
                                        }}>
                                            <img 
                                                src={getAvatarUrl(item.avatar_url, item.pat_gender, item.patient_id || item.patient_name)} 
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
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </DoctorLayout>
    );
};

export default DoctorPrescriptionsPage;
