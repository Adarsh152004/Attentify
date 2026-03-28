import axios from 'axios';
import { AI_SERVER_URL } from '../config/constants.js';

export const aiClient = axios.create({
    baseURL: AI_SERVER_URL,
    timeout: 300000 // giving it 5 minutes as PDF chunking and embedding generation can be slow initially
});

// Simple logging interceptor
aiClient.interceptors.response.use(
  res => res,
  err => {
     console.error(`AI Client request failed: ${err.config?.url}`, err.message);
     return Promise.reject(err);
  }
)
