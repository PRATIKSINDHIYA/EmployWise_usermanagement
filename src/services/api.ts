import axios from 'axios';

const BASE_URL = 'https://reqres.in/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

// User endpoints
export const getUsers = async (page: number = 1) => {
  const response = await api.get(`/users?page=${page}`);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getSingleUser = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export default api; 