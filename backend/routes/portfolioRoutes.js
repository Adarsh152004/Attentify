import express from 'express';
import { generatePortfolio, getUserPortfolios, getPortfolioById, deletePortfolio } from '../controllers/portfolioController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All portfolio routes require authentication
router.use(requireAuth);

router.post('/generate', generatePortfolio);
router.get('/', getUserPortfolios);
router.get('/:id', getPortfolioById);
router.delete('/:id', deletePortfolio);

export default router;
