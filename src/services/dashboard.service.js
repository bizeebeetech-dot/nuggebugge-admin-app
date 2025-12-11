import api from './api';
class DashboardService {
    async getStats() {
        const response = await api.get('/dashboard/stats');
        return response.data.data;
    }
    async getDownloadStats(startDate, endDate) {
        const params = {};
        if (startDate)
            params.start_date = startDate;
        if (endDate)
            params.end_date = endDate;
        const response = await api.get('/dashboard/download-stats', { params });
        return response.data.data;
    }
}
export const dashboardService = new DashboardService();
export default dashboardService;
