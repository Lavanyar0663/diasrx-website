import api from './api';

export const patientService = {
    // Get list of patients
    getPatients: async () => {
        const response = await api.get('/patients');
        return response.data;
    },

    // Add a new patient
    addPatient: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },

    assignDoctor: async (patientId, doctorId) => {
        const response = await api.patch(`/patients/${patientId}/assign`, { doctorId });
        return response.data;
    },

    getPatientById: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    // Get doctor-specific dashboard stats
    getDoctorStats: async () => {
        const response = await api.get('/patients/stats');
        return response.data;
    },

    // Get doctor-specific dashboard load info
    getDoctorDashboardInfo: async () => {
        const response = await api.get('/patients/dashboard-info');
        return response.data;
    }
};
