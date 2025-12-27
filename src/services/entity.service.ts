import api from './api';

export interface Entity {
  id: string | number;
  name: string;
  state_id?: string; // For districts
  board_id?: string; // For classes
  grade_number?: number; // For classes
  display_order?: number; // For classes
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

// Entity types: State, District, School Board, Class
export type EntityType = 'state' | 'district' | 'school_board' | 'class';

export const entityLabels: Record<EntityType, string> = {
  state: 'State',
  district: 'District',
  school_board: 'School Board',
  class: 'Class',
};

export const entityService = {
  async getAll(entityType: EntityType, search?: string): Promise<Entity[]> {
    const params = search ? { search } : {};
    const response = await api.get<EntityResponse>(`/entities/${entityType}`, { params });
    return response.data.data;
  },

  async getById(entityType: EntityType, id: string | number): Promise<Entity> {
    const response = await api.get<SingleEntityResponse>(`/entities/${entityType}/${id}`);
    return response.data.data;
  },

  async create(entityType: EntityType, data: { name: string; state_id?: string; board_id?: string; grade_number?: number; display_order?: number }): Promise<Entity> {
    const response = await api.post<SingleEntityResponse>(`/entities/${entityType}`, data);
    return response.data.data;
  },

  async update(entityType: EntityType, id: string | number, data: { name?: string; state_id?: string; board_id?: string; grade_number?: number; display_order?: number; is_active?: boolean }): Promise<Entity> {
    const response = await api.put<SingleEntityResponse>(`/entities/${entityType}/${id}`, data);
    return response.data.data;
  },

  async toggleActive(entityType: EntityType, id: string | number): Promise<Entity> {
    const response = await api.patch<SingleEntityResponse>(`/entities/${entityType}/${id}/toggle`);
    return response.data.data;
  },

  async delete(entityType: EntityType, id: string | number): Promise<void> {
    await api.delete(`/entities/${entityType}/${id}`);
  },
};

export default entityService;
