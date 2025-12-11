import api from './api';
class SchoolService {
    async getAll(search) {
        const params = search ? { search } : {};
        const response = await api.get('/schools', { params });
        return response.data.data;
    }
    async getById(id) {
        const response = await api.get(`/schools/${id}`);
        return response.data.data;
    }
    async create(data) {
        const response = await api.post('/schools', data);
        return response.data.data;
    }
    async update(id, data) {
        const response = await api.put(`/schools/${id}`, data);
        return response.data.data;
    }
    async delete(id) {
        await api.delete(`/schools/${id}`);
    }
    async getDropdowns() {
        const response = await api.get('/schools/dropdowns');
        return response.data.data;
    }
}
export const schoolService = new SchoolService();
export default schoolService;
