import axios, { type AxiosError, type AxiosInstance } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach auth token from localStorage if present
  instance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // Normalize errors
  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message ?? error.message ?? 'Something went wrong';
      return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
    },
  );

  return instance;
}

export const apiClient = createApiClient();
