import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';
import { getAvatarUrl } from '../utils/helpers';

const RejectionReasonPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    
    const [staff, setStaff] = useState(location.state?.request || null);
    const [loading, setLoading] = useState(!location.state?.request);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            setLoading(true);
            try {
                const allRequests = await adminService.getAllRequests();
                const foundStaff = allRequests.find(req => String(req.id) === String(id));
                
                if (foundStaff) {
                    setStaff(foundStaff);
                } else {
                    setError('Registration record not found.');
                }
            } catch (err) {
                console.error('Error fetching rejection details:', err);
                setError('Failed to load registration details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (!staff && id) {
            fetchStaffDetails();
        }
    }, [id, staff]);

    const avatarUrl = staff ? getAvatarUrl(
        staff.name || staff.full_name || staff.username, 
        staff.gender || staff.sex || staff.sex_text, 
        staff.id
    ) : '';

    if (loading) {
        return (
            <DashboardLayout title="Rejection Details" subtitle="Loading record...">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div className="loader">Loading...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !staff) {
        return (
            <DashboardLayout title="Error" subtitle="Record not available">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#EF4444', fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>{error || 'Request details not found.'}</p>
                    <button 
                        onClick={() => navigate('/access-requests')}
                        style={{ backgroundColor: '#00E3D3', color: '#000', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: '800', cursor: 'pointer' }}
                    >
                        Back to List
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Rejection Details" subtitle="Review denial details for staff registration">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="detail-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', padding: '24px 32px' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#F3F4F6', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        overflow: 'hidden', border: '2px solid #EF4444' 
                    }}>
                        <img 
                            src={avatarUrl} 
                            alt="profile" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#111827', marginBottom: '8px' }}>{staff.name || staff.full_name || staff.username}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                                fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '6px', 
                                background: '#FEF2F2', color: '#EF4444', textTransform: 'uppercase' 
                            }}>
                                {staff.role}
                            </span>
                            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: '600' }}>• Registration ID: #STF-{staff.id}</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reason for Denial</p>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#111827' }}>Documentation/Verification Issue</h3>
                    </div>

                    <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.7', marginBottom: '40px', fontWeight: '500' }}>
                        {staff.rejection_reason || staff.reason || 'The application was rejected due to insufficient or unverified documentation. Common reasons include expired certifications or mismatching identifiers.'}
                    </p>

                    <div style={{ backgroundColor: '#F9FAFB', borderRadius: '20px', padding: '24px', borderLeft: '4px solid #EF4444' }}>
                        <p style={{ fontSize: '15px', color: '#6B7280', fontStyle: 'italic', lineHeight: '1.6' }}>
                            "This request has been denied by the administrative authority. If the applicant provides updated credentials, a new registration must be initiated."
                        </p>
                        <p style={{ textAlign: 'right', fontSize: '12px', fontWeight: '800', color: '#9CA3AF', marginTop: '16px', textTransform: 'uppercase' }}>— System Administrator</p>
                    </div>
                </div>

                <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <button 
                        onClick={() => navigate('/access-requests')}
                        style={{ width: '100%', backgroundColor: '#00E3D3', color: '#000', border: 'none', borderRadius: '20px', padding: '18px', fontSize: '16px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 227, 211, 0.3)' }}
                    >
                        Return to List
                    </button>
                    <button 
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '15px', fontWeight: '800', cursor: 'pointer', marginTop: '24px', textDecoration: 'underline' }}
                        onClick={() => alert('Please contact system support for reconsiderations.')}
                    >
                        Reconsider This Request
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RejectionReasonPage;
