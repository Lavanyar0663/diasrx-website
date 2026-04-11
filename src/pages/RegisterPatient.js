import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import { authService } from '../services/authService';
import { DEPARTMENTS } from '../utils/constants';

const RegisterPatientPage = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser() || {};
    const isDoctor = currentUser.role === 'doctor';
    
    const [patientId] = useState('Auto-generated');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        department: isDoctor ? (currentUser.department || '') : ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        setError('');
        if (!formData.name || !formData.phone || !formData.age || !formData.gender || !formData.department) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        try {
            // Match mobile app NewPatientActivity.java logic
            const payload = {
                ...formData,
                role: 'patient',
                password: null // Patients don't need a password for registration
            };
            
            await authService.register(payload);
            
            // Redirect to success or list
            if (isDoctor) {
                navigate('/doctor-patients');
            } else {
                navigate('/manage-patients');
            }
        } catch (err) {
            console.error('Registration error:', err);
            const msg = err.response?.data?.message || 'Failed to register patient.';
            
            // Premium error feedback for duplicates
            if (msg.toLowerCase().includes('already registered')) {
                setError('A patient with this mobile number already exists in the system. To prevent duplicate assignments, please search for them in the patients list instead.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title="New Patient" subtitle="Register a new patient into the hospital clinical area">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Registration</h2>
                        <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '600' }}>
                            Assign ID: <span style={{ color: '#009688' }}>{patientId}</span>
                        </p>
                    </div>
                    {isDoctor && (
                        <div style={{ backgroundColor: '#F0FDFA', padding: '12px 20px', borderRadius: '16px', border: '1.5px solid #CCFBF1' }}>
                            <p style={{ fontSize: '11px', fontWeight: '800', color: '#0D9488', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Clinical Department</p>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{currentUser.department}</p>
                        </div>
                    )}
                </div>

                <div className="registration-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* ... rest of the form ... */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <Input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Patient Full Name *" 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <Input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            placeholder="Mobile Number *" 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <Input 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="Email Address (Optional)" 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                        />
                    </div>

                    <div className="form-group">
                        <Input 
                            type="number"
                            name="age" 
                            value={formData.age} 
                            onChange={handleChange} 
                            placeholder="Age *" 
                        />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: 'white', padding: '0 8px', fontSize: '12px', fontWeight: '800', color: '#00E3D3' }}>Sex</div>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field" style={{ paddingLeft: '24px', cursor: 'pointer', appearance: 'none', backgroundColor: 'transparent' }}>
                            <option value="">Select Sex *</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', backgroundColor: 'white', padding: '0 8px', fontSize: '12px', fontWeight: '800', color: '#00E3D3' }}>Assigned Department</div>
                        <select 
                            name="department" 
                            value={formData.department} 
                            onChange={handleChange} 
                            className="input-field" 
                            disabled={isDoctor}
                            style={{ paddingLeft: '24px', paddingRight: '48px', cursor: isDoctor ? 'not-allowed' : 'pointer', appearance: 'none', backgroundColor: isDoctor ? '#F8FAFC' : 'transparent', color: isDoctor ? '#94A3B8' : '#111827' }}
                        >
                            <option value="">Select Clinic Area *</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {!isDoctor && (
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'none' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{ gridColumn: '1 / -1', marginTop: '-8px' }}>
                            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '12px', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '700', margin: 0 }}>{error}</p>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleRegister} disabled={loading}
                        style={{ gridColumn: '1 / -1', backgroundColor: '#009688', color: 'white', border: 'none', borderRadius: '24px', padding: '20px', fontSize: '16px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '12px', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                                Finalize Registration
                            </>
                        )}
                    </button>

                    <div style={{ gridColumn: '1 / -1', backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', marginTop: '24px', border: '1px solid #E5E7EB' }}>
                        <div style={{ color: '#2196F3' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </div>
                        <p style={{ fontSize: '15px', color: '#1E40AF', fontWeight: '600', lineHeight: '1.6' }}>
                            {isDoctor 
                                ? `As a doctor in the ${currentUser.department} department, this patient will be automatically assigned to you upon registration to ensure no duplicate assignments.`
                                : "Newly registered patients will be added to the hospital registry. A file will be created automatically for the assigned clinical department."}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RegisterPatientPage;
