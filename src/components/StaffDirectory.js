import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const StaffDirectory = ({ title, searchPlaceholder, initialData, subRolePath, fabPath = '/register-staff', hideDepartment = false }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStaff = initialData.filter(staff => {
        const name = (staff.name || '').toLowerCase();
        const dept = (staff.department || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return name.includes(search) || dept.includes(search);
    });

    return (
        <DashboardLayout 
            title={title} 
            subtitle={`Directory of all registered ${title.toLowerCase().replace('manage ', '')}`}
        >
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '4px', height: '24px', backgroundColor: '#00E3D3', borderRadius: '2px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Registered {title.split(' ')[1]}s</h2>
                </div>

                <div className="search-container" style={{ marginBottom: '24px' }}>
                    <div className="search-bar" style={{ width: '100%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                </div>

                <div className="manage-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredStaff.map(staff => {
                        const avatarUrl = getAvatarUrl(staff.avatar_url || staff.avatar, staff.gender || staff.sex, staff.id || staff.user_id, staff.name);

                        return (
                            <div 
                                key={staff.id || staff.user_id} 
                                className="modern-staff-card" 
                                style={{ 
                                    padding: '24px 32px', 
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    borderRadius: '24px',
                                    border: '1px solid #E5E7EB',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.borderColor = '#00E3D3';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 227, 211, 0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.borderColor = '#E5E7EB';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                                }}
                                onClick={() => navigate(`/applicant-profile/${staff.user_id || staff.id}`, { 
                                    state: { 
                                        request: { ...staff, full_name: staff.name }, 
                                        from: window.location.pathname,
                                        hideDepartment: hideDepartment
                                    } 
                                })}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: 'transparent', flexShrink: 0, overflow: 'hidden', border: '2px solid #F3F4F6' }}>
                                        <img 
                                            src={avatarUrl} 
                                            alt={staff.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(staff.name); }}
                                        />
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '19px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{staff.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '800', color: '#00897B', backgroundColor: '#E0F2F1', padding: '2px 10px', borderRadius: '6px', textTransform: 'uppercase' }}>
                                                #STF-{staff.user_id || staff.id || '000'}
                                            </span>
                                            {!hideDepartment && (
                                                <>
                                                    <span style={{ color: '#E5E7EB' }}>•</span>
                                                    <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '700', margin: 0 }}>{staff.department}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        fontWeight: '800', 
                                        padding: '6px 14px', 
                                        borderRadius: '10px', 
                                        backgroundColor: staff.status === 'ACTIVE' ? '#F0FDFA' : '#F3F4F6',
                                        color: staff.status === 'ACTIVE' ? '#2DD4BF' : '#6B7280',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {staff.status}
                                    </span>
                                    <div style={{ color: '#D1D5DB' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m9 18 6-6-6-6"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Floating Action Button */}
                <button 
                    className="fab-btn" 
                    onClick={() => {
                        const role = title.toLowerCase().includes('doctor') ? 'doctor' : 
                                     title.toLowerCase().includes('pharmacist') ? 'pharmacist' : '';
                        navigate(fabPath, { state: { initialRole: role } });
                    }}
                    style={{
                        position: 'fixed',
                        bottom: '40px',
                        right: '40px',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#00E3D3',
                        border: 'none',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0, 227, 211, 0.4)',
                        cursor: 'pointer',
                        zIndex: 1000
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
            </div>
        </DashboardLayout>
    );
};

export default StaffDirectory;
