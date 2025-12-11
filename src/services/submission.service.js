import api from './api';
// Activity Service
export const activityService = {
    async getAll(search) {
        const params = search ? { search } : {};
        const response = await api.get('/activities', { params });
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/activities/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/activities', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/activities/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/activities/${id}`);
    },
};
// Task Service
export const taskService = {
    async getAll(activityId) {
        const params = activityId ? { activity_id: activityId } : {};
        const response = await api.get('/tasks', { params });
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/tasks', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/tasks/${id}`);
    },
};
// Student Service
export const studentService = {
    async getAll(search) {
        const params = search ? { search } : {};
        const response = await api.get('/students', { params });
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/students/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/students', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/students/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/students/${id}`);
    },
};
// Submission Service
export const submissionService = {
    async getAll(taskId, search) {
        const params = {};
        if (taskId)
            params.task_id = taskId;
        if (search)
            params.search = search;
        const response = await api.get('/submissions', { params });
        return response.data.data;
    },
    async getByTask(taskId, search) {
        const params = search ? { search } : {};
        const response = await api.get(`/submissions/task/${taskId}`, { params });
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/submissions/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/submissions', data);
        return response.data.data;
    },
    async evaluate(id, data) {
        const response = await api.patch(`/submissions/${id}/evaluate`, data);
        return response.data.data;
    },
    async getStats(taskId) {
        const response = await api.get(`/submissions/task/${taskId}/stats`);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/submissions/${id}`);
    },
};
