import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RequestStatusPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isApproved = location.pathname === '/request-approved';

    const statusData = isApproved ? {
        title: 'Access Approved',
        message: 'Ph. John Doe has been successfully added to the system. They will receive a notification to log in.',
        type: 'success',
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    } : {
        title: 'Request Rejected',
        message: 'The access request for Ph. John Doe has been declined. You can still find this in the rejected logs if needed.',
        type: 'error',
        icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    };

    return (
        <div className="status-screen-container">
            <div className={`status-icon-circle ${statusData.type}`}>
                {statusData.icon}
            </div>
            
            <h1 className="status-title">{statusData.title}</h1>
            <p className="status-message">{statusData.message}</p>

            <div style={{ width: '40px', height: '2px', backgroundColor: '#E5E7EB', margin: '0 auto' }}></div>

            <button 
                className="btn-back-dashboard"
                onClick={() => navigate('/admin-dashboard')}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default RequestStatusPage;
