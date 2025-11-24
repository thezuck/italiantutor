const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const auth = {
  me: async () => {
    return apiRequest('/auth/me');
  },
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
  register: async (email, password, full_name) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },
  logout: () => {
    setToken(null);
    return Promise.resolve();
  },
};

// Lessons API
export const lessons = {
  list: async (sortBy = 'title', limit = null) => {
    const params = new URLSearchParams({ sortBy });
    if (limit) params.append('limit', limit);
    return apiRequest(`/lessons?${params.toString()}`);
  },
  get: async (id) => {
    return apiRequest(`/lessons/${id}`);
  },
};

// Chat Messages API
export const chatMessages = {
  list: async (filters = {}, sortBy = 'created_date', limit = 100) => {
    const params = new URLSearchParams({ sortBy, limit: limit.toString() });
    if (filters.user_email) params.append('user_email', filters.user_email);
    if (filters.lesson_id) params.append('lesson_id', filters.lesson_id);
    return apiRequest(`/chat-messages?${params.toString()}`);
  },
  create: async (data) => {
    return apiRequest('/chat-messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// User Progress API
export const userProgress = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.user_email) params.append('user_email', filters.user_email);
    if (filters.lesson_id) params.append('lesson_id', filters.lesson_id);
    const queryString = params.toString();
    return apiRequest(`/user-progress${queryString ? `?${queryString}` : ''}`);
  },
  create: async (data) => {
    return apiRequest('/user-progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id, data) => {
    return apiRequest(`/user-progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export default {
  auth,
  lessons,
  chatMessages,
  userProgress,
};

