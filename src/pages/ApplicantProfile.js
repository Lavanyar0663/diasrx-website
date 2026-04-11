import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const ApplicantProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const staff = location.state?.request || {
        full_name: 'Staff Member',
        name: 'Staff Member',
        role: 'Unknown',
        department: 'General',
        created_at: new Date().toISOString(),
        phone: 'N/A',
        email: 'N/A'
    };
    
    const fullName = staff.name || staff.full_name || staff.username || 'Staff Member';
    const avatarUrl = getAvatarUrl(staff.avatar_url || staff.profile_pic, staff.gender || staff.sex, staff.id || staff.user_id, fullName);

    return (
        <DashboardLayout title="Staff Profile" subtitle="Detailed view of registered staff member">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '54px', backgroundColor: '#F3F4F6', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid #00E3D3' }}>
                        <img src={avatarUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(fullName); }} />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#111827', marginBottom: '12px' }}>{fullName}</h2>
                    <span style={{ 
                        backgroundColor: (staff.role || '').toLowerCase() === 'doctor' ? '#F0F9FF' : '#F0FDFA', 
                        color: (staff.role || '').toLowerCase() === 'doctor' ? '#0369A1' : '#0D9488', 
                        padding: '6px 20px', 
                        borderRadius: '20px', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {staff.role}
                    </span>
                </div>

                <div className="detail-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                    <ProfileInfoRow 
                        label="Access ID" 
                        value={`#STF-${staff.user_id || staff.id || '000'}`} 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} 
                    />
                    {!(staff.role && staff.role.toLowerCase().includes('pharmacist')) && !location.state?.hideDepartment && (
                        <ProfileInfoRow 
                            label="Department" 
                            value={staff.department || 'General'} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} 
                        />
                    )}
                    <ProfileInfoRow 
                        label="Registration Date" 
                        value={staff.formatted_date || (staff.created_at ? new Date(staff.created_at).toLocaleDateString() : 'N/A')} 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} 
                    />
                    <ProfileInfoRow 
                        label="Contact Number" 
                        value={staff.phone || 'Not Provided'} 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                    />
                    <ProfileInfoRow 
                        label="Email Address" 
                        value={staff.email || 'Not Provided'} 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} 
                        last 
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button 
                        onClick={() => navigate(location.state?.from || '/access-requests')}
                        style={{ backgroundColor: '#00E3D3', color: '#000', border: 'none', borderRadius: '16px', padding: '16px 48px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 227, 211, 0.3)' }}
                    >
                        Back to Directory
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

const ProfileInfoRow = ({ label, value, icon, last }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px 32px', borderBottom: last ? 'none' : '1px solid #F3F4F6', backgroundColor: 'white' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{value}</p>
        </div>
    </div>
);

export default ApplicantProfilePage;
