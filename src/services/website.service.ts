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

// Objective
export interface Objective {
  id: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Govt Projects
export interface GovtProjects {
  id: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// How To Implement
export interface HowToImplement {
  id: string;
  pdf_file?: string;
  link?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User Manual
export interface UserManual {
  id: string;
  title?: string;
  text_tutorial_file?: string;
  video_tutorial_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Vision Mission
export interface VisionMission {
  id: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Our Team
export interface OurTeam {
  id: string;
  description: string;
  photos: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


// Complaint Submission (User-submitted)
export interface ComplaintSubmission {
  id: string;
  header: string;
  description: string;
  image?: string;
  submitted_by?: string;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

// Social Sites Links
export interface SocialSitesLink {
  id: string;
  youtube?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Contact Us
export interface ContactUs {
  id: string;
  address?: string;
  email?: string;
  whatsapp_number?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class WebsiteService {
  // File Upload (images only)
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  }

  // Document Upload (all file types)
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/document', formData, {
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

  async getStatisticsPageData(): Promise<Array<{
    activity_id: number;
    activity_name: string;
    student_count: number;
    school_count: number;
  }>> {
    const response = await api.get('/website/public/statistics');
    return response.data;
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

  // ==================== Objective ====================
  async getObjectives(): Promise<Objective[]> {
    const response = await api.get('/website/objectives');
    return response.data.data;
  }

  async createObjective(data: Partial<Objective>): Promise<Objective> {
    const response = await api.post('/website/objectives', data);
    return response.data.data;
  }

  async updateObjective(id: string, data: Partial<Objective>): Promise<Objective> {
    const response = await api.put(`/website/objectives/${id}`, data);
    return response.data.data;
  }

  async deleteObjective(id: string): Promise<void> {
    await api.delete(`/website/objectives/${id}`);
  }

  // ==================== Govt Projects ====================
  async getGovtProjects(): Promise<GovtProjects[]> {
    const response = await api.get('/website/govt-projects');
    return response.data.data;
  }

  async createGovtProjects(data: Partial<GovtProjects>): Promise<GovtProjects> {
    const response = await api.post('/website/govt-projects', data);
    return response.data.data;
  }

  async updateGovtProjects(id: string, data: Partial<GovtProjects>): Promise<GovtProjects> {
    const response = await api.put(`/website/govt-projects/${id}`, data);
    return response.data.data;
  }

  async deleteGovtProjects(id: string): Promise<void> {
    await api.delete(`/website/govt-projects/${id}`);
  }

  // ==================== How To Implement ====================
  async getHowToImplement(): Promise<HowToImplement[]> {
    const response = await api.get('/website/how-to-implement');
    return response.data.data;
  }

  async createHowToImplement(data: Partial<HowToImplement>): Promise<HowToImplement> {
    const response = await api.post('/website/how-to-implement', data);
    return response.data.data;
  }

  async updateHowToImplement(id: string, data: Partial<HowToImplement>): Promise<HowToImplement> {
    const response = await api.put(`/website/how-to-implement/${id}`, data);
    return response.data.data;
  }

  async deleteHowToImplement(id: string): Promise<void> {
    await api.delete(`/website/how-to-implement/${id}`);
  }

  // ==================== User Manual ====================
  async getUserManuals(): Promise<UserManual[]> {
    const response = await api.get('/website/user-manuals');
    return response.data.data;
  }

  async createUserManual(data: Partial<UserManual>): Promise<UserManual> {
    const response = await api.post('/website/user-manuals', data);
    return response.data.data;
  }

  async updateUserManual(id: string, data: Partial<UserManual>): Promise<UserManual> {
    const response = await api.put(`/website/user-manuals/${id}`, data);
    return response.data.data;
  }

  async deleteUserManual(id: string): Promise<void> {
    await api.delete(`/website/user-manuals/${id}`);
  }

  // ==================== Vision Mission ====================
  async getVisionMission(): Promise<VisionMission[]> {
    const response = await api.get('/website/vision-mission');
    return response.data.data;
  }

  async createVisionMission(data: Partial<VisionMission>): Promise<VisionMission> {
    const response = await api.post('/website/vision-mission', data);
    return response.data.data;
  }

  async updateVisionMission(id: string, data: Partial<VisionMission>): Promise<VisionMission> {
    const response = await api.put(`/website/vision-mission/${id}`, data);
    return response.data.data;
  }

  async deleteVisionMission(id: string): Promise<void> {
    await api.delete(`/website/vision-mission/${id}`);
  }

  // ==================== Our Team ====================
  async getOurTeam(): Promise<OurTeam[]> {
    const response = await api.get('/website/our-team');
    return response.data.data;
  }

  async createOurTeam(data: Partial<OurTeam>): Promise<OurTeam> {
    const response = await api.post('/website/our-team', data);
    return response.data.data;
  }

  async updateOurTeam(id: string, data: Partial<OurTeam>): Promise<OurTeam> {
    const response = await api.put(`/website/our-team/${id}`, data);
    return response.data.data;
  }

  async deleteOurTeam(id: string): Promise<void> {
    await api.delete(`/website/our-team/${id}`);
  }


  // ==================== Complaint Submissions ====================
  async getComplaintSubmissions(): Promise<ComplaintSubmission[]> {
    const response = await api.get('/website/complaint-submissions');
    return response.data.data;
  }

  async updateComplaintSubmission(id: string, data: Partial<ComplaintSubmission>): Promise<ComplaintSubmission> {
    const response = await api.put(`/website/complaint-submissions/${id}`, data);
    return response.data.data;
  }

  async deleteComplaintSubmission(id: string): Promise<void> {
    await api.delete(`/website/complaint-submissions/${id}`);
  }

  // ==================== Social Sites Links ====================
  async getSocialSitesLinks(): Promise<SocialSitesLink[]> {
    const response = await api.get('/website/social-sites-links');
    return response.data.data;
  }

  async createSocialSitesLink(data: Partial<SocialSitesLink>): Promise<SocialSitesLink> {
    const response = await api.post('/website/social-sites-links', data);
    return response.data.data;
  }

  async updateSocialSitesLink(id: string, data: Partial<SocialSitesLink>): Promise<SocialSitesLink> {
    const response = await api.put(`/website/social-sites-links/${id}`, data);
    return response.data.data;
  }

  async deleteSocialSitesLink(id: string): Promise<void> {
    await api.delete(`/website/social-sites-links/${id}`);
  }

  // ==================== Contact Us ====================
  async getContactUs(): Promise<ContactUs[]> {
    const response = await api.get('/website/contact-us');
    return response.data.data;
  }

  async createContactUs(data: Partial<ContactUs>): Promise<ContactUs> {
    const response = await api.post('/website/contact-us', data);
    return response.data.data;
  }

  async updateContactUs(id: string, data: Partial<ContactUs>): Promise<ContactUs> {
    const response = await api.put(`/website/contact-us/${id}`, data);
    return response.data.data;
  }

  async deleteContactUs(id: string): Promise<void> {
    await api.delete(`/website/contact-us/${id}`);
  }
}

export const websiteService = new WebsiteService();
export default websiteService;
