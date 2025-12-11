export interface UploadResponse {
    url: string;
    filename: string;
    originalName: string;
    size: number;
}
export interface HomePageContent {
    id: string;
    cover_photos: string[];
    text_content: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface ActivityItem {
    id: string;
    title: string;
    description: string;
    photo_urls: string[];
    activity_date?: string;
    location?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface AboutUsPageContent {
    id: string;
    text_content: string;
    team_photos: string[];
    organization_name?: string;
    address?: string;
    email?: string;
    phone?: string;
    alternate_phone?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface StatisticsPageContent {
    id: string;
    text_content: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface AppFeedback {
    id: string;
    user_name?: string;
    user_email?: string;
    feedback_text: string;
    rating?: number;
    is_approved: boolean;
    is_featured: boolean;
    source?: string;
    created_at: string;
    updated_at: string;
}
declare class WebsiteService {
    uploadFile(file: File): Promise<UploadResponse>;
    uploadMultipleFiles(files: File[]): Promise<UploadResponse[]>;
    getHomePageContent(): Promise<HomePageContent[]>;
    createHomePageContent(data: Partial<HomePageContent>): Promise<HomePageContent>;
    updateHomePageContent(id: string, data: Partial<HomePageContent>): Promise<HomePageContent>;
    deleteHomePageContent(id: string): Promise<void>;
    getActivityItems(): Promise<ActivityItem[]>;
    createActivityItem(data: Partial<ActivityItem>): Promise<ActivityItem>;
    updateActivityItem(id: string, data: Partial<ActivityItem>): Promise<ActivityItem>;
    deleteActivityItem(id: string): Promise<void>;
    getAboutUsPageContent(): Promise<AboutUsPageContent[]>;
    createAboutUsPageContent(data: Partial<AboutUsPageContent>): Promise<AboutUsPageContent>;
    updateAboutUsPageContent(id: string, data: Partial<AboutUsPageContent>): Promise<AboutUsPageContent>;
    deleteAboutUsPageContent(id: string): Promise<void>;
    getStatisticsPageContent(): Promise<StatisticsPageContent[]>;
    createStatisticsPageContent(data: Partial<StatisticsPageContent>): Promise<StatisticsPageContent>;
    updateStatisticsPageContent(id: string, data: Partial<StatisticsPageContent>): Promise<StatisticsPageContent>;
    deleteStatisticsPageContent(id: string): Promise<void>;
    getAllFeedbacks(): Promise<AppFeedback[]>;
    updateFeedback(id: string, data: Partial<AppFeedback>): Promise<AppFeedback>;
    deleteFeedback(id: string): Promise<void>;
}
export declare const websiteService: WebsiteService;
export default websiteService;
