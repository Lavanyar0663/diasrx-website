import React, { useRef, useState, useEffect } from 'react';
import '../styles/components.css';

const OTPInput = ({ length = 6, onComplete, autoFillValue }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputs = useRef([]);

    useEffect(() => {
        if (autoFillValue && autoFillValue.length === length) {
            setOtp(autoFillValue);
            onComplete && onComplete(autoFillValue.join(""));
        }
    }, [autoFillValue, length, onComplete]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < length - 1) {
            inputs.current[index + 1].focus();
        }

        if (newOtp.join("").length === length) {
            onComplete && onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <div className="otp-container">
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-box"
                    value={data}
                    ref={(el) => (inputs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
};

export default OTPInput;
