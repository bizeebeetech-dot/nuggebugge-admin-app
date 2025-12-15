import api from './api';

export interface Student {
  id: number;
  app_code: string;
  name: string;
  gender?: string;
  state_id?: string;
  state_name?: string;
  board_id?: string;
  board_name?: string;
  school_id?: string;
  school_name?: string;
  class_id?: string;
  class_name?: string;
  section?: string;
  email: string;
  phone?: string;
  terms_accepted: boolean;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentResponse {
  success: boolean;
  data: Student[];
  count: number;
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
  message?: string;
}

export const studentService = {
  async getAll(search?: string): Promise<Student[]> {
    const params = search ? { search } : {};
    const response = await api.get<StudentResponse>('/students', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get<SingleStudentResponse>(`/students/${id}`);
    return response.data.data;
  },

  async update(id: number, data: Partial<Student>): Promise<Student> {
    const response = await api.put<SingleStudentResponse>(`/students/${id}`, data);
    return response.data.data;
  },

  async toggleActive(id: number): Promise<Student> {
    const response = await api.patch<SingleStudentResponse>(`/students/${id}/toggle-active`);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },

  async resetPassword(id: number, newPassword: string): Promise<void> {
    await api.patch(`/students/${id}/reset-password`, { new_password: newPassword });
  },
};

export default studentService;

