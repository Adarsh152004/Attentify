import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import researchRoutes from './routes/researchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/chat', chatRoutes);

// General purpose error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Node Backend running on port ${PORT}`);
});
