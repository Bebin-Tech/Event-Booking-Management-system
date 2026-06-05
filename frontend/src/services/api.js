import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('token/', credentials),
  register: (userData) => api.post('users/register/', userData),
  getProfile: () => api.get('users/profile/'),
};

export const eventService = {
  getEvents: (params) => api.get('events/events/', { params }),
  getEvent: (id) => api.get(`events/events/${id}/`),
  createEvent: (data) => api.post('events/events/', data),
  getDashboardStats: () => api.get('events/events/dashboard_stats/'),
};

export const bookingService = {
  getBookings: () => api.get('bookings/bookings/'),
  createBooking: (data) => api.post('bookings/bookings/', data),
  cancelBooking: (id) => api.post(`bookings/bookings/${id}/cancel_booking/`),
};

export default api;
