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

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'A network error occurred';

    // Auto-logout on 401 Unauthorized (except for login/register)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      // We could dispatch logout here if we had access to store
      console.error('Session expired or unauthorized');
    }

    return Promise.reject(error);
  }
);

export default api;