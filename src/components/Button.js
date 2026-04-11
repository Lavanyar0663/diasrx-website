import React from 'react';
import '../styles/components.css';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn-primary ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
