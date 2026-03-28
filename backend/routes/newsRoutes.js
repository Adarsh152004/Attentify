import express from 'express';
import { getLatestNews, getSentimentSummary, ingestNews } from '../controllers/newsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth); // Protect all except potentially a public feed later

router.get('/', getLatestNews);
router.get('/sentiment-summary', getSentimentSummary);
// This would typically be protected by a service role or API key in production
router.post('/ingest', ingestNews);

export default router;
