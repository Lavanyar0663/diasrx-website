import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { 
            name: 'Dashboard', 
            path: '/admin-dashboard', 
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
            name: 'Access Requests', 
            path: '/access-requests', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
            )
        },
        { 
            name: 'Manage Doctors', 
            path: '/manage-doctors', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        { 
            name: 'Manage Pharmacists', 
            path: '/manage-pharmacists', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
            )
        },
        { 
            name: 'Manage Patients', 
            path: '/manage-patients', 
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        }
    ];

    return (
        <div className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #E5E7EB' }}>
            <div className="sidebar-brand" onClick={() => navigate('/admin-dashboard')} style={{ padding: '32px 32px 20px 32px' }}>
                <div className="sidebar-logo" style={{ backgroundColor: '#3B82F6', padding: '8px', borderRadius: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span className="sidebar-title" style={{ color: '#111827', fontWeight: '800' }}>DIAS Rx</span>
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="nav-section-label" style={{ padding: '24px 16px 12px 16px', fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Main Menu</div>
                {menuItems.map((item) => (
                    <NavLink 
                        key={item.name} 
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={(e) => {
                            if (item.path === '#') e.preventDefault();
                        }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.name}</span>
                    </NavLink>
                ))}
            </nav>


        </div>
    );
};

export default Sidebar;
