import React from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordUpdatedSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px', border: '3px solid #00E3D3' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Password Updated</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500', textAlign: 'center', transition: 'all 0.2s ease', maxWidth: '440px', lineHeight: '1.6', marginBottom: '60px' }}>
                Your login credentials have been successfully updated. Please use your new password for future logins.
            </p>

            <div className="summary-card" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF' }}>Security Status</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00E3D3' }} />
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#2DD4BF' }}>Strong</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF' }}>Last Updated</p>
                    <p style={{ fontSize: '14px', fontWeight: '800', color: '#111827' }}>Just Now</p>
                </div>
            </div>

            <button 
                onClick={() => navigate('/global-config')}
                style={{ backgroundColor: '#00E3D3', color: 'black', border: 'none', borderRadius: '30px', padding: '18px 60px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 16px rgba(0, 227, 211, 0.2)' }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back to Settings
            </button>
        </div>
    );
};

export default PasswordUpdatedSuccessPage;
