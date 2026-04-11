import React from 'react';

const DashboardCard = ({ label, count, icon, onClick }) => {
    return (
        <div className="stat-card" onClick={onClick}>
            <div className="stat-info">
                <h3>{label}</h3>
                <p>{count} Registered</p>
            </div>
            <div className="stat-icon-wrapper">
                {icon}
            </div>
            <div style={{ marginLeft: '12px', color: '#D1D5DB' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                </svg>
            </div>
        </div>
    );
};

export default DashboardCard;
