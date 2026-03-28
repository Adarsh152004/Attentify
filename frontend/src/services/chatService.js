import api from './api';

export const chatService = {
  async sendMessage(question) {
    const response = await api.post('/chat', { question });
    return response.data;
  },

  async getChatHistory() {
    const response = await api.get('/chat/history');
    return response.data;
  },
};

export default chatService;
