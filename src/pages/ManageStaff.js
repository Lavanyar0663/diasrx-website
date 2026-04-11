import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

import { getAvatarUrl } from '../utils/helpers';

const ManageStaffPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const doctors = [
        { id: 1, name: 'Dr. Sarah Jenkins', department: 'Periodontics', status: 'ACTIVE' },
        { id: 2, name: 'Dr. Michael Chen', department: 'Orthodontics', status: 'ACTIVE' },
        { id: 3, name: 'Dr. Alana Smith', department: 'Endodontics', status: 'ACTIVE' },
        { id: 4, name: 'Dr. Robert Wilson', department: 'Oral Surgery', status: 'ON LEAVE' },
        { id: 5, name: 'Dr. Emily Davis', department: 'Prosthodontics', status: 'ACTIVE' }
    ].map(doc => ({ ...doc, avatar: getAvatarUrl(null, doc.gender, doc.id, doc.name) }));

    const filteredStaff = doctors.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Manage Doctors" subtitle="Directory of all registered medical staff">
            <div style={{ position: 'relative' }}>
                <div className="search-container" style={{ marginBottom: '32px' }}>
                    <div className="search-bar" style={{ width: '100%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by name or department..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                </div>

                <div className="manage-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredStaff.map(staff => (
                        <div key={staff.id} className="request-item" style={{ padding: '20px 32px' }}>
                            <div className="user-profile">
                                <div className="user-avatar" style={{ backgroundColor: staff.avatar ? 'transparent' : '#F3F4F6' }}>
                                    {staff.avatar ? (
                                        <img src={staff.avatar} alt={staff.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    )}
                                </div>
                                <div className="user-info">
                                    <h4 style={{ fontSize: '18px' }}>{staff.name}</h4>
                                    <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '500' }}>{staff.department}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ 
                                    fontSize: '11px', 
                                    fontWeight: '800', 
                                    padding: '4px 12px', 
                                    borderRadius: '8px', 
                                    backgroundColor: staff.status === 'ACTIVE' ? '#F0FDFA' : '#F3F4F6',
                                    color: staff.status === 'ACTIVE' ? '#2DD4BF' : '#6B7280',
                                    letterSpacing: '0.05em'
                                }}>
                                    {staff.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating Action Button */}
                <button className="fab-btn" style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '40px',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#00E3D3',
                    border: 'none',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0, 227, 211, 0.4)',
                    cursor: 'pointer',
                    zIndex: 1000
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
            </div>
        </DashboardLayout>
    );
};

export default ManageStaffPage;
