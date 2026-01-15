import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Spin, Alert, Typography, Tag } from 'antd';
import { analyzeSentiment, isAIEnabled } from '../services/aiService';

const { Title, Text, Paragraph } = Typography;

const AISentiment = ({ coinDetails, visible, onSentimentUpdate }) => {
  const [sentiment, setSentiment] = useState(null);
  const [analyzingSentiment, setAnalyzingSentiment] = useState(false);

  const fetchNewsAndAnalyze = useCallback(async () => {
    if (!isAIEnabled()) return;
    
    setAnalyzingSentiment(true);
    setSentiment(null);
    
    try {
      const headlines = [];
      
      if (coinDetails?.description?.en) {
        headlines.push(`${coinDetails.name} is a leading cryptocurrency in the market`);
      }
      
      const priceChange24h = coinDetails?.market_data?.price_change_percentage_24h || 0;
      const priceChange7d = coinDetails?.market_data?.price_change_percentage_7d || 0;
      
      if (priceChange24h > 5) {
        headlines.push(`${coinDetails?.name} surges ${priceChange24h.toFixed(2)}% in 24 hours amid strong market momentum`);
      } else if (priceChange24h < -5) {
        headlines.push(`${coinDetails?.name} drops ${Math.abs(priceChange24h).toFixed(2)}% as market faces correction`);
      } else {
        headlines.push(`${coinDetails?.name} shows stable performance with ${priceChange24h.toFixed(2)}% change in 24h`);
      }
      
      if (priceChange7d > 10) {
        headlines.push(`${coinDetails?.name} demonstrates strong weekly growth of ${priceChange7d.toFixed(2)}%`);
      } else if (priceChange7d < -10) {
        headlines.push(`${coinDetails?.name} faces weekly decline of ${Math.abs(priceChange7d).toFixed(2)}%`);
      }
      
      const marketCapRank = coinDetails?.market_cap_rank;
      if (marketCapRank <= 10) {
        headlines.push(`${coinDetails?.name} maintains top ${marketCapRank} position with strong market dominance`);
      }
      
      const volume24h = coinDetails?.market_data?.total_volume?.usd;
      const marketCap = coinDetails?.market_data?.market_cap?.usd;
      if (volume24h && marketCap) {
        const volumeRatio = (volume24h / marketCap) * 100;
        if (volumeRatio > 10) {
          headlines.push(`High trading activity with ${volumeRatio.toFixed(1)}% of market cap traded in 24h`);
        }
      }
      
      if (coinDetails?.sentiment_votes_up_percentage > 70) {
        headlines.push(`Community sentiment bullish with ${coinDetails.sentiment_votes_up_percentage}% positive votes`);
      }
      
      const result = await analyzeSentiment(headlines, coinDetails?.name || 'this cryptocurrency');
      setSentiment(result);
      
      // Notify parent component of sentiment update
      if (onSentimentUpdate && result) {
        onSentimentUpdate(result);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentiment({ 
        sentiment: 0, 
        summary: 'Unable to analyze sentiment.',
        error: true 
      });
    } finally {
      setAnalyzingSentiment(false);
    }
  }, [coinDetails, onSentimentUpdate]);

  useEffect(() => {
    if (visible && coinDetails) {
      fetchNewsAndAnalyze();
    }
  }, [visible, coinDetails, fetchNewsAndAnalyze]);

  const getSentimentColor = (score) => {
    if (score > 0.3) return '#52c41a';
    if (score < -0.3) return '#f5222d';
    return '#faad14';
  };

  const getVerdictTag = (verdict) => {
    const styles = {
      'BULLISH': { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' },
      'BEARISH': { color: '#f5222d', bg: '#fff1f0', border: '#ffa39e' },
      'ACCUMULATE': { color: '#1890ff', bg: '#e6f7ff', border: '#91d5ff' },
    };
    const style = styles[verdict?.toUpperCase()] || { color: '#8c8c8c', bg: '#fafafa', border: '#d9d9d9' };
    
    return <Tag color={style.color} style={{ fontWeight: 'bold', background: style.bg, borderColor: style.border }}>{verdict?.toUpperCase()}</Tag>;
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return '#ff4d4f';
    if (risk === 'Medium') return '#faad14';
    return '#52c41a';
  };

  if (!isAIEnabled()) {
    return (
      <Alert
        message="AI Features Disabled"
        description="Add OpenAI API key to enable sentiment analysis."
        type="info"
        showIcon
      />
    );
  }

  if (analyzingSentiment) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: '#1a1a1a', borderRadius: '16px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, fontSize: '16px', fontFamily: 'Inter', fontWeight: 600, color: '#fff' }}>Analyzing...</p>
      </div>
    );
  }

  if (!sentiment || sentiment.error) {
    return (
      <Alert
        message="Sentiment Analysis Unavailable"
        description="Unable to analyze sentiment. Check OpenAI API configuration."
        type="warning"
        showIcon
      />
    );
  }

  const sentimentScore = sentiment?.sentiment || 0;

  return (
    <div style={{ padding: '20px' }}>
      {/* Main Signal Card */}
      <Card 
        className="glassmorphic-card" 
        style={{ 
          borderLeft: `5px solid ${getSentimentColor(sentimentScore)}`,
          borderRadius: '16px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <Text strong style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '10px' }}>
            Velaris Intelligence Signal
          </Text>
          {getVerdictTag(sentiment.verdict)}
        </div>

        <Title level={3} style={{ color: '#fff', margin: '0 0 10px 0' }}>
          {sentiment.primary_driver} detected
        </Title>
        
        <Paragraph style={{ color: '#d9d9d9', fontSize: '14px' }}>
          {sentiment.logic}
        </Paragraph>

        <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: '11px' }}>RISK LEVEL</Text>
              <div style={{ color: getRiskColor(sentiment.risk_level), fontWeight: 'bold' }}>
                {sentiment.risk_level?.toUpperCase()}
              </div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: '11px' }}>CONFIDENCE</Text>
              <div style={{ color: '#fff' }}>{((sentiment.confidence || 0.5) * 100).toFixed(0)}%</div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Price Target Card */}
      {sentiment.price_target && (
        <Card style={{ 
          background: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🎯
            </div>
            <div style={{ flex: 1 }}>
              <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>Sentiment-Based Target</Text>
              <Text strong style={{ fontSize: '18px', color: '#fff', fontFamily: 'Inter', fontWeight: 700 }}>
                {sentiment.price_target}
              </Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AISentiment;
