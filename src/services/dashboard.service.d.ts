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
declare class DashboardService {
    getStats(): Promise<DashboardStats>;
    getDownloadStats(startDate?: string, endDate?: string): Promise<DownloadStats>;
}
export declare const dashboardService: DashboardService;
export default dashboardService;
