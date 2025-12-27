import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'date-fns',
      '@mui/x-date-pickers/AdapterDateFns',
    ],
    include: [
      '@mui/x-date-pickers/AdapterDayjs',
      'dayjs',
    ],
  },
});

