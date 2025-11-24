import api from './client.js';

// Export entities with Base44-like interface for compatibility
export const Lesson = {
  list: async (sortBy = 'title', limit = null) => {
    return api.lessons.list(sortBy, limit);
  },
  get: async (id) => {
    return api.lessons.get(id);
  },
};

export const ChatMessage = {
  filter: async (filters = {}, sortBy = 'created_date', limit = 100) => {
    return api.chatMessages.list(filters, sortBy, limit);
  },
  create: async (data) => {
    return api.chatMessages.create(data);
  },
};

export const UserProgress = {
  filter: async (filters = {}) => {
    return api.userProgress.list(filters);
  },
  create: async (data) => {
    return api.userProgress.create(data);
  },
  update: async (id, data) => {
    return api.userProgress.update(id, data);
  },
};

// Auth API
export const User = api.auth;
