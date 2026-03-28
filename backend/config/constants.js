import dotenv from 'dotenv';
dotenv.config();

export const AI_SERVER_URL = process.env.AI_SERVER_URL || 'http://localhost:8000';
export const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
