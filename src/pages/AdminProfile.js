import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { authService } from '../services/authService';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const AdminProfilePage = () => {
    const navigate = useNavigate();
    const [tfaEnabled, setTfaEnabled] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    return (
        <DashboardLayout title="Admin Profile" subtitle="Manage your account and system settings">
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
                {/* Profile Identity Header - Exactly like mobile */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ 
                        width: '120px', height: '120px', borderRadius: '60px', 
                        margin: '0 auto 20px', border: 'none', overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#E1E5E9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <img 
                            src={getAvatarUrl(user?.avatar_url, user?.gender, user?.id, user?.full_name || user?.name || 'Admin')} 
                            alt="avatar" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getInitialsAvatar(user?.full_name || user?.name || 'Saravanan');
                            }}
                        />
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#1E293B', marginBottom: '4px' }}>
                        {user?.full_name || user?.name || 'Administrator'}
                    </h2>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#64748B', marginBottom: '12px' }}>
                        {user?.email || 'admin@diasrx.com'}
                    </p>
                    <div style={{ 
                        display: 'inline-block', backgroundColor: '#E0F2F1', color: '#00796B', 
                        padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', 
                        textTransform: 'uppercase', letterSpacing: '0.05em' 
                    }}>
                        System Administrator
                    </div>
                </div>

                <ConfigSection title="SYSTEM SETTINGS">
                    <ConfigCard 
                        title="Personal Information" 
                        subtitle="Update personal details and demographic info" 
                        onClick={() => navigate('/edit-profile')}
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                    />
                    <ConfigCard 
                        title="Notification Master" 
                        subtitle="Control global alert settings" 
                        onClick={() => navigate('/notification-master')}
                    />
                </ConfigSection>

                <ConfigSection title="SECURITY">
                    <ConfigCard 
                        title="Change Password" 
                        subtitle="Update admin credentials" 
                        onClick={() => navigate('/change-password')}
                    />
                    <ConfigCard 
                        title="Two-Factor Auth" 
                        subtitle={tfaEnabled ? "Enabled" : "Disabled"} 
                        rightElement={
                            <div 
                                onClick={(e) => { e.stopPropagation(); setTfaEnabled(!tfaEnabled); }} 
                                style={{ 
                                    width: '44px', 
                                    height: '24px', 
                                    backgroundColor: tfaEnabled ? '#00BFB3' : '#E5E7EB', 
                                    borderRadius: '12px', 
                                    position: 'relative', 
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    backgroundColor: 'white', 
                                    borderRadius: '50%', 
                                    position: 'absolute', 
                                    top: '2px', 
                                    left: tfaEnabled ? '22px' : '2px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }} />
                            </div>
                        }
                    />
                </ConfigSection>

                <ConfigSection title="APP VERSIONS">
                    <ConfigCard 
                        title="Current Version" 
                        subtitle="v2.4.1 (Build 204)" 
                        rightElement={
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#546E7A', backgroundColor: '#F1F5F9', padding: '6px 12px', borderRadius: '20px' }}>
                                Up to date
                            </span>
                        }
                    />
                </ConfigSection>

                <button 
                    onClick={() => {
                        if (window.confirm("Are you sure you want to log out?")) {
                            authService.logout();
                            navigate('/');
                        }
                    }}
                    style={{ 
                        width: '100%', padding: '20px', backgroundColor: 'white', 
                        border: '1.5px solid #FFCDD2', borderRadius: '32px', color: '#D32F2F', 
                        fontSize: '16px', fontWeight: '800', cursor: 'pointer', marginTop: '32px', 
                        transition: 'all 0.2s ease', boxShadow: '0 2px 8px rgba(211,47,47,0.05)' 
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FFF5F5'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
                >
                    Log Out
                </button>
            </div>
        </DashboardLayout>
    );
};

const ConfigSection = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', marginLeft: '4px' }}>{title}</h3>
        <div style={{ 
            display: 'flex', flexDirection: 'column', 
            backgroundColor: 'white', borderRadius: '16px', 
            border: '1px solid #E2E8F0', overflow: 'hidden' 
        }}>
            {children}
        </div>
    </div>
);

const ConfigCard = ({ title, subtitle, onClick, rightElement, icon }) => (
    <div 
        onClick={onClick}
        style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid #F1F5F9', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: onClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            backgroundColor: 'white'
        }}
        onMouseOver={e => onClick && (e.currentTarget.style.backgroundColor = '#F8FAFC')}
        onMouseOut={e => onClick && (e.currentTarget.style.backgroundColor = 'white')}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {icon && (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E0F2F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                </div>
            )}
            <div style={{ marginLeft: icon ? '0' : '4px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', margin: 0 }}>{title}</h4>
                {subtitle && <p style={{ fontSize: '13px', fontWeight: '500', color: '#64748B', margin: '2px 0 0 0' }}>{subtitle}</p>}
            </div>
        </div>
        {rightElement ? rightElement : (
            onClick && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        )}
    </div>
);

export default AdminProfilePage;
