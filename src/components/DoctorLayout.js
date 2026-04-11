import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const DoctorLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            name: 'Dashboard',
            path: '/doctor-dashboard',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00BFB3' : 'none'} stroke={active ? '#00BFB3' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
            )
        },
        {
            name: 'Patients',
            path: '/doctor-patients',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00BFB3' : 'none'} stroke={active ? '#00BFB3' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                </svg>
            )
        },
        {
            name: 'Notifications',
            path: '/doctor-notifications',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00BFB3' : 'none'} stroke={active ? '#00BFB3' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
            )
        },

        {
            name: 'Profile',
            path: '/doctor-settings',
            icon: (active) => (
                <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#00BFB3' : 'none'} stroke={active ? '#00BFB3' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                </svg>
            )
        }
    ];

    const displayName = user?.full_name || user?.name || 'Doctor';

    return (
        <div className="dashboard-container">
            <style>{`
                .dashboard-container {
                    padding-bottom: 90px;
                }
                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #ffffff;
                    height: 76px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    border-top: 1px solid #F3F4F6;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.03);
                    z-index: 2000;
                }
                .bottom-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    flex: 1;
                    padding: 8px 0;
                }
                .bottom-nav-label {
                    font-size: 10px;
                    font-weight: 800;
                    color: #9CA3AF;
                    text-transform: capitalize;
                }
                .bottom-nav-item.active .bottom-nav-label {
                    color: #00BFB3;
                }
                .nav-icon-bg {
                    width: 44px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 14px;
                    transition: all 0.2s ease;
                }
                .bottom-nav-item.active .nav-icon-bg {
                    background-color: #E0F2F1;
                }
                @media (min-width: 1024px) {
                    .bottom-nav { display: none; }
                    .dashboard-container { padding-bottom: 0; }
                }
                /* Sidebar profile section hover */
                .sidebar-profile-pill:hover {
                    background-color: #F0FDFA !important;
                }
            `}</style>

            {/* ── Sidebar (Desktop) ──────────────────────────────────── */}
            <div className="sidebar-container">
                {/* Brand */}
                <div className="sidebar-brand" onClick={() => navigate('/doctor-dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="sidebar-logo" style={{ backgroundColor: '#00E3D3', padding: '8px', borderRadius: '10px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="sidebar-title" style={{ color: '#000', fontWeight: '900' }}>DIAS Rx</span>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="nav-section-label" style={{ paddingLeft: '16px', marginBottom: '12px' }}>DOCTOR MENU</div>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive: a }) => `nav-item ${a ? 'active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon(active)}</span>
                                <span className="nav-label">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
                
            </div>

            {/* ── Bottom Navigation (Mobile) ─────────────────────────── */}
            <div className="bottom-nav">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive: a }) => `bottom-nav-item ${a ? 'active' : ''}`}
                        >
                            <div className="nav-icon-bg">{item.icon(active)}</div>
                            <span className="bottom-nav-label">{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* ── Main Content ───────────────────────────────────────── */}
            <main className="main-content">
                <div className="page-content" style={{ padding: '40px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DoctorLayout;
