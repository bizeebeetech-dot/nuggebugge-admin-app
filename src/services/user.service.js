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
    async resetPassword(id, newPassword) {
        const response = await api.put(`/users/${id}`, { password: newPassword });
        return response.data.data;
    },
    async toggleEnabled(id, is_enabled) {
        const response = await api.put(`/users/${id}`, { is_enabled });
        return response.data.data;
    },
    async deactivateUser(id) {
        const response = await api.put(`/users/${id}`, { is_deactivated: true, is_active: false });
        return response.data.data;
    },
    async activateUser(id) {
        const response = await api.put(`/users/${id}`, { is_deactivated: false, is_active: true });
        return response.data.data;
    },
};
export default userService;
