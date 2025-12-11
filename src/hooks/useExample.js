import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
export const useExample = () => {
    return useQuery({
        queryKey: ['example'],
        queryFn: async () => {
            const response = await api.get('/example');
            return response.data;
        },
    });
};
