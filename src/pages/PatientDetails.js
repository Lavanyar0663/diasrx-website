import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { patientService } from '../services/patientService';
import { getAvatarUrl } from '../utils/helpers';

const PatientDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    
    // Prioritize patient object from the navigation state for instant rendering
    const [patient, setPatient] = useState(location.state?.patient || null);
    const [loading, setLoading] = useState(!location.state?.patient);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                // Background refresh if patient is from state, or initial fetch if missing
                const data = await patientService.getPatientById(id);
                if (data) {
                    setPatient(data);
                }
            } catch (error) {
                console.error("Error fetching patient details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    // If we have no patient in state and we are still loading, show loading screen
    if (loading && !patient) return (
        <DashboardLayout title="Patient Details" subtitle="Loading...">
            <p style={{ textAlign: 'center', padding: '50px' }}>Loading patient record...</p>
        </DashboardLayout>
    );

    // If we finished loading and STILL have no patient, show not found
    if (!loading && !patient) return (
        <DashboardLayout title="Patient Details" subtitle="Not Found">
            <p style={{ textAlign: 'center', padding: '50px' }}>Patient record not found.</p>
        </DashboardLayout>
    );

    // At this point, even if loading is true, we display what we have from 'patient' (either from state or fetch)
    const avatarUrl = getAvatarUrl(patient.avatar_url || patient.profile_pic, patient.gender || patient.sex, patient.id || patient.user_id, patient.name);

    return (
        <DashboardLayout title="Patient Details" subtitle="Comprehensive patient record and assignment">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{ 
                        width: '120px', height: '120px', borderRadius: '54px', 
                        backgroundColor: '#F3F4F6', margin: '0 auto 24px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        overflow: 'hidden', border: '4px solid #00E3D3' 
                    }}>
                        <img src={avatarUrl} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
                        <span style={{ 
                            backgroundColor: '#F0FDFA', color: '#2DD4BF', padding: '6px 16px', borderRadius: '12px', 
                            fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em'
                        }}>
                            {patient.pid || `PID-${patient.id?.toString().padStart(4, '0')}`}
                        </span>
                        <span style={{ 
                            backgroundColor: '#EFF6FF', color: '#3B82F6', padding: '6px 16px', borderRadius: '12px', 
                            fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em'
                        }}>
                            ACTIVE
                        </span>
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#111827' }}>{patient.name}</h1>
                </header>

                <DetailSection title="Personal Information">
                    <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <DataItem label="Age" value={patient.age || 'N/A'} />
                        <DataItem label="Gender" value={patient.gender || 'N/A'} />
                        <DataItem label="Blood Group" value={patient.blood_group || 'N/A'} />
                        <DataItem label="Weight" value={patient.weight ? `${patient.weight} kg` : 'N/A'} />
                    </div>
                </DetailSection>

                <DetailSection title="Contact Information">
                    <div className="contact-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <ContactItem 
                            label="Mobile" 
                            value={patient.phone || 'N/A'} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                        />
                        <ContactItem 
                            label="Email" 
                            value={patient.email || 'N/A'} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>} 
                        />
                        <ContactItem 
                            label="Address" 
                            value={patient.address || 'N/A'} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>} 
                        />
                    </div>
                </DetailSection>

                <DetailSection title="Clinical Assignment">
                    <div className="clinical-info" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Department</p>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{patient.department || 'N/A'}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Assigned Doctor</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                </div>
                                <p style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{patient.doctor_name || 'Not Assigned'}</p>
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Registration Date</p>
                            <p style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>{patient.formatted_date || (patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A')}</p>
                        </div>
                    </div>
                </DetailSection>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', paddingBottom: '64px' }}>
                    <button 
                        onClick={() => navigate(location.state?.from || '/manage-patients')}
                        style={{ backgroundColor: '#00E3D3', color: '#000', border: 'none', borderRadius: '16px', padding: '16px 48px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 227, 211, 0.3)' }}
                    >
                        Back to Directory
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

const DetailSection = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{title}</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '28px', padding: '32px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            {children}
        </div>
    </div>
);

const DataItem = ({ label, value }) => (
    <div>
        <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginBottom: '8px', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: '22px', fontWeight: '900', color: '#111827' }}>{value}</p>
    </div>
);

const ContactItem = ({ label, value, icon }) => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
        </div>
        <div>
            <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginBottom: '2px', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>{value}</p>
        </div>
    </div>
);

export default PatientDetailsPage;
