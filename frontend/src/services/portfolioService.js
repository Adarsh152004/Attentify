import api from './api';

export const portfolioService = {
  async generatePortfolio(data) {
    const response = await api.post('/portfolio/generate', data);
    return response.data;
  },

  async getUserPortfolios() {
    const response = await api.get('/portfolio');
    return response.data;
  },

  async getPortfolioById(id) {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  },

  async deletePortfolio(id) {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },
};

export default portfolioService;
