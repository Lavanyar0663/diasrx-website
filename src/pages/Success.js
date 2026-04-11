import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get dynamic data from state
    const { name, role, department, date } = location.state || {
        name: "Staff Member",
        role: "Applicant",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const displayRole = department ? `${role} (${department})` : role;

    const CheckIcon = () => (
        <div style={{
            backgroundColor: '#00E3D3',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            color: 'black',
            boxShadow: '0 12px 24px rgba(0, 227, 211, 0.35)',
            marginInline: 'auto'
        }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        </div>
    );

    return (
        <div className="web-container">
            <div className="auth-card" style={{ textAlign: 'center', padding: '60px' }}>
                <CheckIcon />

                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#111827' }}>Request Submitted</h1>
                <p style={{ color: '#6B7280', fontSize: '15.5px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '380px', marginInline: 'auto', fontWeight: '500' }}>
                    Your registration request is now pending administrative approval. You will be notified via SMS once your access is granted.
                </p>

                <div className="summary-container">
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Submission Summary</p>

                    {/* name -> user icon */}
                    <div className="summary-item">
                        <div className="summary-item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div className="summary-item-content">
                            <span className="summary-item-label">Full Name</span>
                            <span className="summary-item-value">{name}</span>
                        </div>
                    </div>

                    <div className="summary-item">
                        <div className="summary-item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
                        </div>
                        <div className="summary-item-content">
                            <span className="summary-item-label">Role Applied</span>
                            <span className="summary-item-value">{displayRole}</span>
                        </div>
                    </div>

                    <div className="summary-item">
                        <div className="summary-item-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </div>
                        <div className="summary-item-content">
                            <span className="summary-item-label">Date Submitted</span>
                            <span className="summary-item-value">{date}</span>
                        </div>
                    </div>
                </div>

                <Button onClick={() => navigate('/')}>Back to Login</Button>
            </div>
        </div>
    );
};

export default SuccessPage;
