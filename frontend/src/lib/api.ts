import axios from 'axios';
import { createClient } from './supabase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const useApi = () => {
  return api;
};

// API Helpers
export const clientsApi = {
  list: () => api.get('/clients'),
  create: (data: any) => api.post('/clients', data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

export const casesApi = {
  list: () => api.get('/cases'),
  create: (data: any) => api.post('/cases', data),
  update: (id: string, data: any) => api.put(`/cases/${id}`, data),
  delete: (id: string) => api.delete(`/cases/${id}`),
};

export const chatApi = {
  sendMessage: (data: { message: string; caseId: string }) => api.post('/chat', data),
  getHistory: (caseId: string) => api.get(`/chat/${caseId}`),
};

export default api;
