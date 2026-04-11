import axios from 'axios';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://180.235.121.253:8167/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized globally if desired
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access. Token may be expired.');
        }
        return Promise.reject(error);
    }
);

export default api;
