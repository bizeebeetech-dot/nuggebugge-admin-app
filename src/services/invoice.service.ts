import api from './api';

export enum InvoiceStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  CANCELLED = 'cancelled',
}

export interface Invoice {
  id: string;
  invoice_number: string;
  student_id?: number;
  student_app_code?: string;
  student_name?: string;
  student_roll_number?: string;
  student_email?: string;
  student_mobile?: string;
  school_name?: string;
  board_name?: string;
  district_name?: string;
  class_name?: string;
  section?: string;
  activity_name?: string;
  amount: number;
  status: InvoiceStatus;
  description?: string;
  payment_date?: string;
  document_url?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceExportData {
  date: string;
  invoice_id: string;
  name: string;
  app_id: string;
  roll_number: string;
  school_name: string;
  board: string;
  district: string;
  class: string;
  section: string;
  email: string;
  mobile_no: string;
  activity_name: string;
  amount_paid: number;
}

export interface InvoiceStats {
  total: number;
  complete: number;
  pending: number;
  cancelled: number;
  total_amount: number;
}

class InvoiceService {
  async getAll(search?: string, status?: InvoiceStatus): Promise<Invoice[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    
    const response = await api.get('/invoices', { params });
    return response.data.data;
  }

  async getById(id: string): Promise<Invoice> {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
  }

  async create(data: {
    student_id: number;
    activity_name?: string;
    amount: number;
    description?: string;
  }): Promise<Invoice> {
    const response = await api.post('/invoices', data);
    return response.data.data;
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data.data;
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data.data;
  }

  async getStats(): Promise<InvoiceStats> {
    const response = await api.get('/invoices/stats');
    return response.data.data;
  }

  async getExportData(startDate: string, endDate: string): Promise<InvoiceExportData[]> {
    const response = await api.get('/invoices/export', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data.data;
  }

  // Download as Excel
  downloadExcel(data: InvoiceExportData[], filename: string) {
    // Convert to CSV format
    const headers = [
      'Date',
      'Invoice ID',
      'Name',
      'APP ID',
      'Roll Number of Student',
      'School Name',
      'Board',
      'District',
      'Class',
      'Section',
      'Email',
      'Mobile No',
      'Activity Name',
      'Amount Paid',
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.date}"`,
        `"${row.invoice_id}"`,
        `"${row.name}"`,
        `"${row.app_id}"`,
        `"${row.roll_number}"`,
        `"${row.school_name}"`,
        `"${row.board}"`,
        `"${row.district}"`,
        `"${row.class}"`,
        `"${row.section}"`,
        `"${row.email}"`,
        `"${row.mobile_no}"`,
        `"${row.activity_name}"`,
        row.amount_paid,
      ].join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;



