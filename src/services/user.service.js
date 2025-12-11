import api from './api';
export const userService = {
    async getAll(search) {
        const params = search ? { search } : {};
        const response = await api.get('/users', { params });
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/users/register', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/users/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/users/${id}`);
    },
};
export default userService;
