import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Dynamic Token Extraction
api.interceptors.request.use(
  (config) => {
    let token;

    if (typeof window !== 'undefined') {
      // Client-side environment
      token = Cookies.get('token');
    } else {
      // Server-side environment (SSR/Server Actions)
      const { cookies } = require('next/headers');
      token = cookies().get('token')?.value;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Manage Global Session Expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // // Flush client credentials
      // Cookies.remove('token');
      // Cookies.remove('role');
      // window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;