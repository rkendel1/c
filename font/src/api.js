import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api'; // Fixed IP and removed trailing slash

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Token management functions
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setAccessToken = (token) => localStorage.setItem('access_token', token);
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token available, clear everything
        clearTokens();
        delete api.defaults.headers.common['Authorization'];
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${baseURL}users/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, clear tokens and logout
        clearTokens();
        delete api.defaults.headers.common['Authorization'];
        processQueue(refreshError, null);
        
        // You might want to trigger a logout or redirect here
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;