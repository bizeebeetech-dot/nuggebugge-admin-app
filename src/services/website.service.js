import api from './api';
class WebsiteService {
    // File Upload
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    }
    async uploadMultipleFiles(files) {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        const response = await api.post('/upload/multiple', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    }
    // ==================== Page 1: Home Page ====================
    async getHomePageContent() {
        const response = await api.get('/website/home-page');
        return response.data.data;
    }
    async createHomePageContent(data) {
        const response = await api.post('/website/home-page', data);
        return response.data.data;
    }
    async updateHomePageContent(id, data) {
        const response = await api.put(`/website/home-page/${id}`, data);
        return response.data.data;
    }
    async deleteHomePageContent(id) {
        await api.delete(`/website/home-page/${id}`);
    }
    // ==================== Page 2: Activities ====================
    async getActivityItems() {
        const response = await api.get('/website/activity-items');
        return response.data.data;
    }
    async createActivityItem(data) {
        const response = await api.post('/website/activity-items', data);
        return response.data.data;
    }
    async updateActivityItem(id, data) {
        const response = await api.put(`/website/activity-items/${id}`, data);
        return response.data.data;
    }
    async deleteActivityItem(id) {
        await api.delete(`/website/activity-items/${id}`);
    }
    // ==================== Page 3: About Us ====================
    async getAboutUsPageContent() {
        const response = await api.get('/website/about-us-page');
        return response.data.data;
    }
    async createAboutUsPageContent(data) {
        const response = await api.post('/website/about-us-page', data);
        return response.data.data;
    }
    async updateAboutUsPageContent(id, data) {
        const response = await api.put(`/website/about-us-page/${id}`, data);
        return response.data.data;
    }
    async deleteAboutUsPageContent(id) {
        await api.delete(`/website/about-us-page/${id}`);
    }
    // ==================== Page 4: Statistics ====================
    async getStatisticsPageContent() {
        const response = await api.get('/website/statistics-page');
        return response.data.data;
    }
    async createStatisticsPageContent(data) {
        const response = await api.post('/website/statistics-page', data);
        return response.data.data;
    }
    async updateStatisticsPageContent(id, data) {
        const response = await api.put(`/website/statistics-page/${id}`, data);
        return response.data.data;
    }
    async deleteStatisticsPageContent(id) {
        await api.delete(`/website/statistics-page/${id}`);
    }
    // ==================== App Feedback ====================
    async getAllFeedbacks() {
        const response = await api.get('/website/feedbacks');
        return response.data.data;
    }
    async updateFeedback(id, data) {
        const response = await api.put(`/website/feedbacks/${id}`, data);
        return response.data.data;
    }
    async deleteFeedback(id) {
        await api.delete(`/website/feedbacks/${id}`);
    }
}
export const websiteService = new WebsiteService();
export default websiteService;
