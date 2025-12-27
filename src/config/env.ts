// Get API base URL - use environment variable or default based on environment
const getApiBaseUrl = () => {
  // If VITE_API_BASE_URL is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In development, default to localhost:3000
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api';
  }
  
  // In production, use the Cloud Run URL
  return 'https://nuggebugge-api-829848937020.asia-south1.run.app/api';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

