import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PharmacistLayout from '../components/PharmacistLayout';
import { authService } from '../services/authService';
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

const PharmacistSettingsPage = () => {
    const navigate = useNavigate();
    const localUser = authService.getCurrentUser() || {};
    const [twoFactor, setTwoFactor] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsData = await authService.getUserSettings();
                if (settingsData?.settings) {
                    setTwoFactor(
                        settingsData.settings.isTwoFactorEnabled === 1 ||
                        settingsData.settings.isTwoFactorEnabled === true
                    );
                } else {
                    const ls = authService.getSettings();
                    if (ls) {
                        setTwoFactor(ls.isTwoFactorEnabled === 1 || ls.isTwoFactorEnabled === true);
                    }
                }
            } catch (err) {
                console.error('Settings fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle2FA = async () => {
        const newVal = !twoFactor;
        setTwoFactor(newVal);
        try {
            await authService.updateUserSettings({ isTwoFactorEnabled: newVal ? 1 : 0 });
        } catch (err) {
            console.error('Failed to update 2FA:', err);
            setTwoFactor(!newVal);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const cleanName = (localUser?.full_name || localUser?.name || 'Pharmacist')
        .replace(/^(Ph\.?)\s*/i, '')
        .trim();

    const avatarUrl = getAvatarUrl(localUser?.avatar_url, localUser?.gender, localUser?.id, cleanName);
    const employeeId = `PH-${String(localUser?.id || '000').padStart(3, '0')}-DIAS`;

    return (
        <PharmacistLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                {/* ── Profile Header ── */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <div style={{ width: '104px', height: '104px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #E6FCFA', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                            <img
                                src={avatarUrl}
                                alt="Pharmacist"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
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
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: '0 0 4px 0', textAlign: 'center' }}>
                        {cleanName}
                    </h1>
                    <p style={{ fontSize: '13px', fontWeight: '800', color: '#00897B', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>
                        Licensed Pharmacist
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', margin: 0 }}>
                        {employeeId}
                    </p>

                    {/* Quick info chips with standard icons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {localUser?.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px' }}>
                                {Icons.phone(13, '#6B7280')}
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{localUser.phone}</span>
                            </div>
                        )}
                        {localUser?.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px' }}>
                                {Icons.mail(13, '#6B7280')}
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>{localUser.email}</span>
                            </div>
                        )}
                    </div>
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
                        text="Security Settings"
                        onClick={() => navigate('/pharmacist-change-password')}
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
                </div>

                {/* ── Logout ── */}
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
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#EF4444' }}>Logout Account</span>
                </button>
            </div>
        </PharmacistLayout>
    );
};

export default PharmacistSettingsPage;
