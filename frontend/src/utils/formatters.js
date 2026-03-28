export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercent = (value) => {
  return `${(value * 100).toFixed(1)}%`;
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRiskLevel = (score) => {
  if (score <= 30) return { label: 'Low', color: '#10b981' };
  if (score <= 60) return { label: 'Medium', color: '#f59e0b' };
  return { label: 'High', color: '#ef4444' };
};

export const truncate = (str, maxLen = 100) => {
  if (!str || str.length <= maxLen) return str;
  return str.substring(0, maxLen) + '...';
};
