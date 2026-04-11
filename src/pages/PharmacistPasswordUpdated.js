import React from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';

const PharmacistPasswordUpdatedPage = () => {
    const navigate = useNavigate();

    return (
        <PharmacistLayout>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <button onClick={() => navigate(-1)} style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Password Updated</h1>
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
                maxWidth: '420px', margin: '0 auto'
            }}>
                <div style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    backgroundColor: '#F0FDFA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#00BFB3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(0, 191, 179, 0.35)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                    Password Updated
                </h2>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', lineHeight: '1.6', marginBottom: '48px' }}>
                    Your pharmacist credentials have been successfully updated for medical security.
                </p>

                <button
                    onClick={() => navigate('/pharmacist-profile')}
                    style={{
                        width: '100%', padding: '16px',
                        backgroundColor: '#00BFB3', border: 'none',
                        borderRadius: '16px', color: '#fff',
                        fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                        transition: 'background 0.2s ease', marginBottom: '20px'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#0D9488'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#00BFB3'}
                >
                    Back to Settings
                </button>

                <p style={{ fontSize: '11px', fontWeight: '700', color: '#D1D5DB', letterSpacing: '0.08em' }}>
                    MEDICAL SECURITY VERIFIED • DIAS RX
                </p>
            </div>
        </PharmacistLayout>
    );
};

export default PharmacistPasswordUpdatedPage;
