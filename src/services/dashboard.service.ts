import api from './api';

export interface DashboardStats {
  admin_users_online: number;
  students_on_android: number;
  students_on_ios: number;
  total_students_live: number;
  android_downloads: number;
  ios_downloads: number;
  total_downloads: number;
  total_invoices: number;
  total_admin_users: number;
  total_students: number;
}

export interface DownloadStats {
  android: number;
  ios: number;
  total: number;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  }

  async getDownloadStats(startDate?: string, endDate?: string): Promise<DownloadStats> {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get('/dashboard/download-stats', { params });
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;

