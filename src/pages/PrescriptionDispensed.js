import { useNavigate, useLocation } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';

const PrescriptionDispensedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { prescription } = location.state || {};

    const patientName = prescription?.patient_name || 'John Doe';
    const rxId = prescription?.id || '8842-D';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const txnId = `#TXN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return (
        <PharmacistLayout>
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '65vh', textAlign: 'center',
                maxWidth: '440px', margin: '0 auto', paddingTop: '20px'
            }}>
                {/* Checkmark in glowing teal circle */}
                <div style={{ position: 'relative', marginBottom: '32px' }}>
                    {/* Glow */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '180px', height: '180px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0,227,211,0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: 0
                    }} />
                    {/* Circle */}
                    <div style={{
                        width: '88px', height: '88px', borderRadius: '50%', backgroundColor: '#00E3D3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 1,
                        boxShadow: '0 12px 32px rgba(0, 227, 211, 0.3)'
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>
                    Prescription Dispensed
                </h1>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#6B7280', lineHeight: '1.5', marginBottom: '40px' }}>
                    The medication for <strong style={{ color: '#111827' }}>{patientName}</strong> (#RX-{rxId}) has been successfully marked as dispensed. The Doctor has been notified.
                </p>

                {/* Info Card */}
                <div style={{
                    width: '100%', backgroundColor: '#fff', borderRadius: '24px', padding: '24px',
                    border: '1px solid #F3F4F6', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    marginBottom: '48px', textAlign: 'left'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '2px' }}>Patient</p>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>{patientName}</h3>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px' }}>Time Dispensed</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#374151' }}>{timeNow}</span>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '6px' }}>Status</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00BFB3" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#00BFB3' }}>Completed</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#9CA3AF' }}>Transaction ID</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>{txnId}</span>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/pharmacist-dashboard')}
                    style={{
                        width: '100%', padding: '18px', backgroundColor: '#00E3D3', color: '#111827',
                        border: 'none', borderRadius: '100px', fontSize: '16px', fontWeight: '800',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 8px 16px rgba(0, 227, 211, 0.25)'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><polyline points="12 7 12 12 15 15"/></svg>
                    Back to Dashboard
                </button>
            </div>
        </PharmacistLayout>
    );
};

export default PrescriptionDispensedPage;
