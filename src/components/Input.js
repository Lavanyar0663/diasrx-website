import React from 'react';
import '../styles/components.css';

const Input = ({ label, name, type = 'text', placeholder, value, onChange, onKeyDown, icon, rightIcon, onRightIconClick }) => {
    return (
        <div className="input-group">
            {icon && <div className="input-icon-left">{icon}</div>}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="input-field"
                style={{
                    paddingLeft: icon ? '56px' : '24px',
                    paddingRight: rightIcon ? '56px' : '24px'
                }}
            />
            {rightIcon && (
                <div 
                    className="input-icon-right"
                    onClick={onRightIconClick}
                >
                    {rightIcon}
                </div>
            )}
        </div>
    );
};

export default Input;
