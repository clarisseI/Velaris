
export const detectWhaleActivity = async (coinData) => {
  try {
    const signals = [];
    
    // Analyze volume patterns
    const volume24h = coinData?.market_data?.total_volume?.usd || 0;
    const marketCap = coinData?.market_data?.market_cap?.usd || 0;
    const volumeToMcapRatio = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;
    
    // High volume relative to market cap suggests whale activity
    if (volumeToMcapRatio > 15) {
      signals.push({
        type: 'high_volume',
        severity: 'warning',
        message: `Unusual high trading volume detected: ${volumeToMcapRatio.toFixed(1)}% of market cap traded in 24h`,
        indicator: 'Potential whale accumulation or distribution',
        timestamp: new Date().toISOString()
      });
    }
    
    // Analyze price movements with volume
    const priceChange24h = coinData?.market_data?.price_change_percentage_24h || 0;
    const priceChange1h = coinData?.market_data?.price_change_percentage_1h || 0;
    
    // Sudden price spike with volume
    if (Math.abs(priceChange1h) > 5 && volumeToMcapRatio > 10) {
      signals.push({
        type: 'price_spike',
        severity: priceChange1h > 0 ? 'success' : 'danger',
        message: `${priceChange1h > 0 ? 'Pump' : 'Dump'} detected: ${Math.abs(priceChange1h).toFixed(2)}% in 1 hour with high volume`,
        indicator: priceChange1h > 0 ? 'Potential whale buying' : 'Potential whale selling',
        timestamp: new Date().toISOString()
      });
    }
    
    // ATH proximity with volume (whales often sell near ATH)
    const currentPrice = coinData?.market_data?.current_price?.usd || 0;
    const ath = coinData?.market_data?.ath?.usd || 0;
    const athProximity = ath > 0 ? (currentPrice / ath) * 100 : 0;
    
    if (athProximity > 95 && volumeToMcapRatio > 12) {
      signals.push({
        type: 'ath_proximity',
        severity: 'warning',
        message: `Price is ${athProximity.toFixed(1)}% of ATH with elevated volume`,
        indicator: 'Whales may be taking profits',
        timestamp: new Date().toISOString()
      });
    }
    
    // Volatility spike detection
    const priceChangePercent7d = coinData?.market_data?.price_change_percentage_7d || 0;
    if (Math.abs(priceChange24h) > Math.abs(priceChangePercent7d) / 3) {
      signals.push({
        type: 'volatility',
        severity: 'info',
        message: `24h movement (${priceChange24h.toFixed(2)}%) significantly differs from 7d trend`,
        indicator: 'Sudden whale activity possible',
        timestamp: new Date().toISOString()
      });
    }
    
    return signals;
  } catch (error) {
    console.error('Error detecting whale activity:', error);
    return [];
  }
};

/**
 * Get simulated whale transaction insights based on market data
 */
export const getWhaleInsights = (signals, coinName) => {
  if (signals.length === 0) {
    return {
      summary: `No significant whale activity detected for ${coinName}. Market appears stable.`,
      risk_level: 'low',
      recommendation: 'Normal market conditions'
    };
  }
  
  const hasWarning = signals.some(s => s.severity === 'warning' || s.severity === 'danger');
  const hasHighVolume = signals.some(s => s.type === 'high_volume');
  const hasPriceSpike = signals.some(s => s.type === 'price_spike');
  
  let summary = '';
  let riskLevel = 'medium';
  let recommendation = '';
  
  if (hasWarning && hasHighVolume && hasPriceSpike) {
    summary = `⚠️ Multiple whale signals detected for ${coinName}. High volume with significant price movement suggests large players are active.`;
    riskLevel = 'high';
    recommendation = 'Exercise caution. Wait for market stabilization before entering new positions.';
  } else if (hasHighVolume) {
    summary = `🐋 Whale activity detected for ${coinName}. Volume spike indicates institutional or large holder movement.`;
    riskLevel = 'medium';
    recommendation = 'Monitor closely for price direction confirmation.';
  } else {
    summary = `📊 Some unusual patterns detected for ${coinName}. Market showing signs of volatility.`;
    riskLevel = 'low';
    recommendation = 'Stay alert but no immediate action needed.';
  }
  
  return {
    summary,
    risk_level: riskLevel,
    recommendation,
    signals
  };
};

/**
 * Analyze whale behavior using AI
 */
export const analyzeWhaleWithAI = async (signals, coinName, askAI) => {
  if (signals.length === 0) {
    return 'No significant whale activity detected. Market conditions appear normal.';
  }
  
  const signalDescriptions = signals.map(s => 
    `- ${s.message} (${s.indicator})`
  ).join('\n');
  
  const prompt = `Analyze these whale/large trader signals for ${coinName}:

${signalDescriptions}

Based on these patterns, what does this suggest about:
1. Potential price movement in the next 4-24 hours
2. Whether whales are accumulating or distributing
3. Risk level for retail traders

Keep response to 3-4 sentences. Be specific and cautious.`;

  try {
    return await askAI(prompt);
  } catch (error) {
    return 'Unable to generate AI analysis. The signals above indicate potential whale activity - exercise caution.';
  }
};
