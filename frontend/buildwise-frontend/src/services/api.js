import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Add fallback URL
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
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors globally
api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        console.error('API Error:', error.response.status, error.response.data);
      } else {
        console.error('API Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
  

  export const getProjects = async (userId) => {
    try {
      const response = await api.get(`/projects?userId=${userId}`);
      return response.data || []; // Always return array
    } catch (error) {
      console.error('Error fetching projects:', error);
      return []; // Return empty array on error
    }
  };
  
  export const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error; // Re-throw to handle in component
    }
  };
  
export const getRecentActivity = async (userId) => {
  const response = await api.get(`/activity?userId=${userId}`);
  return response.data;
};

// export const createProject = async (projectData) => {
//     const response = await api.post('/projects', projectData);
//     return response.data;
//   };
  
  export const getMaterialOptions = async () => {
    const response = await api.get('/materials');
    return response.data;
  };

export default api;