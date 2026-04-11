import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import PasswordRequirements from '../components/PasswordRequirements';
import { authService } from '../services/authService';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const email = location.state?.email || '';
    const otp = location.state?.otp || '';

    const requirements = [
        { label: "Minimum 8 characters", met: password.length >= 8 },
        { label: "At least one special character (@, #, $, etc.)", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        { label: "At least one number (0-9)", met: /\d/.test(password) },
        { label: "Uppercase and lowercase letters", met: /[a-z]/.test(password) && /[A-Z]/.test(password) }
    ];

    const isPasswordValid = requirements.every(req => req.met);

    const handleUpdatePassword = async () => {
        setError('');
        if (!password || !confirmPassword) {
            setError('Please enter and confirm your new password.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!isPasswordValid) {
            setError('Please ensure your password meets all requirements.');
            return;
        }

        if (!email || !otp) {
            setError('Session expired. Please start the password reset process again.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, otp, password);
            navigate('/password-updated');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to update password. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <AuthLayout>
            <div style={{ textAlign: 'center', width: '100%' }}>
                <div className="header-bar">
                    <button onClick={() => navigate('/verify-otp')} className="back-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span className="header-title">Create New Password</span>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', color: '#111827' }}>Create New Password</h1>
                    <p style={{ color: '#6B7280', fontSize: '15.5px', lineHeight: '1.6', marginBottom: '40px', maxWidth: '340px', marginInline: 'auto', fontWeight: '500' }}>
                        Set a strong password to secure your dental health account.
                    </p>
                </div>

                <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>New Password</p>
                    <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={(
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        )}
                        rightIcon={
                            showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" y1="2" x2="22" y2="22" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )
                        }
                        onRightIconClick={() => setShowPassword(!showPassword)}
                    />
                </div>

                <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>Confirm New Password</p>
                    <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter new password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={(
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        )}
                        rightIcon={
                            showConfirmPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" y1="2" x2="22" y2="22" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )
                        }
                        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                </div>

                <PasswordRequirements requirements={requirements} />

                {error && (
                    <div style={{ marginTop: '16px', marginBottom: '4px' }}>
                        <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500', textAlign: 'left' }}>
                            {error}
                        </p>
                    </div>
                )}

                <div style={{ marginTop: '16px' }}>
                    <Button onClick={handleUpdatePassword} disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '12px' }}>
                            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                            <path d="M16 16h5v5" />
                        </svg>
                    </Button>
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '600', marginBottom: '24px' }}>
                        Updating your password will sign you out of all<br />other devices.
                    </p>
                    <div className="reset-badge" style={{ marginTop: '0' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1px' }}>
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        END-TO-END ENCRYPTED
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
