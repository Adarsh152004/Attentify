import api from './api';

export const researchService = {
  async uploadDocument(file, title) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    const response = await api.post('/research/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getDocuments() {
    const response = await api.get('/research');
    return response.data;
  },

  async getDocumentSummary(id) {
    const response = await api.get(`/research/${id}/summary`);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/research/${id}`);
    return response.data;
  },
};

export default researchService;
