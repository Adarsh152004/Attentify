import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from '../config/constants.js';

/**
 * Fetch news sentiment data from Alpha Vantage API
 */
export const fetchAlphaVantageNews = async () => {
    if (!ALPHA_VANTAGE_API_KEY) {
        console.warn("Alpha Vantage API Key missing. Skipping news ingestion.");
        return [];
    }
    
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'NEWS_SENTIMENT',
                topics: 'financial_markets,economy_macro', // relevant topics
                sort: 'LATEST',
                limit: 20, // max is 200 on premium, defaulting to 20 for standard
                apikey: ALPHA_VANTAGE_API_KEY
            }
        });
        
        return response.data.feed || [];
    } catch (error) {
        console.error("Alpha Vantage fetch error:", error);
        return [];
    }
}

/**
 * Optional pipeline utilizing AI endpoint directly from node.js if sentiment wasn't provided directly
 */
export const classifySentimentWithAI = async (text) => {
    // We would use aiClient here if needed
    // However Alpha Vantage provides sentiment directly, simplifying extraction.
    return 'neutral';
}
