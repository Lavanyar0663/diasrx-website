import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { authService } from '../services/authService';

const NotificationMasterPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        docToPhar: true,
        whatsapp: true,
        email: false,
        security: true,
        latency: false
    });
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await authService.getUserSettings();
                if (data && data.settings) {
                    const s = data.settings;
                    setSettings({
                        docToPhar: s.isNotificationsEnabled === 1 || s.isNotificationsEnabled === true,
                        whatsapp: s.isWhatsAppEnabled === 1 || s.isWhatsAppEnabled === true,
                        email: s.isEmailEnabled === 1 || s.isEmailEnabled === true,
                        security: s.isSecurityAlertsEnabled === 1 || s.isSecurityAlertsEnabled === true,
                        latency: s.isLatencyEnabled === 1 || s.isLatencyEnabled === true
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
                const local = authService.getSettings();
                if (local) {
                    setSettings({
                        docToPhar: local.isNotificationsEnabled === 1,
                        whatsapp: local.isWhatsAppEnabled === 1,
                        email: local.isEmailEnabled === 1,
                        security: local.isSecurityAlertsEnabled === 1,
                        latency: local.isLatencyEnabled === 1
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSave = async () => {
        try {
            await authService.updateUserSettings({
                isNotificationsEnabled: settings.docToPhar ? 1 : 0,
                isWhatsAppEnabled: settings.whatsapp ? 1 : 0,
                isEmailEnabled: settings.email ? 1 : 0,
                isSecurityAlertsEnabled: settings.security ? 1 : 0,
                isLatencyEnabled: settings.latency ? 1 : 0
            });
            navigate('/settings-updated');
        } catch (err) {
            console.error("Failed to save master settings:", err);
            alert("Failed to save settings. Please try again.");
        }
    };

    return (
        <DashboardLayout title="Notification Master" subtitle="Manage hospital-wide alert configurations">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>Notification Master</h2>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Admin Interface</p>
                    <p style={{ fontSize: '16px', color: '#6B7280', fontWeight: '600', lineHeight: '1.5' }}>
                        Manage hospital-wide alert configurations and delivery channels.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <NotifySection title="Prescription Alerts">
                        <NotifyCard 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>}
                            title="Doctor to Pharmacist" 
                            subtitle="New prescription routing alerts"
                            enabled={settings.docToPhar}
                            onToggle={() => toggle('docToPhar')}
                        />
                    </NotifySection>

                    <NotifySection title="Patient Reminders">
                        <NotifyCard 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.5c.7 0 1.35.09 1.95.26"/><path d="M21 21l-4.3-4.3"/></svg>}
                            title="WhatsApp Notifications" 
                            subtitle="Appointment & Follow-up texts"
                            enabled={settings.whatsapp}
                            onToggle={() => toggle('whatsapp')}
                        />
                        <NotifyCard 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                            title="Email Campaigns" 
                            subtitle="Patient newsletters & reports"
                            enabled={settings.email}
                            onToggle={() => toggle('email')}
                        />
                    </NotifySection>

                    <NotifySection title="System Alerts">
                        <NotifyCard 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                            title="Security & Access" 
                            subtitle="Unusual login & permission changes"
                            enabled={settings.security}
                            onToggle={() => toggle('security')}
                        />
                        <NotifyCard 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>}
                            title="Database Latency" 
                            subtitle="Alerts for slow query performance"
                            enabled={settings.latency}
                            onToggle={() => toggle('latency')}
                        />
                    </NotifySection>
                </div>

                <div style={{ marginTop: '48px', paddingBottom: '40px' }}>
                    <button 
                        onClick={handleSave}
                        style={{ width: '100%', padding: '20px', backgroundColor: '#C4B5FD', color: '#1F2937', border: 'none', borderRadius: '24px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(196, 181, 253, 0.3)' }}
                    >
                        Save Global Changes
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '24px' }}>Administrative</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

const NotifySection = ({ title, children }) => (
    <div>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', marginLeft: '8px' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {children}
        </div>
    </div>
);

const NotifyCard = ({ icon, title, subtitle, enabled, onToggle }) => (
    <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '24px 32px', 
        border: '1px solid #E5E7EB', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icon}
            </div>
            <div>
                <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '2px' }}>{title}</h4>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF' }}>{subtitle}</p>
            </div>
        </div>
        <div 
            onClick={onToggle} 
            style={{ 
                width: '44px', 
                height: '24px', 
                backgroundColor: enabled ? '#A78BFA' : '#1F2937', 
                borderRadius: '12px', 
                position: 'relative', 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: 'white', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '2px', 
                left: enabled ? '22px' : '2px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
        </div>
    </div>
);

export default NotificationMasterPage;
