import React from 'react';
import AuthLayout from '../components/AuthLayout';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
        <AuthLayout>
            <div style={{ textAlign: 'left', width: '100%' }}>
                <LoginForm />
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
