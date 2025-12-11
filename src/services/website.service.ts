import api from './api';

// Upload Response Type
export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
}

// Page 1: Home Page Content
export interface HomePageContent {
  id: string;
  cover_photos: string[];
  text_content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Page 2: Activity Item
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

// Page 3: About Us Page Content
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

// Page 4: Statistics Page Content
export interface StatisticsPageContent {
  id: string;
  text_content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// App Feedback
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

class WebsiteService {
  // File Upload
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  async uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const response = await api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // ==================== Page 1: Home Page ====================
  async getHomePageContent(): Promise<HomePageContent[]> {
    const response = await api.get('/website/home-page');
    return response.data.data;
  }

  async createHomePageContent(data: Partial<HomePageContent>): Promise<HomePageContent> {
    const response = await api.post('/website/home-page', data);
    return response.data.data;
  }

  async updateHomePageContent(id: string, data: Partial<HomePageContent>): Promise<HomePageContent> {
    const response = await api.put(`/website/home-page/${id}`, data);
    return response.data.data;
  }

  async deleteHomePageContent(id: string): Promise<void> {
    await api.delete(`/website/home-page/${id}`);
  }

  // ==================== Page 2: Activities ====================
  async getActivityItems(): Promise<ActivityItem[]> {
    const response = await api.get('/website/activity-items');
    return response.data.data;
  }

  async createActivityItem(data: Partial<ActivityItem>): Promise<ActivityItem> {
    const response = await api.post('/website/activity-items', data);
    return response.data.data;
  }

  async updateActivityItem(id: string, data: Partial<ActivityItem>): Promise<ActivityItem> {
    const response = await api.put(`/website/activity-items/${id}`, data);
    return response.data.data;
  }

  async deleteActivityItem(id: string): Promise<void> {
    await api.delete(`/website/activity-items/${id}`);
  }

  // ==================== Page 3: About Us ====================
  async getAboutUsPageContent(): Promise<AboutUsPageContent[]> {
    const response = await api.get('/website/about-us-page');
    return response.data.data;
  }

  async createAboutUsPageContent(data: Partial<AboutUsPageContent>): Promise<AboutUsPageContent> {
    const response = await api.post('/website/about-us-page', data);
    return response.data.data;
  }

  async updateAboutUsPageContent(id: string, data: Partial<AboutUsPageContent>): Promise<AboutUsPageContent> {
    const response = await api.put(`/website/about-us-page/${id}`, data);
    return response.data.data;
  }

  async deleteAboutUsPageContent(id: string): Promise<void> {
    await api.delete(`/website/about-us-page/${id}`);
  }

  // ==================== Page 4: Statistics ====================
  async getStatisticsPageContent(): Promise<StatisticsPageContent[]> {
    const response = await api.get('/website/statistics-page');
    return response.data.data;
  }

  async createStatisticsPageContent(data: Partial<StatisticsPageContent>): Promise<StatisticsPageContent> {
    const response = await api.post('/website/statistics-page', data);
    return response.data.data;
  }

  async updateStatisticsPageContent(id: string, data: Partial<StatisticsPageContent>): Promise<StatisticsPageContent> {
    const response = await api.put(`/website/statistics-page/${id}`, data);
    return response.data.data;
  }

  async deleteStatisticsPageContent(id: string): Promise<void> {
    await api.delete(`/website/statistics-page/${id}`);
  }

  // ==================== App Feedback ====================
  async getAllFeedbacks(): Promise<AppFeedback[]> {
    const response = await api.get('/website/feedbacks');
    return response.data.data;
  }

  async updateFeedback(id: string, data: Partial<AppFeedback>): Promise<AppFeedback> {
    const response = await api.put(`/website/feedbacks/${id}`, data);
    return response.data.data;
  }

  async deleteFeedback(id: string): Promise<void> {
    await api.delete(`/website/feedbacks/${id}`);
  }
}

export const websiteService = new WebsiteService();
export default websiteService;
