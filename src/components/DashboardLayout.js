import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { authService } from '../services/authService';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const DashboardLayout = ({ children, title, subtitle, hideHeaderTitle = false }) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser() || { name: 'Admin User', role: 'admin' };
    return (
        <div className="dashboard-container">
            <Sidebar />
            
            <main className="main-content">
                <header className="top-bar" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0 32px',
                    height: '90px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #F3F4F6',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div className="header-breadcrumbs">
                        {!hideHeaderTitle && title && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>{title}</h1>
                                {subtitle && <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600', margin: 0 }}>{subtitle}</p>}
                            </div>
                        )}
                    </div>

                    <div 
                        className="header-profile-pill"
                        onClick={() => navigate('/admin-profile')}
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
                    >
                         <img 
                            src={getAvatarUrl(user.avatar_url, user.gender, user.id, user.name || user.full_name || 'Admin')}
                            alt="profile"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#111827', lineHeight: '1.2' }}>{user.name || user.full_name || 'Saravanan'}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'capitalize' }}>{user.role || 'Admin'}</span>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </div>
                </header>

                <div className="page-content" style={{ padding: '32px 32px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
