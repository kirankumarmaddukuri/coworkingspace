import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const amenityService = {
  getAvailable: () => api.get('/amenities/available'),
  reserve: (bookingId, amenityId) => api.post(`/amenity-reservations?bookingId=${bookingId}&amenityId=${amenityId}`),
  getAll: () => api.get('/amenities'),
  create: (data) => api.post('/amenities', data),
  updateStatus: (id, status) => api.put(`/amenities/${id}/status?status=${status}`),
};

export const authService = {
  login: (email, password) => api.post('/auth/signin', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  changePassword: (data) => api.post('/auth/password/change', data),
};

export const workspaceService = {
  getAvailable: () => api.get('/workspaces/available'),
  getAll: () => api.get('/workspaces'),
  create: (wsData) => api.post('/workspaces', wsData),
};

export const deskService = {
  create: (workspaceId, deskData) => api.post(`/desks?workspaceId=${workspaceId}`, deskData),
  getByWorkspace: (workspaceId) => api.get(`/desks?workspaceId=${workspaceId}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  checkIn: (id) => api.post(`/bookings/${id}/check-in`),
  checkOut: (id) => api.post(`/bookings/${id}/check-out`),
};

export const reportService = {
  getBookingStats: () => api.get('/reports/booking-stats'),
  getAmenityStats: () => api.get('/reports/amenity-stats'),
  getUtilization: () => api.get('/reports/utilization'),
};

export const userService = {
  getAll: (role) => api.get(role ? `/users?role=${role}` : '/users'),
  create: (userData) => api.post('/users', userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
