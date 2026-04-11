import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';
import RequestRow from '../components/RequestRow';

const AccessRequestsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All'); // All, Approved, Rejected
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllRequests();
            // Filter out patients - Access Requests are for staff verification
            const staffOnly = (data || []).filter(req => 
                (req.role || '').toLowerCase() !== 'patient' && 
                (req.role || '').toLowerCase() !== 'user'
            );
            setAllRequests(staffOnly);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (req) => {
        if (!window.confirm(`Are you sure you want to approve ${req.name}?`)) return;
        setActionLoading(true);
        try {
            await adminService.approveRequest(req.id);
            await fetchRequests();
        } catch (error) {
            alert("Failed to approve request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (req) => {
        const reason = prompt(`Enter reason for rejecting ${req.name}:`);
        if (reason === null) return;
        setActionLoading(true);
        try {
            await adminService.rejectRequest(req.id, reason);
            await fetchRequests();
        } catch (error) {
            alert("Failed to reject request");
        } finally {
            setActionLoading(false);
        }
    };

    // Match AccessRequestsActivity.java filter logic
    const filteredRequests = allRequests.filter(req => {
        const status = (req.status || 'PENDING').toUpperCase();
        if (activeTab === 'All') return true;
        if (activeTab === 'Approved') return status === 'ACTIVE' || status === 'APPROVED';
        if (activeTab === 'Rejected') return status === 'REJECTED';
        return false;
    });

    const counts = {
        All: allRequests.length,
        Approved: allRequests.filter(r => ['ACTIVE', 'APPROVED'].includes((r.status || '').toUpperCase())).length,
        Rejected: allRequests.filter(r => (r.status || '').toUpperCase() === 'REJECTED').length,
    };

    const tabs = [
        { id: 'All', count: counts.All },
        { id: 'Approved', count: counts.Approved },
        { id: 'Rejected', count: counts.Rejected }
    ];

    return (
        <DashboardLayout 
            title="Access Requests" 
            subtitle="Manage staff access and verification approvals."
        >
            {/* Tabbed Navigation - Matching Mobile Style */}
            <div style={{ 
                display: 'flex', gap: '12px', marginBottom: '32px', 
                backgroundColor: '#F8FAFC', padding: '8px', borderRadius: '20px',
                border: '1px solid #E2E8F0'
            }}>
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={actionLoading}
                        style={{
                            flex: 1, padding: '14px 0', borderRadius: '14px', border: 'none',
                            fontSize: '14px', fontWeight: '800', cursor: actionLoading ? 'not-allowed' : 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: activeTab === tab.id ? '#00E3D3' : 'transparent',
                            color: activeTab === tab.id ? '#000' : '#64748B',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0, 227, 211, 0.3)' : 'none'
                        }}
                    >
                        {tab.id}
                        {tab.count > 0 && (
                            <span style={{ 
                                backgroundColor: activeTab === tab.id ? 'rgba(0,0,0,0.1)' : '#E2E8F0', 
                                padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '900',
                                color: activeTab === tab.id ? '#000' : '#475569',
                                transition: 'all 0.3s'
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #00E3D3', borderRadius: '50%', width: '48px', height: '48px', animation: 'spin 1s linear infinite', margin: '0 auto 24px auto' }} />
                        <p style={{ color: '#94A3B8', fontSize: '16px', fontWeight: '700', letterSpacing: '0.05em' }}>FETCHING REQUESTS...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px 0', backgroundColor: '#fff', borderRadius: '32px', border: '2px dashed #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📁</div>
                        <h3 style={{ color: '#1E293B', fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>No {activeTab.toLowerCase()} requests</h3>
                        <p style={{ color: '#64748B', fontSize: '15px', fontWeight: '500' }}>All clear! No pending actions for this category.</p>
                    </div>
                ) : (
                    filteredRequests.map(req => (
                        <RequestRow 
                            key={req.id}
                            id={req.id}
                            name={req.name || req.full_name || 'Staff User'}
                            role={req.role}
                            time={req.formatted_date || 'Just now'}
                            department={req.department}
                            status={req.status}
                            data={req}
                            variant="list"
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    ))
                )}
            </div>

            {activeTab === 'Approved' && allRequests.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <button 
                        onClick={() => navigate('/manage-doctors')}
                        style={{ background: 'none', border: 'none', color: '#00E3D3', fontWeight: '800', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', transition: 'all 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.gap = '14px'}
                        onMouseOut={e => e.currentTarget.style.gap = '10px'}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 18 6-6 6 6"/><path d="m6 12 6-6 6 6"/></svg>
                        View all registered staff records
                    </button>
                </div>
            )}
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default AccessRequestsPage;
