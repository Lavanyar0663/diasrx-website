import api from './api';

export const doctorService = {
    // Get all doctors list
    getDoctors: async () => {
        const response = await api.get('/doctors');
        return response.data;
    },

    // Get logged-in doctor's full profile
    getProfile: async () => {
        const response = await api.get('/doctors/profile');
        return response.data;
    },

    // Update doctor profile
    updateProfile: async (profileData) => {
        const response = await api.patch('/doctors/profile', profileData);
        return response.data;
    },

    // Get dashboard stats (pending/dispensed counts, total patients)
    getStats: async () => {
        const response = await api.get('/doctors/stats');
        return response.data;
    },

    // Get dashboard info (doctor name, department, OPD load for today)
    getDashboardInfo: async () => {
        const response = await api.get('/doctors/dashboard-info');
        return response.data;
    }
};
