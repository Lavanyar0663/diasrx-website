import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';

const InputField = ({ label, name, value, onChange, placeholder, hasEye, show, onToggle }) => {
    return (
        <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input 
                    type={show ? "text" : "password"} 
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{ 
                        width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #E5E7EB',
                        backgroundColor: '#fff', fontSize: '15px', color: '#111827', outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                {hasEye && (
                    <button 
                        type="button"
                        onClick={onToggle}
                        style={{ 
                            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        {show ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const DoctorChangePasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [strength, setStrength] = useState(0);

    const toggleShow = (field) => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));

    const calculateStrength = (password) => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=[\]{}|;:',.<>?/`~]/.test(password)) score++;
        return score;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'newPassword') {
            setStrength(calculateStrength(value));
        }
    };

    const handleUpdate = async () => {
        setError('');
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return;
        }
        if (strength < 4) {
            setError('Please use a stronger password (uppercase, number, special character)');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authService.changePassword(formData.currentPassword, formData.newPassword);
            navigate('/doctor-password-updated');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '100px', position: 'relative' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '40px' }}>
                    <button onClick={() => navigate(-1)} style={{
                        position: 'absolute', left: 0,
                        width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                        background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                    </button>
                    <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Change Password</h1>
                </div>

                {/* ── Title Block ── */}
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Secure Your Account</h2>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#6B7280', lineHeight: '1.5' }}>
                        Ensure your account is protected with a strong, unique password.
                    </p>
                </div>

                {/* ── Form ── */}
                <InputField 
                    label="CURRENT PASSWORD" 
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password" 
                    hasEye 
                    show={showPasswords.current}
                    onToggle={() => toggleShow('current')}
                />
                
                <InputField 
                    label="NEW PASSWORD" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Create new password" 
                    hasEye 
                    show={showPasswords.new}
                    onToggle={() => toggleShow('new')}
                />

                {/* Strength Meter */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {[1, 2, 3, 4].map(level => (
                            <div key={level} style={{ 
                                flex: 1, height: '4px', borderRadius: '2px', 
                                backgroundColor: strength >= level ? '#00897B' : '#E5E7EB',
                                transition: 'background-color 0.3s ease'
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={strength >= 4 ? "#00897B" : "#9CA3AF"} stroke="#fff" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#6B7280' }}>
                            {strength >= 4 ? 'Strong password. Ready to update.' : 'Use at least 8 characters with numbers and symbols.'}
                        </span>
                    </div>
                </div>

                <InputField 
                    label="CONFIRM NEW PASSWORD" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password" 
                    hasEye 
                    show={showPasswords.confirm}
                    onToggle={() => toggleShow('confirm')}
                />

                {error && <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '600', margin: '-16px 0 24px 0' }}>{error}</p>}

                {/* ── Bottom Button ── */}
                <div style={{ marginTop: '48px', marginBottom: '20px' }}>
                    <button 
                        onClick={handleUpdate}
                        disabled={loading}
                        style={{ 
                            width: '100%', padding: '16px', backgroundColor: '#00897B', borderRadius: '100px',
                            border: 'none', color: '#fff', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 8px 16px rgba(0, 137, 123, 0.25)', transition: 'opacity 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseOver={e => !loading && (e.currentTarget.style.opacity = 0.9)}
                        onMouseOut={e => !loading && (e.currentTarget.style.opacity = 1)}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>

            </div>
        </DoctorLayout>
    );
};

export default DoctorChangePasswordPage;
