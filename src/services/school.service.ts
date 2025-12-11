import api from './api';

export interface School {
  id: string;
  name: string;
  state_id?: string;
  state_name?: string;
  district_id?: string;
  district_name?: string;
  board_id?: string;
  board_name?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolDropdowns {
  states: { id: string; name: string }[];
  districts: { id: string; name: string; state_id?: string }[];
  boards: { id: string; name: string }[];
}

export interface CreateSchoolData {
  name: string;
  state_id?: string;
  district_id?: string;
  board_id?: string;
  address?: string;
}

export interface UpdateSchoolData {
  name?: string;
  state_id?: string;
  district_id?: string;
  board_id?: string;
  address?: string;
  is_active?: boolean;
}

class SchoolService {
  async getAll(search?: string): Promise<School[]> {
    const params = search ? { search } : {};
    const response = await api.get('/schools', { params });
    return response.data.data;
  }

  async getById(id: string): Promise<School> {
    const response = await api.get(`/schools/${id}`);
    return response.data.data;
  }

  async create(data: CreateSchoolData): Promise<School> {
    const response = await api.post('/schools', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateSchoolData): Promise<School> {
    const response = await api.put(`/schools/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/schools/${id}`);
  }

  async getDropdowns(): Promise<SchoolDropdowns> {
    const response = await api.get('/schools/dropdowns');
    return response.data.data;
  }
}

export const schoolService = new SchoolService();
export default schoolService;

