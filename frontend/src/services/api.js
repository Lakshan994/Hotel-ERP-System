import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 15000 });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hotel_erp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const dataOf = response => response.data.data;
export const friendlyError = error => error.response?.data?.message || error.message || 'Something went wrong';
export default api;
