import api from './api';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  designation?: string;
  employee_id?: string;
  email: string;
  username?: string;
  role: string;
  is_enabled: boolean;
  is_deactivated: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  designation?: string;
  employee_id?: string;
  email: string;
  username?: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  designation?: string;
  employee_id?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: string;
  is_enabled?: boolean;
  is_deactivated?: boolean;
  is_active?: boolean;
}

export const userService = {
  async getAll(search?: string): Promise<User[]> {
    const params = search ? { search } : {};
    const response = await api.get('/users', { params });
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post('/users/register', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async resetPassword(id: string, newPassword: string): Promise<User> {
    const response = await api.put(`/users/${id}`, { password: newPassword });
    return response.data.data;
  },

  async toggleEnabled(id: string, is_enabled: boolean): Promise<User> {
    const response = await api.put(`/users/${id}`, { is_enabled });
    return response.data.data;
  },

  async deactivateUser(id: string): Promise<User> {
    const response = await api.put(`/users/${id}`, { is_deactivated: true, is_active: false });
    return response.data.data;
  },

  async activateUser(id: string): Promise<User> {
    const response = await api.put(`/users/${id}`, { is_deactivated: false, is_active: true });
    return response.data.data;
  },
};

export default userService;
