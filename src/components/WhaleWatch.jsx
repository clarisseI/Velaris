import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Alert, Tag, Typography, Button, Spin, Row, Col, Progress } from 'antd';
import { 
  ThunderboltOutlined, 
  WarningOutlined, 
  RiseOutlined, 
  FallOutlined,
  DashboardOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { detectWhaleActivity, getWhaleInsights, analyzeWhaleWithAI } from '../services/whaleTracker';
import { isAIEnabled, askCryptoAssistant } from '../services/aiService';

import { theme } from '../styles/theme';

const { Text, Paragraph, Title } = Typography;

const WhaleCard = styled(Card)`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.xl};
  font-family: ${theme.typography.fontFamily};
  letter-spacing: -0.02em;
  
  .ant-card-head {
    border-bottom: 1px solid ${theme.colors.borderLight};
  }
  
  .ant-card-head-title {
    color: white;
  }
`;

const BentoTile = styled.div`
  background: ${theme.colors.cardBg};
  backdrop-filter: blur(20px);
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  height: 100%;
  transition: all 0.3s ease;
  font-family: ${theme.typography.fontFamily};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const SignalItem = styled.div`
  background: ${theme.colors.cardBg};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  border-left: 4px solid ${props => {
    if (props.severity === 'danger') return theme.colors.error;
    if (props.severity === 'warning') return theme.colors.warning;
    if (props.severity === 'success') return theme.colors.success;
    return theme.colors.info;
  }};
  transition: all 0.3s;
  opacity: ${props => props.confidence > 0.8 ? 1 : 0.7};
  font-family: ${theme.typography.fontFamily};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`;

const DivergenceAlert = styled.div`
  background: ${theme.gradients.orange};
  border: 2px solid ${theme.colors.error};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }
`;

const AIInsightBox = styled.div`
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.3);
  padding: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.sm};
