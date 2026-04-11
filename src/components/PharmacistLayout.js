import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../utils/helpers';
import { authService } from '../services/authService';

const PharmacistLayout = ({ children, title, subtitle }) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    // Greeting logic: Cleanup "Ph. "
    const cleanName = (user?.full_name || user?.name || 'Pharmacist')
        .replace(/^(Ph\.?)\s*/i, '')
        .trim();
    
    // Consistent avatar URL
    const avatarUrl = getAvatarUrl(user?.avatar_url, user?.gender, user?.id, cleanName);

    const menuItems = [
        // ... (remaining menuItems the same)
        {
            name: 'Home',
            path: '/pharmacist-dashboard',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
            )
        },
        {
            name: 'Patients',
            path: '/pharmacist-patients',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            )
        },
        {
            name: 'Rx History',
            path: '/prescription-history',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            )
        },
        {
            name: 'Notifications',
            path: '/pharmacist-notifications',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/pharmacist-profile',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
    ];


    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar-container">
                <div className="sidebar-brand" onClick={() => navigate('/pharmacist-dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="sidebar-logo" style={{ backgroundColor: '#00E3D3', padding: '8px', borderRadius: '10px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="sidebar-title" style={{ color: '#000', fontWeight: '800' }}>DIAS Rx</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-label">Pharmacist Menu</div>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

            </div>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar" style={{ justifyContent: 'flex-end' }}>
                    <div className="top-bar-right">
                        <div
                            className="profile-pill"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/pharmacist-profile')}
                        >
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', flexShrink: 0 }}>
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="profile-info">
                                <span className="admin-name" style={{ fontWeight: '800' }}>{cleanName}</span>
                                <span className="admin-role" style={{ fontSize: '11px', fontWeight: '700', textTransform: 'lowercase' }}>
                                    {user?.role || 'pharmacist'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    {title && (
                        <div className="page-header-content">
                            <h1 className="page-title">{title}</h1>
                            {subtitle && <p className="page-subtitle">{subtitle}</p>}
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PharmacistLayout;
