import api from './api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
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
};

export default userService;

