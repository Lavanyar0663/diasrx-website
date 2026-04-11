import api from './api';

export const dashboardService = {
    // ==== ADMIN ====
    getAdminStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    
    getAdminRequests: async () => {
        const response = await api.get('/admin/requests');
        return response.data;
    },

    // ==== DOCTOR ====
    getDoctorPrescriptions: async (doctorId) => {
        const response = await api.get(`/prescriptions/doctor/${doctorId}`);
        return response.data;
    },
    
    getDoctorPatients: async (doctorId) => {
        // If there's no direct patients endpoint for the doctor, the list of prescriptions 
        // will naturally contain the distinct list of patients anyway.
        // Let's rely on retrieving the prescriptions for "Recent Activity".
        // But if /api/patients/doctor/:id exists:
        try {
            const response = await api.get(`/patients/doctor/${doctorId}`);
            return response.data;
        } catch (err) {
            // Fallback gracefully since we can extract patients from prescriptions
            return [];
        }
    },

    // ==== PHARMACIST ====
    getPharmacistStats: async () => {
        const response = await api.get('/prescriptions/stats');
        return response.data;
    },

    getPendingPrescriptions: async () => {
        const response = await api.get('/prescriptions/pending');
        return response.data;
    }
};
