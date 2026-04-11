import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import PharmacistLayout from '../components/PharmacistLayout';
import DashboardLayout from '../components/DashboardLayout';
import { getAvatarUrl, getInitialsAvatar, Icons } from '../utils/helpers';
import { authService } from '../services/authService';
import api from '../services/api';
import { DEPARTMENTS } from '../utils/constants';

const EditableField = ({ label, name, value, onChange, placeholder, disabled, icon }) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {icon}
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {label}
            </label>
        </div>
        <input
            type="text"
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #F1F5F9',
                backgroundColor: disabled ? '#F8FAFC' : '#fff',
                color: disabled ? '#94A3B8' : '#111827',
                fontSize: '15px',
                fontWeight: '600',
                outline: 'none',
                transition: 'border-color 0.2s',
            }}
            onFocus={e => !disabled && (e.target.style.borderColor = '#00BFB3')}
            onBlur={e => !disabled && (e.target.style.borderColor = '#F1F5F9')}
        />
    </div>
);

const EditProfilePage = () => {
    const navigate = useNavigate();
    const localUser = authService.getCurrentUser() || {};
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        professional_title: '',
        specialization: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Build 6 gender-based avatar options using reliable randomuser.me CDN
    const getPresetAvatars = (gender) => {
        const g = (gender || '').toLowerCase();
        const isFemale = g === 'female' || g === 'f';
        const path = isFemale ? 'women' : 'men';
        // Pick 6 varied portrait numbers spread across the pool
        const picks = isFemale
            ? [3, 9, 15, 22, 31, 40]   // women
            : [5, 12, 20, 28, 36, 50]; // men
        return picks.map(n => `https://randomuser.me/api/portraits/${path}/${n}.jpg`);
    };
    const AVATARS = getPresetAvatars(localUser.gender);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/user-settings');
                const user = res.data?.user || localUser;
                setFormData({
                    name: user.name || user.full_name || '',
                    phone: user.phone || '',
                    professional_title: user.professional_title || '',
                    specialization: user.department || user.specialization || '',
                    avatar_url: user.avatar_url || ''
                });
            } catch {
                setFormData({
                    name: localUser.name || localUser.full_name || '',
                    phone: localUser.phone || '',
                    professional_title: localUser.professional_title || '',
                    specialization: localUser.department || '',
                    avatar_url: localUser.avatar_url || ''
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarSelect = (url) => {
        setFormData({ ...formData, avatar_url: url });
        setShowAvatarPicker(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);
        try {
            await authService.updateProfile(formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const isAdmin = (localUser.role || '').toLowerCase() === 'admin';
    const isPharmacist = (localUser.role || '').toLowerCase() === 'pharmacist';
    const Layout = isAdmin ? DashboardLayout : isPharmacist ? PharmacistLayout : DoctorLayout;

    const employeePrefix = isAdmin ? 'ADM' : isPharmacist ? 'PH' : 'DR';
    const employeeId = `${employeePrefix}-${String(localUser.id || '00000').padStart(5, '0')}-DIAS`;
    const currentAvatar = getAvatarUrl(formData.avatar_url, localUser.gender, formData.name);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <Layout title={isAdmin ? "Account Settings" : undefined}>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: isAdmin ? '0' : '20px 0' }}>
                
                {/* ── Header ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => navigate(-1)} style={{
                            width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                            background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                        </button>
                        <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#111827', margin: 0 }}>Personal Information</h1>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            backgroundColor: '#00BFB3', color: '#fff', border: 'none', 
                            padding: '10px 24px', borderRadius: '12px', fontSize: '14px', 
                            fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s',
                            opacity: saving ? 0.7 : 1, boxShadow: '0 4px 12px rgba(0,191,179,0.2)'
                        }}
                        onMouseOver={e => !saving && (e.currentTarget.style.backgroundColor = '#00897B')}
                        onMouseOut={e => !saving && (e.currentTarget.style.backgroundColor = '#00BFB3')}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#FEF2F2', color: '#EF4444', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '700', border: '1px solid #FEE2E2' }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{ backgroundColor: '#F0FDF4', color: '#10B981', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '700', border: '1px solid #DCFCE7' }}>
                        Profile updated successfully!
                    </div>
                )}

                {/* ── Profile Summary Card ── */}
                <div style={{ 
                    backgroundColor: '#fff', borderRadius: '24px', padding: '24px', 
                    display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6'
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #E6FCFA' }}>
                            <img 
                                src={currentAvatar} 
                                alt="profile" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(formData.name || localUser.name || 'User'); }}
                            />
                        </div>
                        {/* Edit Badge */}
                        <div 
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            style={{ 
                                position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', 
                                backgroundColor: '#00897B', borderRadius: '50%', border: '2px solid #fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
                            {formData.name || 'User'}
                        </h2>
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#00897B', margin: '0 0 2px 0', textTransform: 'capitalize' }}>
                            {localUser.role} {isAdmin ? '' : `• ${formData.specialization || 'General'}`}
                        </p>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#94A3B8', margin: 0 }}>Employee Status: Active</p>
                    </div>
                </div>

                {/* ── Avatar Picker ── */}
                {showAvatarPicker && (
                    <div style={{ 
                        backgroundColor: '#fff', borderRadius: '24px', padding: '24px', 
                        marginBottom: '24px', border: '1px solid #E6FCFA', 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                    }}>
                        <p style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', marginBottom: '16px', textTransform: 'uppercase' }}>Select New Profile Picture</p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {AVATARS.map((url, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => handleAvatarSelect(url)}
                                    style={{ 
                                        width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', 
                                        border: formData.avatar_url === url ? '3px solid #00BFB3' : '3px solid transparent',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <img 
                                        src={url} 
                                        alt={`avatar-${idx}`} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(formData.name || 'User'); }}
                                    />
                                </div>
                            ))}
                            <div style={{ flexBasis: '100%', marginTop: '12px' }}>
                                <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px' }}>OR PROVIDE IMAGE URL</p>
                                <input 
                                    type="text" 
                                    placeholder="https://example.com/image.png"
                                    value={formData.avatar_url}
                                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                                    style={{ width: '100%', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #F1F5F9', fontSize: '13px' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Details Card ── */}
                <div style={{ 
                    backgroundColor: '#fff', borderRadius: '32px', padding: '32px', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '40px',
                    border: '1px solid #F1F5F9'
                }}>
                    <EditableField 
                        label="FULL NAME" name="name" value={formData.name} 
                        onChange={handleChange} placeholder="Enter your full name" 
                        icon={Icons.user(14, '#9CA3AF')}
                    />
                    <EditableField 
                        label="ACCESS ID" value={employeeId} disabled={true} 
                        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                    />
                    
                    {!isAdmin && (
                        <>
                            <EditableField 
                                label="DESIGNATION" 
                                name="professional_title" 
                                value={formData.professional_title} 
                                onChange={handleChange} 
                                placeholder={isPharmacist ? "e.g. Chief Pharmacist" : "e.g. Senior Consultant"} 
                            />
                            
                            {!isPharmacist && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><path d="M3 21h18M3 7l9-4 9 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M9 21V11h6v10"/></svg>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>DEPARTMENT</label>
                                    </div>
                                    <select 
                                        name="specialization" 
                                        value={formData.specialization} 
                                        onChange={handleChange}
                                        style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', 
                                            border: '1.5px solid #F1F5F9', fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none'
                                        }}
                                    >
                                        <option value="">Select Department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <EditableField 
                        label="MOBILE NUMBER" name="phone" value={formData.phone} 
                        onChange={handleChange} placeholder="Enter mobile number" 
                        icon={Icons.phone(14, '#9CA3AF')}
                    />
                    
                    <div style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            {Icons.mail(14, '#9CA3AF')}
                            <p style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>OFFICIAL EMAIL</p>
                        </div>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#94A3B8', margin: 0 }}>{localUser.email || '—'}</p>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: '#CBD5E1', marginTop: '4px' }}>Email cannot be changed via profile settings.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EditProfilePage;
