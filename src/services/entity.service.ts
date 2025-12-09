import api from './api';

export interface Entity {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EntityResponse {
  success: boolean;
  data: Entity[];
  count: number;
}

export interface SingleEntityResponse {
  success: boolean;
  data: Entity;
  message?: string;
}

export type EntityType =
  | 'state'
  | 'degree'
  | 'branch'
  | 'batch'
  | 'implementation_year'
  | 'activity_category'
  | 'activity_type';

export const entityService = {
  async getAll(entityType: EntityType, search?: string): Promise<Entity[]> {
    const params = search ? { search } : {};
    const response = await api.get<EntityResponse>(`/entities/${entityType}`, { params });
    return response.data.data;
  },

  async getById(entityType: EntityType, id: number): Promise<Entity> {
    const response = await api.get<SingleEntityResponse>(`/entities/${entityType}/${id}`);
    return response.data.data;
  },

  async create(entityType: EntityType, data: { name: string }): Promise<Entity> {
    const response = await api.post<SingleEntityResponse>(`/entities/${entityType}`, data);
    return response.data.data;
  },

  async update(entityType: EntityType, id: number, data: { name?: string; is_active?: boolean }): Promise<Entity> {
    const response = await api.put<SingleEntityResponse>(`/entities/${entityType}/${id}`, data);
    return response.data.data;
  },

  async toggleActive(entityType: EntityType, id: number): Promise<Entity> {
    const response = await api.patch<SingleEntityResponse>(`/entities/${entityType}/${id}/toggle`);
    return response.data.data;
  },

  async delete(entityType: EntityType, id: number): Promise<void> {
    await api.delete(`/entities/${entityType}/${id}`);
  },
};

export default entityService;

