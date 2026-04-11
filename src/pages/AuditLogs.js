import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const AuditLogs = () => {
    return (
        <DashboardLayout 
            title="Audit Logs" 
            subtitle="Security and system activity tracking."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '4px', height: '24px', backgroundColor: '#00E3D3', borderRadius: '2px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>System Audit Trail</h2>
                </div>
                
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    padding: '60px', 
                    textAlign: 'center',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📜</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Audit Logging System</h3>
                    <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto', lineHeight: '1.5' }}>
                        This area will track all administrative actions, security events, and data modifications once the audit sub-system is fully operational.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AuditLogs;
