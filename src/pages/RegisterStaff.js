import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import { authService } from '../services/authService';
import { DEPARTMENTS } from '../utils/constants';

const RegisterStaffPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        experience: '',
        role: location.state?.initialRole || '',
        department: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        setError('');
        
        // Match NewStaffActivity.java validations
        const { name, phone, email, password, experience, role, department } = formData;
        
        if (!name || !phone || !email || !password || !experience || !role) {
            setError('Please fill all fields');
            return;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate experience is a positive number
        const expVal = parseFloat(experience);
        if (isNaN(expVal) || expVal < 0) {
            setError('Please enter a valid number for years of experience');
            return;
        }

        if (phone.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (role === 'doctor' && !department) {
            setError('Please select a department for the doctor');
            return;
        }

        setLoading(true);
        try {
            // Match NewStaffActivity.java experience formatting
            const formattedExperience = experience + (experience.toLowerCase().endsWith("years") ? "" : " Years");
            
            const payload = {
                ...formData,
                experience: formattedExperience,
                mobile: phone // Backend expects 'mobile' or 'phone', NewStaffActivity uses 'phone' in JSON but maps from etMobileNumber
            };
            
            if (role !== 'doctor') {
                delete payload.department;
            }
            
            await authService.register(payload);
            navigate('/registration-success', { 
                state: { 
                    name: name, 
                    role: role.charAt(0).toUpperCase() + role.slice(1),
                    email: email, // Backend returns final email if it was generated, but here admin provides it
                    phone: phone
                } 
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register staff. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="New User" subtitle="Add a new staff member to the hospital system">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Registration</h2>
                    <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '500' }}>Add a new staff member to the hospital system.</p>
                </div>

                <div className="registration-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* name -> user icon */}
                    <Input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Full Name *" 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                    />
                    
                    {/* email -> mail icon */}
                    <Input 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Email Address *" 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><rect width="20" height="16" x="2" y="4" rx="2"/></svg>}
                    />
                    
                    {/* phone -> phone icon */}
                    <Input 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="Mobile Number *" 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                    />

                    {/* password -> lock icon */}
                    <Input 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password *" 
                        icon={(
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        )}
                        rightIcon={
                            showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                            )
                        }
                        onRightIconClick={() => setShowPassword(!showPassword)}
                    />

                    <Input 
                        name="experience" 
                        value={formData.experience} 
                        onChange={handleChange} 
                        placeholder="Years of Experience *" 
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-2a2 2 0 1 1 0-4h2"/><path d="M12 5v2m0 10v2"/><rect width="20" height="18" x="2" y="3" rx="2"/></svg>}
                    />

                    <div className="form-group" style={{ position: 'relative', marginBottom: formData.role === 'doctor' ? '0' : '24px' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', fontWeight: '700', color: '#00E3D3' }}>Role</div>
                        <select name="role" value={formData.role} onChange={handleChange} className="input-field" style={{ paddingLeft: '24px', cursor: 'pointer', appearance: 'none' }}>
                            <option value="">Select Role *</option>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="pharmacist">Pharmacist</option>
                        </select>
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>

                    {formData.role === 'doctor' && (
                        <div className="form-group" style={{ position: 'relative', marginBottom: '24px', marginTop: '24px' }}>
                            <div style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: 'white', padding: '0 4px', fontSize: '12px', fontWeight: '700', color: '#00E3D3' }}>Department</div>
                            <select name="department" value={formData.department} onChange={handleChange} className="input-field" style={{ paddingLeft: '24px', cursor: 'pointer', appearance: 'none' }}>
                                <option value="">Select Department *</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ marginTop: '-8px' }}>
                            <p style={{ color: '#EF4444', fontSize: '14px', fontWeight: '500' }}>{error}</p>
                        </div>
                    )}

                    <button 
                        onClick={handleRegister} disabled={loading}
                        style={{ backgroundColor: '#008080', color: 'white', border: 'none', borderRadius: '24px', padding: '18px', fontSize: '16px', fontWeight: '800', width: '100%', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Registering...' : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                                Register User
                            </>
                        )}
                    </button>

                    <div style={{ backgroundColor: '#EFF6FF', borderRadius: '16px', padding: '24px', display: 'flex', gap: '16px', marginTop: '24px' }}>
                        <div style={{ color: '#3B82F6' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </div>
                        <p style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '500', lineHeight: '1.5' }}>
                            The newly registered staff member will receive their login credentials via email once their account is activated by the admin.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RegisterStaffPage;
