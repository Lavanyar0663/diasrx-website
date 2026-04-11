import api from './api';

export const authService = {
    // Login to backend
    login: async (email, password, role) => {
        try {
            const response = await api.post('/auth/login', { email, password, role });
            
            if (response.data && response.data.token) {
                // Save token, user details, and settings on successful login
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                if (response.data.settings) {
                    localStorage.setItem('settings', JSON.stringify(response.data.settings));
                }
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserSettings: async () => {
        const response = await api.get('/auth/user-settings');
        if (response.data && response.data.settings) {
            localStorage.setItem('settings', JSON.stringify(response.data.settings));
        }
        return response.data;
    },

    updateUserSettings: async (settings) => {
        const response = await api.post('/auth/update-user-settings', settings);
        if (response.data) {
            // Merge updated settings into localStorage
            const current = JSON.parse(localStorage.getItem('settings') || '{}');
            localStorage.setItem('settings', JSON.stringify({ ...current, ...settings }));
        }
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await api.post('/auth/verify-otp', { email, otp });
        return response.data;
    },

    resetPassword: async (email, otp, newPassword) => {
        const response = await api.post('/auth/reset-password', { email, otp, newPassword });
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    requestAccess: async (userData) => {
        const response = await api.post('/auth/request-access', userData);
        return response.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await api.patch('/auth/change-password', { currentPassword, newPassword });
        return response.data;
    },

    // Logout and purge storage
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('settings');
    },

    // Get current user object from localStorage
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr);
            return null;
        } catch (e) {
            return null;
        }
    },

    getSettings: () => {
        try {
            const settingsStr = localStorage.getItem('settings');
            if (settingsStr) return JSON.parse(settingsStr);
            return null;
        } catch (e) {
            return null;
        }
    },

    updateProfile: async (userData) => {
        const response = await api.patch('/auth/profile', userData);
        if (response.data && response.data.user) {
            // Merge updated profile into localStorage
            const current = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...current, ...response.data.user }));
        }
        return response.data;
    }
};
