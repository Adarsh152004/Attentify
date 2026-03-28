export const generateAllocation = async ({ amount, risk, duration }) => {
  // A simplistic mock algorithmic allocation based on risk level.
  // In a real application, this might call the AI endpoint or use complex financial modeling.
  
  let allocation = [];
  let risk_score = 50;
  
  // Weights: [US Equities, Int'l Equities, Bonds, Real Estate, Commodities, Crypto, Cash]
  if (risk === 'conservative') {
      allocation = [
          { name: 'US Equities', value: 20 },
          { name: 'Intl Equities', value: 10 },
          { name: 'Bonds', value: 50 },
          { name: 'Real Estate', value: 5 },
          { name: 'Commodities', value: 5 },
          { name: 'Cash', value: 10 }
      ];
      risk_score = 25;
  } else if (risk === 'moderate') {
      allocation = [
          { name: 'US Equities', value: 40 },
          { name: 'Intl Equities', value: 20 },
          { name: 'Bonds', value: 25 },
          { name: 'Real Estate', value: 5 },
          { name: 'Commodities', value: 5 },
          { name: 'Cash', value: 5 }
      ];
      risk_score = 55;
  } else if (risk === 'aggressive') {
      allocation = [
          { name: 'US Equities', value: 50 },
          { name: 'Intl Equities', value: 20 },
          { name: 'Bonds', value: 5 },
          { name: 'Real Estate', value: 10 },
          { name: 'Commodities', value: 5 },
          { name: 'Crypto', value: 8 },
          { name: 'Cash', value: 2 }
      ];
      risk_score = 85;
  } else {
       // Default moderate fallback
       allocation = [
          { name: 'US Equities', value: 35 },
          { name: 'Intl Equities', value: 20 },
          { name: 'Bonds', value: 25 },
          { name: 'Real Estate', value: 10 },
          { name: 'Commodities', value: 5 },
          { name: 'Cash', value: 5 }
      ];
  }

  return { allocation, risk_score };
};
