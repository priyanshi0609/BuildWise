import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async (userId) => {
  const response = await api.get(`/projects?userId=${userId}`);
  return response.data;
};

export const getRecentActivity = async (userId) => {
  const response = await api.get(`/activity?userId=${userId}`);
  return response.data;
};

export default api;