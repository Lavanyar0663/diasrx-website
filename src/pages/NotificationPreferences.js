import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { authService } from '../services/authService';

const Toggle = ({ checked, onChange }) => (
    <div
        onClick={() => onChange(!checked)}
        style={{
            width: '48px', height: '28px', borderRadius: '14px',
            backgroundColor: checked ? '#00E3D3' : '#D1D5DB',
            position: 'relative', cursor: 'pointer',
            transition: 'background 0.25s ease', flexShrink: 0
        }}
    >
        <div style={{
            position: 'absolute', top: '3px',
            left: checked ? '23px' : '3px',
            width: '22px', height: '22px', borderRadius: '50%',
            backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            transition: 'left 0.25s ease'
        }} />
    </div>
);

const sections = [
    {
        label: 'PRESCRIPTION ALERTS',
        items: [
            { id: 'dispensed',  title: 'Prescription Dispensed', sub: 'Notify when the pharmacy completes a fill', field: 'isNotificationsEnabled' },
            { id: 'urgent',     title: 'Urgent Fulfillment',     sub: 'Alerts for high-priority emergency prescriptions', field: 'isWhatsAppEnabled' },
            { id: 'drafts',     title: 'Draft Reminders',        sub: 'Remind about incomplete prescriptions', field: 'isEmailEnabled' },
        ]
    },
    {
        label: 'SYSTEM NOTIFICATIONS',
        items: [
            { id: 'appupdates', title: 'App Updates',           sub: 'Stay informed about new features and fixes', field: 'isOnboardingEnabled' },
            { id: 'hospital',   title: 'Hospital Announcements',sub: 'General broadcast from the dental administration', field: 'isSecurityAlertsEnabled' },
        ]
    },
];

const NotificationPreferencesPage = () => {
    const navigate = useNavigate();
    const [prefs, setPrefs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await authService.getUserSettings();
                if (data && data.settings) {
                    const s = data.settings;
                    const loadedPrefs = {};
                    sections.forEach(sec => {
                        sec.items.forEach(item => {
                            loadedPrefs[item.id] = (s[item.field] === 1 || s[item.field] === true);
                        });
                    });
                    setPrefs(loadedPrefs);
                }
            } catch (err) {
                console.error("Failed to load prefs:", err);
                // Fallback to defaults or localstorage
                const local = authService.getSettings();
                if (local) {
                    const loadedPrefs = {};
                    sections.forEach(sec => {
                        sec.items.forEach(item => {
                            loadedPrefs[item.id] = (local[item.field] === 1);
                        });
                    });
                    setPrefs(loadedPrefs);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const toggle = async (id, field) => {
        const newValue = !prefs[id];
        setPrefs(prev => ({ ...prev, [id]: newValue }));
        try {
            await authService.updateUserSettings({ [field]: newValue ? 1 : 0 });
        } catch (err) {
            console.error("Failed to update toggles:", err);
            setPrefs(prev => ({ ...prev, [id]: !newValue })); // revert
        }
    };

    return (
        <DoctorLayout>
            {/* Back + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <button onClick={() => navigate(-1)} style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    backgroundColor: '#F3F4F6', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Notification Preferences</h1>
            </div>

            <div style={{ maxWidth: '680px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontWeight: 'bold' }}>Loading preferences...</p>
                ) : sections.map((sec, si) => (
                    <div key={sec.label} style={{ marginBottom: '28px' }}>
                        {/* Section label */}
                        <p style={{
                            fontSize: '11px', fontWeight: '800', color: '#00BFB3',
                            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px'
                        }}>
                            {sec.label}
                        </p>

                        {/* Items card */}
                        <div style={{
                            backgroundColor: '#fff', borderRadius: '18px',
                            border: '1px solid #E5E7EB', overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                        }}>
                            {sec.items.map((item, idx) => (
                                <div key={item.id}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                        padding: '18px 22px'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginBottom: '3px' }}>
                                                {item.title}
                                            </p>
                                            <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', lineHeight: '1.4' }}>
                                                {item.sub}
                                            </p>
                                        </div>
                                        <Toggle checked={prefs[item.id]} onChange={() => toggle(item.id, item.field)} />
                                    </div>
                                    {idx < sec.items.length - 1 && (
                                        <div style={{ height: '1px', backgroundColor: '#F3F4F6', marginLeft: '22px' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Footer */}
                <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#D1D5DB', marginTop: '12px' }}>
                    DIAS Rx System © 2024
                </p>
            </div>
        </DoctorLayout>
    );
};

export default NotificationPreferencesPage;
