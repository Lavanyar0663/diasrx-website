import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsUpdatedPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px', border: '3px solid #00E3D3' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Settings Updated</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500', textAlign: 'center', maxWidth: '440px', lineHeight: '1.6', marginBottom: '60px' }}>
                All hospital-wide alert configurations and delivery channels have been successfully updated.
            </p>

            <div className="summary-card" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '60px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', textAlign: 'center' }}>Summary</p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center' }}>
                    <div style={{ color: '#2DD4BF' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p style={{ fontSize: '17px', fontWeight: '800', color: '#111827' }}>
                        Active Channels: <span style={{ color: '#445B6B' }}>WhatsApp, SMS, System</span>
                    </p>
                </div>
            </div>

            <button 
                onClick={() => navigate('/notification-master')}
                style={{ backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '30px', padding: '18px 60px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0, 128, 128, 0.2)' }}
            >
                Back to Settings
            </button>
        </div>
    );
};

export default SettingsUpdatedPage;
