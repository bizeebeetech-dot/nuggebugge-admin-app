import api from './api';

export interface Activity {
  id: number;
  title: string;
  summary: string;
  price: number;
  name?: string;
  activity_type?: string;
  points?: number;
  description?: string;
  is_active: boolean;
  activityTasks?: ActivityTask[];
  created_at: string;
  updated_at: string;
}

export interface ActivityTask {
  id: number;
  activity_id: number;
  day_range: string;
  day?: number;
  title: string;
  instruction: string;
  video_manual: string;
  text_question_1: string;
  text_question_2: string;
  photo_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const DAY_RANGES = [
  'Day: 1-5',
  'Day: 6-10',
  'Day: 11-15',
  'Day: 16-20',
  'Day: 21-25',
  'Day: 26-30',
];

class ActivityService {
  async getAll(search?: string): Promise<Activity[]> {
    const params = search ? { search } : {};
    const response = await api.get('/activities', { params });
    return response.data.data;
  }

  async getById(id: number): Promise<Activity> {
    const response = await api.get(`/activities/${id}`);
    return response.data.data;
  }

  async create(data: Partial<Activity>): Promise<Activity> {
    const response = await api.post('/activities', data);
    return response.data.data;
  }

  async update(id: number, data: Partial<Activity>): Promise<Activity> {
    const response = await api.put(`/activities/${id}`, data);
    return response.data.data;
  }

  async toggleActive(id: number): Promise<Activity> {
    const response = await api.patch(`/activities/${id}/toggle-active`);
    return response.data.data;
  }

  // Activity Tasks
  async getTasks(activityId: number, day?: number): Promise<ActivityTask[]> {
    const params = day !== undefined ? { day } : {};
    const response = await api.get(`/activities/${activityId}/tasks`, { params });
    return response.data.data;
  }

  async createTask(activityId: number, data: Partial<ActivityTask>): Promise<ActivityTask> {
    const response = await api.post(`/activities/${activityId}/tasks`, data);
    return response.data.data;
  }

  async updateTask(taskId: number, data: Partial<ActivityTask>): Promise<ActivityTask> {
    const response = await api.put(`/activities/tasks/${taskId}`, data);
    return response.data.data;
  }

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/activities/tasks/${taskId}`);
  }

  // File upload
  async uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.url;
  }
}

export const activityService = new ActivityService();
export default activityService;

