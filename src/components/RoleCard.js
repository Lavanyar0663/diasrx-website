import React from 'react';
import '../styles/components.css';

const RoleCard = ({ label, icon, active, onClick }) => {
    return (
        <div className={`role-card ${active ? 'active' : ''}`} onClick={onClick}>
            <div className="role-icon">
                {icon}
            </div>
            <span className="role-label">{label}</span>
        </div>
    );
};

export default RoleCard;
