import React, { useEffect, useState } from 'react';
import '../styles/components.css';

const Toast = ({ message, duration = 3000, onFadeOut }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onFadeOut && onFadeOut();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onFadeOut]);

    if (!visible) return null;

    return (
        <div className="toast-container">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
