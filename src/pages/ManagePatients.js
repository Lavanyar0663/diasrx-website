import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { patientService } from '../services/patientService';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const ManagePatientsPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await patientService.getPatients();
                setPatients(data);
            } catch (error) {
                console.error("Error fetching patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const getBadgeStyles = (dept) => {
        const d = dept?.toLowerCase() || '';
        if (d.includes('general')) return { bg: '#F0FDFA', text: '#2DD4BF' };
        if (d.includes('ortho')) return { bg: '#EEF2FF', text: '#6366F1' };
        if (d.includes('perio')) return { bg: '#FDF2F8', text: '#EC4899' };
        return { bg: '#FFF7ED', text: '#F97316' };
    };

    const filteredPatients = patients.filter(p => 
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.pid && p.pid.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout title="Manage Patients" subtitle="Directory of all registered hospital patients">
            <div style={{ position: 'relative' }}>
                <div className="search-container" style={{ marginBottom: '32px' }}>
                    <div className="search-bar" style={{ width: '100%', backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search by name or PID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                </div>

                <div className="patient-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>Loading patients...</p>
                    ) : filteredPatients.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#6B7280', padding: '40px' }}>No patients found.</p>
                    ) : filteredPatients.map(patient => {
                        const style = getBadgeStyles(patient.department);
                        const avatarUrl = getAvatarUrl(patient.avatar_url || patient.profile_pic, patient.pat_gender || patient.gender || patient.sex, patient.id);

                        return (
                            <div key={patient.id} className="patient-card" onClick={() => navigate(`/patient-details/${patient.id}`, { state: { patient } })} style={{ 
                                backgroundColor: 'white', 
                                borderRadius: '24px', 
                                padding: '24px 32px', 
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img 
                                        src={avatarUrl} 
                                        alt="profile" 
                                        style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} 
                                        onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(patient.name); }}
                                    />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{patient.name}</h3>
                                            {patient.department && (
                                                <span style={{ fontSize: '12px', fontWeight: '800', color: style.text, backgroundColor: style.bg, padding: '4px 12px', borderRadius: '8px' }}>
                                                    {patient.department}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ color: '#2DD4BF', fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>{patient.pid || 'NO PID'}</p>
                                        <div style={{ display: 'flex', gap: '24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>{patient.age || '?'} / {patient.pat_gender || patient.gender || 'N/A'}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>{patient.formatted_date || (patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ color: '#E5E7EB' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button 
                    className="fab-btn" 
                    onClick={() => navigate('/register-patient')}
                    style={{
                        position: 'fixed', bottom: '40px', right: '40px', width: '64px', height: '64px',
                        borderRadius: '50%', backgroundColor: '#00E3D3', border: 'none', color: 'black',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(0, 227, 211, 0.4)', cursor: 'pointer', zIndex: 1000
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
            </div>
        </DashboardLayout>
    );
};

export default ManagePatientsPage;
