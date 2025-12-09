import api from './api';

export interface Student {
  id: number;
  app_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  activity_type: string;
  points: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  activity_id: number;
  activity: Activity;
  task_number: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type EvaluationStatus = 
  | 'submitted_for_evaluation'
  | 'under_review'
  | 'evaluated'
  | 'rejected';

export interface Submission {
  id: number;
  student_id: number;
  student: Student;
  task_id: number;
  task: Task;
  evaluation_status: EvaluationStatus;
  submitted_at: string;
  evaluated_at: string | null;
  evaluator_id: string | null;
  score: number | null;
  remarks: string | null;
  submission_data: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionStats {
  total: number;
  submitted_for_evaluation: number;
  under_review: number;
  evaluated: number;
  rejected: number;
}

// Activity Service
export const activityService = {
  async getAll(search?: string): Promise<Activity[]> {
    const params = search ? { search } : {};
    const response = await api.get('/activities', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Activity> {
    const response = await api.get(`/activities/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Activity>): Promise<Activity> {
    const response = await api.post('/activities', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<Activity>): Promise<Activity> {
    const response = await api.put(`/activities/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/activities/${id}`);
  },
};

// Task Service
export const taskService = {
  async getAll(activityId?: number): Promise<Task[]> {
    const params = activityId ? { activity_id: activityId } : {};
    const response = await api.get('/tasks', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Task>): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

// Student Service
export const studentService = {
  async getAll(search?: string): Promise<Student[]> {
    const params = search ? { search } : {};
    const response = await api.get('/students', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },

  async create(data: Partial<Student>): Promise<Student> {
    const response = await api.post('/students', data);
    return response.data.data;
  },

  async update(id: number, data: Partial<Student>): Promise<Student> {
    const response = await api.put(`/students/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};

// Submission Service
export const submissionService = {
  async getAll(taskId?: number, search?: string): Promise<Submission[]> {
    const params: Record<string, string | number> = {};
    if (taskId) params.task_id = taskId;
    if (search) params.search = search;
    const response = await api.get('/submissions', { params });
    return response.data.data;
  },

  async getByTask(taskId: number, search?: string): Promise<Submission[]> {
    const params = search ? { search } : {};
    const response = await api.get(`/submissions/task/${taskId}`, { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Submission> {
    const response = await api.get(`/submissions/${id}`);
    return response.data.data;
  },

  async create(data: { student_id: number; task_id: number; submission_data?: string }): Promise<Submission> {
    const response = await api.post('/submissions', data);
    return response.data.data;
  },

  async evaluate(
    id: number,
    data: { evaluation_status: EvaluationStatus; score?: number; remarks?: string }
  ): Promise<Submission> {
    const response = await api.patch(`/submissions/${id}/evaluate`, data);
    return response.data.data;
  },

  async getStats(taskId: number): Promise<SubmissionStats> {
    const response = await api.get(`/submissions/task/${taskId}/stats`);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/submissions/${id}`);
  },
};

