import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Spin, Alert, Typography, Tag } from 'antd';
import styled from 'styled-components';
import { analyzeSentiment, isAIEnabled } from '../services/aiService';
import { theme } from '../styles/theme';
import { FlexContainer, Text, LoadingContainer, InfoBox, GradientCard, IconWrapper } from '../styles/components';

const { Title, Paragraph } = Typography;

// Styled components specific to AISentiment
const SignalLabel = styled(Text)`
  text-transform: uppercase;
  font-size: ${theme.typography.sizes.sm};
`;

const MetricValue = styled.div`
  color: ${props => props.color || theme.colors.primary};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.md};
`;

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
      <LoadingContainer padding={theme.spacing['3xl']} bg={theme.colors.bgSecondary}>
        <Spin size="large" />
        <Text 
          block 
          size="xl" 
          weight="semibold" 
          color="primary" 
          margin={`${theme.spacing.lg} 0 0 0`}
        >
          Analyzing...
        </Text>
      </LoadingContainer>
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
    <div style={{ padding: theme.spacing.xl }}>
      {/* Main Signal Card */}
      <Card 
        className="glassmorphic-card" 
        style={{ 
          borderLeft: `5px solid ${getSentimentColor(sentimentScore)}`,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.xl
        }}
      >
        <FlexContainer justify="space-between" style={{ marginBottom: theme.spacing.lg }}>
          <SignalLabel color="faint">
            Velaris Intelligence Signal
          </SignalLabel>
          {getVerdictTag(sentiment.verdict)}
        </FlexContainer>

        <Title level={3} style={{ color: theme.colors.primary, margin: `0 0 ${theme.spacing.md} 0` }}>
          {sentiment.primary_driver} detected
        </Title>
        
        <Paragraph style={{ color: '#d9d9d9', fontSize: theme.typography.sizes.lg }}>
          {sentiment.logic}
        </Paragraph>

        <InfoBox bg="rgba(255,255,255,0.05)" padding={theme.spacing.md}>
          <Row gutter={16}>
            <Col span={12}>
              <Text size="base" color="secondary" block uppercase>RISK LEVEL</Text>
              <MetricValue color={getRiskColor(sentiment.risk_level)}>
                {sentiment.risk_level?.toUpperCase()}
              </MetricValue>
            </Col>
            <Col span={12}>
              <Text size="base" color="secondary" block uppercase>CONFIDENCE</Text>
              <MetricValue>{((sentiment.confidence || 0.5) * 100).toFixed(0)}%</MetricValue>
            </Col>
          </Row>
        </InfoBox>
      </Card>

      {/* Price Target Card */}
      {sentiment.price_target && (
        <GradientCard gradient="dark" shadow="md">
          <FlexContainer align="center" gap={theme.spacing.md}>
            <IconWrapper gradient="purple" size="48px" fontSize="24px">
              🎯
            </IconWrapper>
            <div style={{ flex: 1 }}>
              <Text size="md" color="muted" block>Sentiment-Based Target</Text>
              <Text size="2xl" color="primary" weight="bold">
                {sentiment.price_target}
              </Text>
            </div>
          </FlexContainer>
        </GradientCard>
      )}
    </div>
  );
};

export default AISentiment;