`;

const WhaleWatch = ({ coinData, coinId, aiSentiment }) => {
  const [signals, setSignals] = useState([]);
  const [insights, setInsights] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [divergenceDetected, setDivergenceDetected] = useState(false);
  const signalsRef = useRef(null);

  const analyzeWhaleActivity = useCallback(async () => {
    setLoading(true);
    try {
      const detectedSignals = await detectWhaleActivity(coinData);
      
      // Add confidence scores to signals
      const signalsWithConfidence = detectedSignals.map(signal => ({
        ...signal,
        confidence: calculateSignalConfidence(signal, coinData)
      }));
      
      setSignals(signalsWithConfidence);
      
      const whaleInsights = getWhaleInsights(signalsWithConfidence, coinData?.name);
      setInsights(whaleInsights);
      
      // Check for divergence
      checkDivergence(signalsWithConfidence, aiSentiment);
    } catch (error) {
      console.error('Error analyzing whale activity:', error);
    } finally {
      setLoading(false);
    }
  }, [coinData, aiSentiment]);

  const calculateSignalConfidence = (signal, data) => {
    // Base confidence
    let confidence = 0.5;
    
    // Higher volume = higher confidence
    const volumeRatio = data?.market_data?.total_volume?.usd / data?.market_data?.market_cap?.usd;
    if (volumeRatio > 0.15) confidence += 0.2;
    else if (volumeRatio > 0.08) confidence += 0.1;
    
    // Price change magnitude
    const priceChange = Math.abs(data?.market_data?.price_change_percentage_24h || 0);
    if (priceChange > 10) confidence += 0.2;
    else if (priceChange > 5) confidence += 0.1;
    
    // Signal severity
    if (signal.severity === 'danger' || signal.severity === 'success') confidence += 0.1;
    
    return Math.min(confidence, 1);
  };

  const checkDivergence = (whaleSignals, sentiment) => {
    if (!sentiment || whaleSignals.length === 0) {
      setDivergenceDetected(false);
      return;
    }
    
    const sentimentBullish = sentiment.sentiment > 0.3;
    const sentimentBearish = sentiment.sentiment < -0.3;
    
    const hasExchangeInflow = whaleSignals.some(s => 
      s.message.toLowerCase().includes('inflow') || 
      s.message.toLowerCase().includes('sell')
    );
    const hasExchangeOutflow = whaleSignals.some(s => 
      s.message.toLowerCase().includes('outflow') || 
      s.message.toLowerCase().includes('accumulation')
    );
    
    // Detect divergence
    if ((sentimentBullish && hasExchangeInflow) || (sentimentBearish && hasExchangeOutflow)) {
      setDivergenceDetected(true);
    } else {
      setDivergenceDetected(false);
    }
  };

  useEffect(() => {
    if (coinData) {
      analyzeWhaleActivity();
    }
  }, [coinData, analyzeWhaleActivity]);

  // GSAP animation for signals
  useEffect(() => {
    if (!loading && signals.length > 0 && signalsRef.current) {
      gsap.from(".signal-item", {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, [loading, signals]);

  const getAIAnalysis = async () => {
    if (!isAIEnabled()) {
      Alert.warning({
        title: 'AI Features Disabled',
        content: 'Please add your OpenAI API key to enable AI whale analysis.'
      });
      return;
    }

    setAnalyzingAI(true);
    try {
      const analysis = await analyzeWhaleWithAI(
        signals, 
        coinData?.name, 
        askCryptoAssistant
      );
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
      setAiAnalysis('Unable to generate AI analysis. Please check your OpenAI configuration.');
    } finally {
      setAnalyzingAI(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'danger':
        return <FallOutlined style={{ color: '#f5222d', fontSize: 18 }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14', fontSize: 18 }} />;
      case 'success':
        return <RiseOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
      default:
        return <DashboardOutlined style={{ color: '#1890ff', fontSize: 18 }} />;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Divergence Alert */}
      {divergenceDetected && (
        <DivergenceAlert>
          <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
            <div>
              <Text strong style={{ color: '#fff', fontSize: 16, display: 'block', marginBottom: 4 }}>
                ⚠️ DIVERGENCE DETECTED
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                {aiSentiment?.sentiment > 0 
                  ? "Retail is buying, but Whales are exiting. Exercise caution."
                  : "Retail is selling, but Whales are accumulating. Potential opportunity."}
              </Text>
            </div>
          </div>
        </DivergenceAlert>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="Analyzing whale patterns..." />
        </div>
      ) : (
        <>
          {/* Bento Grid Layout */}
          <Row gutter={[16, 16]}>
            {/* Tile A: Live Whale Pulse */}
            <Col xs={24} md={8}>
              <BentoTile>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    margin: '0 auto 12px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: signals.length > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
                  }}>
                    <ThunderboltOutlined style={{ fontSize: 28, color: '#fff' }} />
                  </div>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    display: 'block',
                    marginBottom: 8
                  }}>
                    Live Pulse
                  </Text>
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>
                    {signals.length} Signals
                  </Title>
                  {signals.length > 0 && (
                    <Text style={{ color: '#52c41a', fontSize: 12, marginTop: 8, display: 'block' }}>
                      {signals[0].message.slice(0, 40)}...
                    </Text>
                  )}
                </div>
              </BentoTile>
            </Col>

            {/* Tile B: Risk Gauge */}
            <Col xs={24} md={8}>
              <BentoTile>
                <div style={{ textAlign: 'center' }}>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: 11, 
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    display: 'block',
                    marginBottom: 12
                  }}>
                    Risk Level
                  </Text>
                  <Progress
                    type="circle"
                    percent={insights?.risk_level === 'high' ? 85 : insights?.risk_level === 'medium' ? 50 : 20}
                    strokeColor={
                      insights?.risk_level === 'high' ? '#f5222d' :
                      insights?.risk_level === 'medium' ? '#faad14' : '#52c41a'
                    }
                    format={() => (
                      <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
                        {insights?.risk_level?.toUpperCase() || 'LOW'}
                      </span>
                    )}
                  />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 12, display: 'block' }}>
                    Based on {signals.length} signals
                  </Text>
                </div>
              </BentoTile>
            </Col>

            {/* Tile C: Quick Summary */}
            <Col xs={24} md={8}>
              <BentoTile>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: 11, 
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  display: 'block',
                  marginBottom: 12
                }}>
                  Recommendation
                </Text>
                <Paragraph style={{ color: '#fff', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                  {insights?.summary || 'Analyzing market conditions...'}
                </Paragraph>
                <Tag color={insights?.risk_level === 'high' ? 'red' : 'blue'} style={{ fontWeight: 600 }}>
                  {insights?.recommendation || 'Monitor closely'}
                </Tag>
              </BentoTile>
            </Col>
          </Row>

          {/* Signals List */}
          {signals.length > 0 && (
            <WhaleCard 
              title={<span style={{ fontSize: 15, fontWeight: 600 }}>Detected Signals ({signals.length})</span>}
              style={{ marginTop: 16 }}
              extra={
                <Button 
                  type="text" 
                  icon={<ReloadOutlined />} 
                  onClick={analyzeWhaleActivity}
                  loading={loading}
                  size="small"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                />
              }
            >
              <div ref={signalsRef}>
                {signals.map((signal, index) => (
                  <SignalItem 
                    key={index} 
                    severity={signal.severity}
                    confidence={signal.confidence}
                    className="signal-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                      {getSeverityIcon(signal.severity)}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <Text strong style={{ color: 'white' }}>
                            {signal.message}
                          </Text>
                          <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                            {(signal.confidence * 100).toFixed(0)}% CONFIDENCE
                          </Text>
                        </div>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                          💡 {signal.indicator}
                        </Text>
                      </div>
                    </div>
                  </SignalItem>
                ))}
              </div>

              {/* AI Analysis Button */}
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ThunderboltOutlined />}
                  onClick={getAIAnalysis}
                  loading={analyzingAI}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontWeight: 600
                  }}
                >
                  {aiAnalysis ? 'Refresh AI Analysis' : 'Get AI Deep Dive'}
                </Button>
              </div>

              {/* AI Analysis Result */}
              {aiAnalysis && (
                <AIInsightBox>
                  <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                    <ThunderboltOutlined style={{ color: '#a855f7', fontSize: 20, marginTop: 2 }} />
                    <div>
                      <Text strong style={{ color: 'white', display: 'block', marginBottom: 8 }}>
                        AI Deep Dive
                      </Text>
                      <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>
                        {aiAnalysis}
                      </Paragraph>
                    </div>
                  </div>
                </AIInsightBox>
              )}
            </WhaleCard>
          )}

          {signals.length === 0 && !loading && (
            <Alert
              message="No Whale Activity Detected"
              description="Market conditions appear stable. No significant large trader movements detected."
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WhaleWatch;
