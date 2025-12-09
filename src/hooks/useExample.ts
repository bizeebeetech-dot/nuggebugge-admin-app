import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface ExampleData {
  id: number;
  name: string;
}

export const useExample = () => {
  return useQuery<ExampleData[]>({
    queryKey: ['example'],
    queryFn: async () => {
      const response = await api.get<ExampleData[]>('/example');
      return response.data;
    },
  });
};

