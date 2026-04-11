import api from './api';

export const prescriptionService = {
    // Create new full prescription
    createPrescription: async (data) => {
        const response = await api.post('/prescriptions/full', data);
        return response.data;
    },

    // Dispense prescription
    dispensePrescription: async (id, items = [], idempotencyKey = null) => {
        const config = {};
        if (idempotencyKey) {
            config.headers = { 'Idempotency-Key': idempotencyKey };
        }
        const response = await api.patch(`/prescriptions/${id}/dispense`, { items }, config);
        return response.data;
    },

    // Get pending prescriptions
    getPendingPrescriptions: async () => {
        const response = await api.get('/prescriptions/pending');
        return response.data;
    },

    // Get historical prescriptions
    getPrescriptionHistory: async () => {
        const response = await api.get('/prescriptions/history');
        return response.data;
    },

    // Get stats for pharmacist dashboard
    getPharmacistStats: async () => {
        const response = await api.get('/prescriptions/stats');
        return response.data;
    },

    // Get plain-language AI explanation
    getExplanation: async (id) => {
        const response = await api.get(`/prescriptions/${id}/explained`);
        return response.data;
    },

    // Optional: Fetch prescriptions specific to a patient or doctor
    getPrescriptionsByPatient: async (patientId) => {
        const response = await api.get(`/prescriptions/patient/${patientId}`);
        return response.data;
    },

    getPrescriptionsByDoctor: async (doctorId) => {
        const response = await api.get(`/prescriptions/doctor/${doctorId}`);
        return response.data;
    },

    getPrescriptionById: async (id) => {
        const response = await api.get(`/prescriptions/${id}`);
        return response.data;
    },

    // Generate PDF document on server
    generatePDF: async (id) => {
        const response = await api.post(`/documents/prescription/${id}/generate`);
        return response.data;
    },

    // Fetch PDF document as a Blob
    getPDF: async (id) => {
        const response = await api.get(`/documents/prescription/${id}`, { responseType: 'blob' });
        return response.data;
    }
};
