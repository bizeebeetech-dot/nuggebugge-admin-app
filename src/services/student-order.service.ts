import api from './api';

export interface StudentOrder {
  id: number;
  student_id: number;
  activity_id: number;
  amount: number;
  purchased_response: string | null;
  invoice_number: string;
  status: 'pending' | 'completed';
  archive_status?: 'active' | 'archive';
  student?: {
    id: number;
    name: string;
    email: string;
    app_code: string;
    phone?: string;
    school_name?: string;
  };
  activity?: {
    id: number;
    title: string;
    name?: string;
    price: number;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  completed: number;
  totalAmount: number;
}

class StudentOrderService {
  async getAll(search?: string, status?: string): Promise<StudentOrder[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get('/student-orders', { params });
    return response.data.data;
  }

  async getById(id: number): Promise<StudentOrder> {
    const response = await api.get(`/student-orders/${id}`);
    return response.data.data;
  }

  async getByStudentId(studentId: number): Promise<StudentOrder[]> {
    const response = await api.get(`/student-orders/student/${studentId}`);
    return response.data.data;
  }

  async getByActivityId(activityId: number, archiveStatus?: 'active' | 'archive'): Promise<StudentOrder[]> {
    const params = archiveStatus ? { archive_status: archiveStatus } : {};
    const response = await api.get(`/student-orders/activity/${activityId}`, { params });
    return response.data.data;
  }

  async updateArchiveStatus(id: number, archiveStatus: 'active' | 'archive'): Promise<StudentOrder> {
    const response = await api.patch(`/student-orders/${id}/archive-status`, { archive_status: archiveStatus });
    return response.data.data;
  }

  async create(data: Partial<StudentOrder>): Promise<StudentOrder> {
    const response = await api.post('/student-orders', data);
    return response.data.data;
  }

  async update(id: number, data: Partial<StudentOrder>): Promise<StudentOrder> {
    const response = await api.put(`/student-orders/${id}`, data);
    return response.data.data;
  }

  async updateStatus(id: number, status: 'pending' | 'completed'): Promise<StudentOrder> {
    const response = await api.patch(`/student-orders/${id}/status`, { status });
    return response.data.data;
  }

  async getStats(): Promise<OrderStats> {
    const response = await api.get('/student-orders/stats');
    return response.data.data;
  }
}

export const studentOrderService = new StudentOrderService();
export default studentOrderService;

