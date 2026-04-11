import api from './api';

export const drugService = {
    getAllDrugs: async () => {
        const response = await api.get('/drugs');
        return response.data;
    },

    searchDrugs: async (query) => {
        const response = await api.get('/drugs/search', { params: { name: query } });
        return Array.isArray(response.data) ? response.data : [];
    },

    addDrug: async (drugData) => {
        const response = await api.post('/drugs', drugData);
        return response.data;
    },

    updateDrug: async (id, drugData) => {
        const response = await api.patch(`/drugs/${id}`, drugData);
        return response.data;
    }
};
