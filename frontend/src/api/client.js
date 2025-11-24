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

  console.log('[DEBUG] API Request:', {
    method: options.method || 'GET',
    url,
    hasToken: !!token,
    body: options.body
  });

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    console.log('[DEBUG] API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url: response.url
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('[DEBUG] API Error Response:', error);
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[DEBUG] API Response data:', data);
    return data;
  } catch (error) {
    console.error('[DEBUG] API Request failed:', error);
    throw error;
  }
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
    console.log('[DEBUG] API: chatMessages.list called with:', { filters, sortBy, limit });
    const params = new URLSearchParams({ sortBy, limit: limit.toString() });
    if (filters.user_email) params.append('user_email', filters.user_email);
    if (filters.lesson_id) params.append('lesson_id', filters.lesson_id);
    const url = `/chat-messages?${params.toString()}`;
    console.log('[DEBUG] API: Requesting URL:', url);
    const result = await apiRequest(url);
    console.log('[DEBUG] API: chatMessages.list response:', result);
    return result;
  },
  create: async (data) => {
    console.log('[DEBUG] API: chatMessages.create called with:', data);
    const result = await apiRequest('/chat-messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('[DEBUG] API: chatMessages.create response:', result);
    return result;
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

