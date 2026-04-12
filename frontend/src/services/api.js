import axios from 'axios';

const API_BASE_URL = "https://family-survey-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Members API
export const membersAPI = {
  // Get all members
  getAll: async () => {
    const response = await api.get('/members');
    return response.data;
  },

  // Get filtered members
  getFiltered: async (filters) => {
    const params = new URLSearchParams();
    if (filters.ageMin !== undefined) params.append('ageMin', filters.ageMin);
    if (filters.ageMax !== undefined) params.append('ageMax', filters.ageMax);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.relation) params.append('relation', filters.relation);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/members/filter?${params.toString()}`);
    return response.data;
  },

  // Get families
  getFamilies: async () => {
    const response = await api.get('/members/families');
    return response.data;
  },

  // Get single member
  getById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  // Create member
  create: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  // Update member
  update: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },

  // Delete member
  delete: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/members/stats/overview');
    return response.data;
  },
};

export default api;
