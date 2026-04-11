import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import OTPInput from '../components/OTPInput';
import Toast from '../components/Toast';
import { authService } from '../services/authService';

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showToast, setShowToast] = useState(true);
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(45);

    const email = location.state?.email || '';

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    useEffect(() => {
        const autoOtp = location.state?.autoOtp;
        if (autoOtp && email) {
            setOtpCode(autoOtp.toString());
            // Small delay for UI feedback
            setTimeout(() => {
                handleVerifyDirect(email, autoOtp.toString());
            }, 800);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.autoOtp, email]);

    const handleVerifyDirect = async (targetEmail, targetOtp) => {
        setLoading(true);
        setError('');
        try {
            await authService.verifyOtp(targetEmail, targetOtp);
            navigate('/reset-password', { state: { email: targetEmail, otp: targetOtp } });
        } catch (err) {
            setError('Auto-verification failed. Please verify manually.');
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError('');
        try {
            const data = await authService.forgotPassword(email);
            setShowToast(true);
            setResendTimer(45);
            if (data.otp) {
                setOtpCode(data.otp.toString());
                setTimeout(() => handleVerifyDirect(email, data.otp.toString()), 800);
            }
        } catch (err) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError('');
        if (!otpCode || otpCode.length !== 6) {
            setError('Please enter a 6-digit verification code.');
            return;
        }

        if (!email) {
            setError('Session expired. Please request a new OTP.');
            return;
        }

        setLoading(true);
        try {
            await authService.verifyOtp(email, otpCode);
            navigate('/reset-password', { state: { email, otp: otpCode } });
        } catch (err) {
             if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid or expired OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', width: '100%' }}>
                <div className="header-bar">
                    <button onClick={() => navigate('/forgot-password')} className="back-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span className="header-title">Verification Code</span>
                </div>

                <div style={{ marginTop: '0' }}>
                    <div style={{ backgroundColor: 'rgba(0, 227, 211, 0.12)', padding: '24px', borderRadius: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00E3D3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>Verification Code</h1>
                    <p style={{ color: '#6B7280', fontSize: '15.5px', lineHeight: '1.6', marginBottom: '48px', maxWidth: '340px', marginInline: 'auto', fontWeight: '500' }}>
                        Enter the 6-digit code sent to your email address.
                    </p>
                </div>

                <OTPInput autoFillValue={otpCode ? otpCode.split('') : null} onComplete={(code) => setOtpCode(code)} />
                
                {error && (
                    <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500', marginTop: '16px', marginBottom: '-8px' }}>
                        {error}
                    </p>
                )}

                <div style={{ marginTop: '24px', marginBottom: '48px' }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF', marginBottom: '8px' }}>
                        Resend code in <span style={{ color: '#111827' }}>00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span>
                    </p>
                    <button 
                        onClick={handleResend}
                        disabled={resendTimer > 0 || loading}
                        style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#D1D5DB' : '#00E3D3', fontSize: '14px', fontWeight: '800', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                        RESEND CODE
                    </button>
                </div>

                <Button onClick={handleVerify} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Proceed'}
                </Button>

                <div style={{ marginTop: '40px', fontSize: '13px', color: '#6B7280', fontWeight: '500', lineHeight: '1.6' }}>
                    By continuing, you agree to DIAS Rx <br />
                    <span style={{ fontWeight: '700', cursor: 'pointer' }}>Terms of Service and Privacy Policy</span>
                </div>
            </div>

            {showToast && <Toast message="OTP has been sent to your email." onFadeOut={() => setShowToast(false)} />}
        </AuthLayout>
    );
};

export default VerifyOTPPage;
