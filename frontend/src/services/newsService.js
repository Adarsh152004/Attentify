import api from './api';

export const newsService = {
  async getLatestNews(limit = 20) {
    const response = await api.get(`/news?limit=${limit}`);
    return response.data;
  },

  async getSentimentSummary() {
    const response = await api.get('/news/sentiment-summary');
    return response.data;
  },

  async triggerIngestion() {
    const response = await api.post('/news/ingest');
    return response.data;
  },
};

export default newsService;
