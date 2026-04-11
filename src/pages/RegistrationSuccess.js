import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegistrationSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { name, role, phone, department } = location.state || {
        name: 'Staff Member',
        role: 'Unknown',
        phone: 'N/A'
    };

    const displayRole = department ? `${role} (${department})` : role;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#008080', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', boxShadow: '0 12px 24px rgba(0, 128, 128, 0.3)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>Registration Complete</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6', marginBottom: '60px' }}>
                The staff account has been created successfully. Login credentials have been sent via SMS.
            </p>

            <div className="detail-card" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '60px' }}>
                <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Staff Details</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <SuccessInfoRow 
                        label="Full Name" 
                        value={name} 
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                    />
                    <SuccessInfoRow 
                        label="Assigned Role" 
                        value={displayRole} 
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} 
                    />
                    <SuccessInfoRow 
                        label="Mobile Number" 
                        value={phone} 
                        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                    />
                </div>
            </div>

            <button 
                onClick={() => navigate('/admin-dashboard')}
                style={{ backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '30px', padding: '18px 40px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Back to Admin Dashboard
            </button>
        </div>
    );
};

const SuccessInfoRow = ({ label, value, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: '17px', fontWeight: '800', color: '#111827' }}>{value}</p>
        </div>
    </div>
);

export default RegistrationSuccessPage;
