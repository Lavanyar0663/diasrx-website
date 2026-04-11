import api from './api';

export const adminService = {
    // Get all pending requests
    getPendingRequests: async () => {
        const response = await api.get('/admin/requests');
        return response.data;
    },

    // Get all requests
    getAllRequests: async () => {
        const response = await api.get('/admin/requests/all');
        return response.data;
    },

    // Approve a request
    approveRequest: async (id) => {
        const response = await api.patch(`/admin/requests/${id}/approve`);
        return response.data;
    },

    // Reject a request
    rejectRequest: async (id, reason) => {
        const response = await api.patch(`/admin/requests/${id}/reject`, { reason });
        return response.data;
    },

    // Get dashboard stats
    getAdminStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Get staff lists
    getDoctors: async () => {
        const response = await api.get('/admin/doctors');
        return response.data;
    },

    getPharmacists: async () => {
        const response = await api.get('/admin/pharmacists');
        return response.data;
    },

    // Add new staff members
    registerStaff: async (staffData) => {
        const response = await api.post('/auth/register', staffData);
        return response.data;
    }
};
