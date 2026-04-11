import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import RoleCard from '../components/RoleCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/authService';
import { DEPARTMENTS } from '../utils/constants';

const RequestAccessPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [professionalTitle, setProfessionalTitle] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        if (!role) {
            setError('Please select your role (Doctor or Pharmacist).');
            return;
        }

        if (!name || !email || !phone || !password) {
            setError('Please fill in all required fields.');
            return;
        }

        if (role === 'Doctor' && !department) {
            setError('Please select a department.');
            return;
        }
        
        setLoading(true);
        try {
            await authService.requestAccess({
                name,
                email,
                phone,
                password,
                role: role.toLowerCase(),
                department: role === 'Doctor' ? department : undefined,
                professional_title: role === 'Doctor' ? professionalTitle : undefined
            });
            navigate('/success?from=register', { 
                state: { 
                    name, 
                    role: role, 
                    department: role === 'Doctor' ? department : undefined,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                } 
            });
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to submit request. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const DoctorIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );

    const PharmacistIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            <path d="m15 5 4 4" />
        </svg>
    );

    return (
        <AuthLayout>
            <div style={{ textAlign: 'left', width: '100%' }}>
                <div className="header-bar" style={{ justifyContent: 'flex-start', padding: '0', marginBottom: '60px' }}>
                    <button onClick={() => navigate('/')} className="back-btn" style={{ marginLeft: '-12px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <span className="header-title" style={{ position: 'static', transform: 'none', marginLeft: '12px', fontSize: '24px' }}>Join DIAS Rx</span>
                </div>

                <p style={{ color: '#6B7280', fontSize: '15.5px', marginBottom: '40px', fontWeight: '500' }}>
                    Enter your details to register. Your account will require administrative approval.
                </p>

                <Input 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
                />

                <Input 
                    placeholder="Registered Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>} 
                />
                
                <Input 
                    placeholder="Mobile Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                />
                
                <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
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

                <div style={{ marginBottom: '32px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Role</p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <RoleCard label="Doctor" icon={<DoctorIcon />} active={role === 'Doctor'} onClick={() => setRole('Doctor')} />
                        <RoleCard label="Pharmacist" icon={<PharmacistIcon />} active={role === 'Pharmacist'} onClick={() => setRole('Pharmacist')} />
                    </div>
                </div>

                {role === 'Doctor' && (
                    <div style={{ marginBottom: '40px' }}>
                        <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Professional Details</p>
                        
                        <Input 
                            placeholder="Professional Title (e.g. BDS, MDS, MS)" 
                            value={professionalTitle}
                            onChange={(e) => setProfessionalTitle(e.target.value)}
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} 
                        />

                        <div style={{ position: 'relative' }}>
                            <select 
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '18px 24px',
                                    borderRadius: '20px',
                                    border: '1px solid #E5E7EB',
                                    appearance: 'none',
                                    backgroundColor: '#fff',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#111827',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="" disabled>Select Department</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '-16px', marginBottom: '24px' }}>
                        <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>{error}</p>
                    </div>
                )}
                
                <div style={{ backgroundColor: '#E0F7FA', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', marginBottom: '24px', border: '1px solid #00E3D3' }}>
                    <div style={{ color: '#00897B', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </div>
                    <p style={{ fontSize: '13px', color: '#00695C', fontWeight: '500', lineHeight: '1.4' }}>
                        Access pending – wait for Admin approval. You will be notified via SMS once approved.
                    </p>
                </div>

                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </div>
        </AuthLayout>
    );
};

export default RequestAccessPage;
