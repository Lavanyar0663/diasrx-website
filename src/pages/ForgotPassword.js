import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import { authService } from '../services/authService';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        setError('');
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const data = await authService.forgotPassword(email);
            // Grab OTP directly if provided from backend for seamless testing/flow
            const receivedOtp = data.otp; 
            navigate('/verify-otp', { state: { email, autoOtp: receivedOtp } });
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const BackIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
    );

    const LockIcon = () => (
        <div style={{
            backgroundColor: 'rgba(0, 227, 211, 0.12)',
            padding: '24px',
            borderRadius: '32px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px'
        }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E3D3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        </div>
    );

    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', width: '100%' }}>
                <div className="header-bar" style={{ marginBottom: '60px' }}>
                    <button onClick={() => navigate('/')} className="back-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span className="header-title">Forgot Password</span>
                </div>

                <div style={{ marginTop: '0' }}>
                    <LockIcon />
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>Recover your password</h1>
                    <p style={{ color: '#6B7280', fontSize: '15.5px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '340px', marginInline: 'auto', fontWeight: '500' }}>
                        Enter your registered email address to receive a 6-digit OTP code.
                    </p>
                </div>

                <Input 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>} 
                />
                
                {error && (
                    <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500', marginTop: '8px', textAlign: 'left' }}>
                        {error}
                    </p>
                )}

                <div style={{ marginTop: '16px' }}>
                    <Button onClick={handleSendOTP} disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </Button>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#00E3D3', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                    >
                        <BackIcon />
                        Back to Login
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
