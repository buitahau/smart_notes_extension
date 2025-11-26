import axios from 'axios';
import { storage } from '@utils/storage';
import { STORAGE_KEYS, API_ENDPOINTS } from '@utils/constants';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const PROTECTED_APIS = [
  API_ENDPOINTS.AUTH.VALIDATE,
  API_ENDPOINTS.AUTH.LOGOUT,
  API_ENDPOINTS.USER.ME,
  API_ENDPOINTS.NOTES.BASE,
  API_ENDPOINTS.QUERY.BASE,
  API_ENDPOINTS.SETTINGS,
] as const;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include bearer token for protected routes
apiClient.interceptors.request.use(
  async (config) => {
    // Add bearer token for protected routes (auth and notes endpoints)
    const isProtectedRoute =
      PROTECTED_APIS.some((endpoint) => config.url?.includes(endpoint)) ||
      config.url?.includes('/api/notes');

    if (isProtectedRoute) {
      try {
        const token = await storage.get(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get token from storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for global error handling (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here if needed
    if (error.response?.status === 401) {
      // Token might be expired, could trigger logout here
      console.warn('Unauthorized request, token might be expired');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
