import React from 'react';
import '../styles/components.css';

const PasswordRequirements = ({ requirements }) => {
    return (
        <div className="requirements-card">
            <h3 className="requirements-title">Password must contain:</h3>
            {requirements.map((req, index) => (
                <div key={index} className={`requirement-item ${req.met ? 'met' : ''}`}>
                    <div className="requirement-check">
                        {req.met && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                    </div>
                    <span>{req.label}</span>
                </div>
            ))}
        </div>
    );
};

export default PasswordRequirements;
