import { fetchAlphaVantageNews, classifySentimentWithAI } from '../services/newsIngestion.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getLatestNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const { data, error } = await supabaseAdmin
      .from('financial_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({ news: data });
  } catch (error) {
    next(error);
  }
};

export const getSentimentSummary = async (req, res, next) => {
  try {
    // For a real app, you might aggregate this via SQL or process the recent news
    const { data, error } = await supabaseAdmin
      .from('financial_news')
      .select('sentiment')
      .order('published_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    const summary = data.reduce((acc, curr) => {
        if(curr.sentiment === 'positive') acc.positive++;
        else if(curr.sentiment === 'neutral') acc.neutral++;
        else if(curr.sentiment === 'negative') acc.negative++;
        return acc;
    }, { positive: 0, neutral: 0, negative: 0});

    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

// Typically run by a cron job, but exposed here as an API endpoint to trigger manually
export const ingestNews = async (req, res, next) => {
  try {
    const newsItems = await fetchAlphaVantageNews();
    if (!newsItems || newsItems.length === 0) {
        return res.json({ message: 'No new articles fetched from Alpha Vantage or API limit reached.' });
    }

    const insertedCount = 0;
    
    // We will do a batch insertion in a real app, but for demonstration 
    // we iterate to check if we need custom sentiment analysis
    const formattedNews = newsItems.map(item => {
      // Determine overall sentiment (Alpha Vantage provides a sentiment score string)
      let sentimentValue = 'neutral';
      if(item.overall_sentiment_label === 'Bullish' || item.overall_sentiment_label === 'Somewhat-Bullish') sentimentValue = 'positive';
      if(item.overall_sentiment_label === 'Bearish' || item.overall_sentiment_label === 'Somewhat-Bearish') sentimentValue = 'negative';

      return {
        title: item.title,
        content: item.summary,
        sentiment: sentimentValue,
        source: item.source,
        url: item.url,
        published_at: item.time_published ? new Date(item.time_published.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6Z')).toISOString() : new Date().toISOString()
      };
    });

    const { error } = await supabaseAdmin
      .from('financial_news')
      .upsert(formattedNews, { onConflict: 'title' }); // Avoid exact title duplicates if run frequently

    if (error) throw error;

    res.json({ message: `Successfully ingested news batch from Alpha Vantage.` });
  } catch (error) {
    console.error("News Ingestion error:", error);
    next(error);
  }
};
