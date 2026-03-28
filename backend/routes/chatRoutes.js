import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', sendMessage);
router.get('/history', getChatHistory);

export default router;
