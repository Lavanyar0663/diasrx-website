import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import RequestRow from '../components/RequestRow';
import DashboardLayout from '../components/DashboardLayout';
import { adminService } from '../services/adminService';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        pending: 0,
        pharmacists: 0
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, requestsData] = await Promise.all([
                adminService.getAdminStats(),
                adminService.getAllRequests()
            ]);
            setStats(statsData || { doctors: 0, patients: 0, pending: 0, pharmacists: 0 });
            
            const staffOnly = (requestsData || []).filter(req => 
                (req.role || '').toLowerCase() !== 'patient' && 
                (req.role || '').toLowerCase() !== 'admin'
            );
            
            // Strictly show only PENDING requests in the Dashboard Recent section
            const pendingRequests = staffOnly.filter(r => (r.status || 'PENDING').toUpperCase() === 'PENDING');
            setRequests(pendingRequests.slice(0, 3));
        } catch (err) {
            console.error("Admin dashboard fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApprove = async (req) => {
        if (!window.confirm(`Are you sure you want to approve ${req.name}?`)) return;
        setActionLoading(true);
        try {
            await adminService.approveRequest(req.id);
            await fetchDashboardData();
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
            await fetchDashboardData();
        } catch (error) {
            alert("Failed to reject request");
        } finally {
            setActionLoading(false);
        }
    };

    const statsList = [
        { 
            label: 'Manage Doctors', 
            count: stats.doctors, 
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            )
        },
        { 
            label: 'Manage Pharmacists', 
            count: stats.pharmacists, 
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
            )
        },
        { 
            label: 'Manage Patients', 
            count: stats.patients, 
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M9 21v-2a4 4 0 0 1 3-3.87" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        }
    ];

    return (
        <DashboardLayout 
            title="Admin Dashboard" 
            subtitle="Welcome back, here is your summary."
        >
            <div style={{ paddingBottom: '60px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {/* Management Cards Grid */}
                    <div className="dashboard-grid">
                        {statsList.map((stat, idx) => (
                            <DashboardCard 
                                key={idx}
                                label={stat.label}
                                count={stat.count}
                                icon={stat.icon}
                                onClick={() => {
                                    if (stat.label.includes('Doctor')) navigate('/manage-doctors');
                                    else if (stat.label.includes('Pharmacist')) navigate('/manage-pharmacists');
                                    else navigate('/manage-patients');
                                }}
                            />
                        ))}
                    </div>

                    {/* Recent Requests Section */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '4px', height: '24px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Recent Access Requests</h2>
                            </div>
                            <button 
                                onClick={() => navigate('/access-requests')}
                                style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: '800', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                View All
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                            </button>
                        </div>
                        <div className="request-list">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #F3F4F6' }}>
                                    <div className="spinner" style={{ border: '3px solid #f3f3f3', borderTop: '3px solid #3B82F6', borderRadius: '50%', width: '32px', height: '32px', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }} />
                                    <p style={{ color: '#9CA3AF', fontSize: '14px', fontWeight: '700' }}>LOADING REQUESTS...</p>
                                </div>
                            ) : requests.length > 0 ? (
                                requests.map(req => (
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
                            ) : (
                                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
                                    <h3 style={{ color: '#111827', fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>All Caught Up!</h3>
                                    <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>No pending staff access requests found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
