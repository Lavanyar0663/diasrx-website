import React from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';

const ProfileUpdatedPage = () => {
    const navigate = useNavigate();

    return (
        <DoctorLayout>
            {/* Back + Title */}
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
                <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Success</h1>
            </div>

            {/* Centered Content */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
                maxWidth: '420px', margin: '0 auto'
            }}>
                {/* Check circle */}
                <div style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    backgroundColor: '#F0FDFA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#00E3D3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(0, 227, 211, 0.35)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>
                    Profile Updated
                </h2>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280', lineHeight: '1.6', marginBottom: '48px' }}>
                    Your professional details have been successfully saved.
                </p>

                {/* Back to Profile button */}
                <button
                    onClick={() => navigate('/doctor-settings')}
                    style={{
                        width: '100%', padding: '16px',
                        backgroundColor: '#00E3D3', border: 'none',
                        borderRadius: '16px', color: '#fff',
                        fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                        transition: 'background 0.2s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#0D9488'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#00E3D3'}
                >
                    Back to Profile
                </button>
            </div>
        </DoctorLayout>
    );
};

export default ProfileUpdatedPage;
