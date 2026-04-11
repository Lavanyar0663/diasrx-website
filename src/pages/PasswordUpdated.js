import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const PasswordUpdatedPage = () => {
    const navigate = useNavigate();

    const SuccessIcon = () => (
        <div style={{
            backgroundColor: 'rgba(0, 227, 211, 0.12)',
            padding: '32px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px'
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00E3D3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );

    return (
        <div className="web-container">
            <div className="auth-card" style={{ textAlign: 'center', padding: '80px 60px' }}>
                <SuccessIcon />
                
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>Password Updated</h1>
                
                <p style={{ color: '#6B7280', fontSize: '18px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '420px', marginInline: 'auto', fontWeight: '500' }}>
                    Your password has been successfully updated. You can now use your new credentials to log in to your account.
                </p>

                <Button onClick={() => navigate('/')}>Back to Login</Button>

                <div className="auth-footer" style={{ marginTop: '80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        SECURE PATIENT ACCESS PORTAL
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordUpdatedPage;
