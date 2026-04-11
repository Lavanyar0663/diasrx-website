import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { authService } from '../services/authService';

const ChangePasswordPage = () => {
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

    const getStrengthColor = () => {
        switch (strength) {
            case 1: return '#EF4444';
            case 2: return '#F59E0B';
            case 3: return '#3B82F6';
            case 4: return '#0D9488';
            default: return '#E5E7EB';
        }
    };

    const getStrengthLabel = () => {
        switch (strength) {
            case 0: return 'Enter a password';
            case 1: return 'Weak password';
            case 2: return 'Fair password';
            case 3: return 'Good password';
            case 4: return 'Strong password ✓';
            default: return '';
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
            navigate('/password-updated-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="Change Password" subtitle="Ensure your account stays secure with a strong password">
            <div style={{ maxWidth: '800px', margin: '32px auto' }}>
                <div className="password-form" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <PasswordInput 
                        label="Current Password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        show={showPasswords.current} 
                        onToggle={() => toggleShow('current')}
                    />
                    
                    <div className="new-password-section">
                        <PasswordInput 
                            label="New Password" 
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            show={showPasswords.new} 
                            onToggle={() => toggleShow('new')}
                        />
                        
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase' }}>Password Strength</p>
                                <p style={{ fontSize: '12px', fontWeight: '800', color: getStrengthColor() }}>{getStrengthLabel()}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {[1, 2, 3, 4].map(level => (
                                    <div key={level} style={{ 
                                        height: '6px', borderRadius: '3px', 
                                        backgroundColor: strength >= level ? getStrengthColor() : '#E5E7EB',
                                        transition: 'background-color 0.3s ease'
                                    }} />
                                ))}
                            </div>
                            <p style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '500', marginTop: '12px' }}>
                                Use at least 8 characters with numbers and symbols.
                            </p>
                        </div>
                    </div>

                    <PasswordInput 
                        label="Confirm New Password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••" 
                        show={showPasswords.confirm} 
                        onToggle={() => toggleShow('confirm')}
                    />

                    {error && <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '600', margin: '-16px 0 0 4px' }}>{error}</p>}

                    <button 
                        onClick={handleUpdate}
                        disabled={loading}
                        style={{ backgroundColor: '#00E3D3', color: 'black', border: 'none', borderRadius: '16px', padding: '20px', fontSize: '18px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px', boxShadow: '0 8px 16px rgba(0, 227, 211, 0.2)', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.1)', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        )}
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                </div>
            </div>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

const PasswordInput = ({ label, name, value, onChange, placeholder, show, onToggle }) => (
    <div className="form-group" style={{ position: 'relative' }}>
        <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', marginLeft: '4px' }}>{label}</p>
        <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </span>
            <input 
                type={show ? "text" : "password"} 
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="web-input" 
                style={{ width: '100%', padding: '20px 24px 20px 52px', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '18px', fontWeight: '500', backgroundColor: 'white', boxSizing: 'border-box' }} 
            />
            <button 
                type="button" 
                onClick={onToggle}
                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
            >
                {show ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
            </button>
        </div>
    </div>
);

export default ChangePasswordPage;
