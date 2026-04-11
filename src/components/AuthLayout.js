import React from 'react';
import '../styles/index.css';

const AuthLayout = ({ children }) => {

    const features = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            title: 'Trusted Security',
            desc: 'End-to-end encryption & role-based access control'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            title: 'Real-Time Analytics',
            desc: 'Live dashboards for patient data & diagnostics'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
            ),
            title: 'Smart Prescriptions',
            desc: 'Digital Rx workflows from doctor to pharmacist'
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            title: 'Multi-Role Access',
            desc: 'Tailored portals for Admins, Doctors & Pharmacists'
        },
    ];

    const stats = [
        { value: '500+', label: 'Hospitals' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' },
    ];

    return (
        <div className="auth-layout">
            {/* ── LEFT BRAND PANEL ── */}
            <div className="auth-brand-side">
                <div className="brand-deco brand-deco-1" />
                <div className="brand-deco brand-deco-2" />

                <div className="brand-content">
                    {/* Top badge */}
                    <div className="brand-badge">
                        <span className="brand-badge-dot" />
                        Healthcare Management Platform
                    </div>

                    {/* Logo + Name */}
                    <div className="brand-logo-row">
                        <div className="brand-logo-container">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                            </svg>
                        </div>
                        <span className="brand-name-inline">DIAS Rx</span>
                    </div>

                    {/* Headline */}
                    <h1 className="brand-title">
                        Next-Gen Digital<br />
                        <span className="brand-title-accent">Healthcare Platform</span>
                    </h1>

                    <p className="brand-subtitle">
                        Streamline diagnostics, patient management, and secure
                        administrative workflows for modern medical institutions.
                    </p>
                </div>
            </div>

            {/* ── RIGHT FORM PANEL ── */}
            <div className="auth-form-side">
                <div className="auth-form-wrapper" style={{ width: '100%', maxWidth: '460px' }}>
                    {children}
                    <div className="auth-footer" style={{ marginTop: 'auto', paddingTop: '40px' }}>
                        <span className="footer-text">© 2026 DIAS RX SYSTEMS · All Rights Reserved</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
