import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleCard from './RoleCard';
import Input from './Input';
import Button from './Button';
import { authService } from '../services/authService';
import '../styles/components.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(''); // Role must be chosen manually
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        
        if (!role) {
            setError('Please select your role (Admin, Doctor, or Pharmacist).');
            return;
        }

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            // Map UI role label to backend role string (lowercase)
            const backendRole = role.toLowerCase();
            const data = await authService.login(email, password, backendRole);
            
            // Navigate based on data from backend (always use backend's returned role)
            const userRole = data.user.role.toLowerCase();
            
            if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else if (userRole === 'doctor') {
                navigate('/doctor-dashboard');
            } else if (userRole === 'pharmacist') {
                navigate('/pharmacist-dashboard');
            } else {
                navigate('/success');
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.code === 'ERR_NETWORK') {
                setError('Failed to connect to the server. Please check your backend URL and network connection.');
            } else {
                setError('Failed to connect to the server. Please check your network.');
            }
        } finally {
            setLoading(false);
        }
    };

    const AdminIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    const DoctorIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );

    const PharmacistIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            <path d="m15 5 4 4" />
        </svg>
    );

    return (
        <div className="login-form-container">
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', textAlign: 'center', color: '#111827' }}>Login to DIAS Rx</h2>
            <p style={{ color: '#6B7280', fontSize: '15px', marginBottom: '40px', textAlign: 'center', fontWeight: '500' }}>Select your role to continue</p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <RoleCard label="Admin" icon={<AdminIcon />} active={role === 'Admin'} onClick={() => { setRole('Admin'); setError(''); }} />
                <RoleCard label="Doctor" icon={<DoctorIcon />} active={role === 'Doctor'} onClick={() => { setRole('Doctor'); setError(''); }} />
                <RoleCard label="Pharmacist" icon={<PharmacistIcon />} active={role === 'Pharmacist'} onClick={() => { setRole('Pharmacist'); setError(''); }} />
            </div>

            {error && (
                <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', color: '#EF4444', fontSize: '14px', fontWeight: '600', marginBottom: '24px', lineHeight: '1.4' }}>
                    {error}
                </div>
            )}

            <Input
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={(
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                )}
            />
            <div style={{ marginBottom: '16px' }}>
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
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

            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
                <button 
                  onClick={() => navigate('/forgot-password')}
                  style={{ background: 'none', border: 'none', color: '#00E3D3', fontSize: '14px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
            </div>

            <Button onClick={handleLogin} disabled={loading || !role || !email || !password}>
                {loading ? 'Authenticating...' : 'Login'}
            </Button>

            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '15px', fontWeight: '500' }}>
                <span style={{ color: '#6B7280' }}>New to DIAS Rx? </span>
                <button
                    onClick={() => navigate('/request-access')}
                    style={{ background: 'none', border: 'none', color: '#00E3D3', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                    Request Access
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
