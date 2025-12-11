import api from './api';
export const entityLabels = {
    state: 'State',
    district: 'District',
    school_board: 'School Board',
};
export const entityService = {
    async getAll(entityType, search) {
        const params = search ? { search } : {};
        const response = await api.get(`/entities/${entityType}`, { params });
        return response.data.data;
    },
    async getById(entityType, id) {
        const response = await api.get(`/entities/${entityType}/${id}`);
        return response.data.data;
    },
    async create(entityType, data) {
        const response = await api.post(`/entities/${entityType}`, data);
        return response.data.data;
    },
    async update(entityType, id, data) {
        const response = await api.put(`/entities/${entityType}/${id}`, data);
        return response.data.data;
    },
    async toggleActive(entityType, id) {
        const response = await api.patch(`/entities/${entityType}/${id}/toggle`);
        return response.data.data;
    },
    async delete(entityType, id) {
        await api.delete(`/entities/${entityType}/${id}`);
    },
};
export default entityService;
