import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';
import { getAvatarUrl, getInitialsAvatar } from '../utils/helpers';

const RequestDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [request, setRequest] = useState(location.state?.request || null);
    const [loading, setLoading] = useState(!request);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const all = await adminService.getAllRequests();
                const found = all.find(r => r.id.toString() === id);
                setRequest(found);
            } catch (error) {
                console.error("Error fetching request detail", error);
            } finally {
                setLoading(false);
            }
        };
        if (!request) {
            fetchRequest();
        }
    }, [id, request]);

    const handleApprove = async () => {
        if (!window.confirm(`Are you sure you want to approve ${request.full_name || request.name}?`)) return;
        setActionLoading(true);
        try {
            await adminService.approveRequest(id);
            navigate('/access-requests');
        } catch (error) {
            alert("Failed to approve request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        const reason = prompt(`Enter reason for rejecting ${request.full_name || request.name}:`);
        if (reason === null) return;
        setActionLoading(true);
        try {
            await adminService.rejectRequest(id, reason);
            navigate('/access-requests');
        } catch (error) {
            alert("Failed to reject request");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <DashboardLayout title="Access Request" subtitle="Loading...">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #00E3D3', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                <p style={{ color: '#6B7280', fontSize: '15px', fontWeight: '600' }}>Fetching profile details...</p>
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );

    if (!request) return (
        <DashboardLayout title="Access Request" subtitle="Not Found">
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h3 style={{ color: '#111827', fontSize: '18px', fontWeight: '800' }}>Request not found</h3>
                <p style={{ color: '#6B7280' }}>The applicant record you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate('/access-requests')} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#00E3D3', fontWeight: '800', cursor: 'pointer' }}>Back to Requests</button>
            </div>
        </DashboardLayout>
    );

    const fullName = request.name || request.full_name || request.username || 'Applicant';
    const role = (request.role || 'Staff').toUpperCase();
    const status = (request.status || 'PENDING').toUpperCase();

    return (
        <DashboardLayout title="Access Request" subtitle="Verification details for staff registration">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ width: '128px', height: '128px', borderRadius: '40px', border: '4px solid #E0F2F1', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
                            <img 
                                src={getAvatarUrl(request.avatar_url || request.profile_pic, request.gender || request.sex, request.id || fullName, fullName)} 
                                alt="profile" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => { e.target.onerror = null; e.target.src = getInitialsAvatar(fullName); }}
                            />
                        </div>
                        <span style={{ 
                            position: 'absolute', 
                            bottom: '-8px', 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            backgroundColor: status === 'PENDING' ? '#F97316' : (status === 'APPROVED' || status === 'ACTIVE') ? '#00897B' : '#EF4444',
                            color: 'white',
                            padding: '6px 16px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            {status}
                        </span>
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', marginTop: '24px', marginBottom: '8px', color: '#111827' }}>{fullName}</h2>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '600' }}>
                        Request ID: #REQ-{request.id} • Submitted {request.formatted_date || 'Just now'}
                    </p>
                </header>

                <div className="detail-card" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '32px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>Applicant Classification</h3>
                    
                    <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                        <InfoItem 
                            label="Professional Role" 
                            value={role} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} 
                        />
                        <InfoItem 
                            label="Assigned Department" 
                            value={request.department || 'General'} 
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} 
                        />
                        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #F3F4F6', marginTop: '8px', paddingTop: '24px' }}>
                            <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>Contact Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                                <InfoItem 
                                    label="Mobile Number" 
                                    value={request.phone || 'Not Specified'} 
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                                />
                                <InfoItem 
                                    label="Email Address" 
                                    value={request.email || 'Not Specified'} 
                                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00897B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-card" style={{ backgroundColor: '#F9FAFB', borderRadius: '20px', padding: '24px', border: '1px solid #E5E7EB', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '12px', fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Access Capabilities</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#374151' }}>
                             Full {request.role === 'doctor' ? 'Clinical' : 'Pharmaceutical'} Access
                        </span>
                        <span style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#374151' }}>
                             Staff Management
                        </span>
                    </div>
                </div>

                {status === 'PENDING' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
                        <button 
                            onClick={handleApprove}
                            disabled={actionLoading}
                            style={{ backgroundColor: '#00897B', color: '#fff', border: 'none', borderRadius: '24px', padding: '20px', fontSize: '16px', fontWeight: '900', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: actionLoading ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,137,123,0.2)' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            {actionLoading ? 'Approving...' : 'Approve Access'}
                        </button>
                        <button 
                            onClick={handleReject}
                            disabled={actionLoading}
                            style={{ backgroundColor: '#fff', color: '#EF4444', border: '2px solid #EF4444', borderRadius: '24px', padding: '20px', fontSize: '16px', fontWeight: '900', cursor: actionLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: actionLoading ? 0.7 : 1, transition: 'all 0.2s' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            {actionLoading ? 'Rejecting...' : 'Reject Request'}
                        </button>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
};

const InfoItem = ({ label, value, icon }) => (
    <div className="info-item" style={{ display: 'flex', gap: '16px' }}>
        <div className="info-icon-wrapper" style={{ width: '40px', height: '40px', backgroundColor: '#F0FDF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div>
            <p className="info-label" style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>{label}</p>
            <p className="info-value" style={{ color: '#111827', fontSize: '16px', fontWeight: '800', margin: 0 }}>{value}</p>
        </div>
    </div>
);

export default RequestDetailPage;
