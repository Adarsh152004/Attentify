import { useState, useEffect } from 'react';
import portfolioService from '../services/portfolioService';

export function usePortfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios(data.portfolios || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePortfolio = async (params) => {
    setLoading(true);
    try {
      const data = await portfolioService.generatePortfolio(params);
      setPortfolios(prev => [data.portfolio, ...prev]);
      setError(null);
      return data.portfolio;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return { portfolios, loading, error, fetchPortfolios, generatePortfolio };
}

export default usePortfolio;
