import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';
import { doctorService } from '../services/doctorService';
import { getAvatarUrl, Icons } from '../utils/helpers';

const MenuItem = ({ icon, text, trailing, onClick, isDanger }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 0', borderBottom: '1px solid #F9FAFB', cursor: 'pointer',
            transition: 'opacity 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.opacity = 0.7}
        onMouseOut={e => e.currentTarget.style.opacity = 1}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: isDanger ? '#FEF2F2' : '#E6FCFA',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: isDanger ? '#EF4444' : '#111827' }}>{text}</span>
        </div>
        {trailing || (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
            </svg>
        )}
    </div>
);

const DoctorSettingsPage = () => {
    const navigate = useNavigate();
    const localUser = authService.getCurrentUser() || {};
    const [profile, setProfile] = useState(null);
    const [twoFactor, setTwoFactor] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                /* Fetch real doctor profile AND settings in parallel */
                const [profileData, settingsData] = await Promise.allSettled([
                    doctorService.getProfile(),
                    authService.getUserSettings(),
                ]);

                if (profileData.status === 'fulfilled') {
                    setProfile(profileData.value);
                }

                if (settingsData.status === 'fulfilled' && settingsData.value?.settings) {
                    setTwoFactor(
                        settingsData.value.settings.isTwoFactorEnabled === 1 ||
                        settingsData.value.settings.isTwoFactorEnabled === true
                    );
                } else {
                    // Fallback to local storage settings
                    const ls = authService.getSettings();
                    if (ls) {
                        setTwoFactor(ls.isTwoFactorEnabled === 1 || ls.isTwoFactorEnabled === true);
                    }
                }
            } catch (err) {
                console.error('Profile/settings fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleToggle2FA = async () => {
        const newVal = !twoFactor;
        setTwoFactor(newVal);
        try {
            await authService.updateUserSettings({ isTwoFactorEnabled: newVal ? 1 : 0 });
        } catch (err) {
            console.error('Failed to update 2FA:', err);
            setTwoFactor(!newVal); // revert
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    // Merge: API profile > local storage user
    const docName        = profile?.name || localUser?.full_name || localUser?.name || 'Doctor';
    const docGender      = profile?.gender || localUser?.gender || '';
    const docSpecial     = profile?.specialization || localUser?.department || 'Clinical Department';
    const docPhone       = profile?.phone || localUser?.phone || '';
    const docEmail       = localUser?.email || '';
    const employeeId     = `DR-${String(localUser?.id || '00000').padStart(5, '0')}-DIAS`;

    const docCleanName   = docName.toLowerCase();
    const inferredGender = docGender || 
        (docCleanName.includes('sarah') || docCleanName.includes('nandini') || docCleanName.includes('neelam') || docCleanName.includes('devi') ? 'female' : 
         docCleanName.includes('kavin') || docCleanName.includes('jenkins') ? 'male' : '');
    
    const avatarUrl      = getAvatarUrl(profile?.avatar_url || localUser?.avatar_url, inferredGender, localUser?.id, docName);

    return (
        <DoctorLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {/* ── Profile Header ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <div style={{ width: '104px', height: '104px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #E6FCFA', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                            {loading ? (
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#E2E8F0' }} />
                            ) : (
                                <img
                                    src={avatarUrl}
                                    alt="Doctor"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.style.backgroundColor = '#E0F2F1';
                                        e.target.parentElement.style.display = 'flex';
                                        e.target.parentElement.style.alignItems = 'center';
                                        e.target.parentElement.style.justifyContent = 'center';
                                    }}
                                />
                            )}
                        </div>
                        {/* Edit badge */}
                        <div
                            onClick={() => navigate('/edit-profile')}
                            style={{
                                position: 'absolute', bottom: 2, right: 2, width: '30px', height: '30px',
                                backgroundColor: '#00897B', borderRadius: '50%', border: '2px solid #fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,135,123,0.4)'
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Name + role */}
                    <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: '0 0 4px 0', textAlign: 'center' }}>
                        {loading ? '...' : `Dr. ${docName.replace(/^Dr\.\s*/i, '')}`}
                    </h1>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#00897B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                        {loading ? '...' : docSpecial}
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', margin: 0 }}>
                        {loading ? '' : employeeId}
                    </p>

                    {/* Quick info chips */}
                    {!loading && (docPhone || docEmail) && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {docPhone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px' }}>
                                    {Icons.phone(13, '#6B7280')}
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{docPhone}</span>
                                </div>
                            )}
                            {docEmail && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px' }}>
                                    {Icons.mail(13, '#6B7280')}
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{docEmail}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Menu Card ── */}
                <div style={{
                    backgroundColor: '#fff', borderRadius: '32px', padding: '8px 32px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px'
                }}>
                    <MenuItem
                        icon={Icons.user(20, '#00897B')}
                        text="Personal Information"
                        onClick={() => navigate('/edit-profile')}
                    />
                    <MenuItem
                        icon={Icons.lock(20, '#00897B')}
                        text="Change Password"
                        onClick={() => navigate('/doctor-change-password')}
                    />
                    <MenuItem
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                        text="Two-Factor Authentication"
                        onClick={handleToggle2FA}
                        trailing={
                            <div style={{
                                width: '48px', height: '26px', borderRadius: '13px',
                                backgroundColor: twoFactor ? '#00897B' : '#E5E7EB',
                                position: 'relative', transition: 'all 0.3s', cursor: 'pointer', flexShrink: 0
                            }}>
                                <div style={{
                                    width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff',
                                    position: 'absolute', top: '2px',
                                    left: twoFactor ? '24px' : '2px',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                                }} />
                            </div>
                        }
                    />
                    <MenuItem
                        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>}
                        text="Notification Settings"
                        onClick={() => navigate('/notification-preferences')}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E6FCFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
                                </svg>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>App Language</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF' }}>English</span>
                    </div>
                </div>

                {/* ── Logout Button ── */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', padding: '18px', backgroundColor: '#fff', borderRadius: '100px',
                        border: '1.5px solid #FEE2E2', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '10px', cursor: 'pointer',
                        transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(239,68,68,0.05)',
                        marginBottom: '32px'
                    }}
                    onMouseOver={e => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                    onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#EF4444' }}>Logout Account</span>
                </button>
            </div>
        </DoctorLayout>
    );
};

export default DoctorSettingsPage;
