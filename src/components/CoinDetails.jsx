import React, { useState } from 'react';
import { Modal, Card, Row, Col, Statistic, Tag, Typography, Tabs, Slider, Progress } from 'antd';
import { RiseOutlined, FallOutlined, RocketOutlined, GlobalOutlined,TrophyOutlined, LineChartOutlined, FireOutlined } from '@ant-design/icons';
import millify from 'millify';
import { useGetCryptoDetailsQuery } from '../services/coinGeckoApi';
import WhaleWatch from './WhaleWatch';
import AISentiment from './AISentiment';
import { LoadingContainer, Text as StyledText} from '../styles/components';

const { Title, Text } = Typography;

const PerformanceMetric = ({ label, value }) => (
  <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
    <Text style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</Text>
    <Text style={{ 
      fontSize: '18px', 
      fontWeight: '800', 
      color: value >= 0 ? '#10b981' : '#ef4444',
      textShadow: value >= 0 ? '0 0 10px rgba(16, 185, 129, 0.2)' : '0 0 10px rgba(239, 68, 68, 0.2)'
    }}>
      {value > 0 ? '+' : ''}{value?.toFixed(2)}%
    </Text>
  </div>
);

const CoinDetails = ({ coinId, visible, onClose }) => {
  const { data: coinDetails, isFetching } = useGetCryptoDetailsQuery(coinId, { skip: !visible });
  const [whatIfMultiplier, setWhatIfMultiplier] = useState(1);
  const [aiSentiment, setAiSentiment] = useState(null);

  if (isFetching) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} centered className="dark-modal">
        <LoadingContainer>
          <div className="spinner" />
          <StyledText>Analyzing Market Data...</StyledText>
        </LoadingContainer>
      </Modal>
    );
  }

  if (!coinDetails) return null;

  const marketData = coinDetails.market_data;
  const priceChange24h = marketData?.price_change_percentage_24h || 0;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      className="dark-modal"
      bodyStyle={{ 
        padding: '0', 
        background: 'var(--bgPrimary)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      {/* HEADER: Deep Blue Glow */}
      <div style={{ 
        padding: '40px 30px',
        background: 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.2), transparent)',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={coinDetails.image?.large} alt={coinDetails.name} style={{ width: 60, height: 60, filter: 'drop-shadow(0 0 10px rgba(37, 99, 235, 0.5))' }} />
          <div>
            <Title level={2} style={{ margin: 0, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
              {coinDetails.name} <span style={{ color: 'var(--text-secondary)', fontWeight: '300', fontSize: '20px' }}>{coinDetails.symbol?.toUpperCase()}</span>
            </Title>
            <Tag color="blue" icon={<TrophyOutlined />} style={{ borderRadius: '6px', marginTop: '8px' }}>Rank #{coinDetails.market_cap_rank}</Tag>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Text style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '12px', fontWeight: '600' }}>CURRENT PRICE</Text>
          <Title level={2} style={{ margin: 0, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${marketData?.current_price?.usd?.toLocaleString()}
          </Title>
          <Text style={{ color: priceChange24h >= 0 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
            {priceChange24h >= 0 ? <RiseOutlined /> : <FallOutlined />} {priceChange24h?.toFixed(2)}%
          </Text>
        </div>
      </div>

      <div style={{ padding: '30px' }}>
        <Tabs defaultActiveKey="1" className="custom-tabs">
          <Tabs.TabPane tab="Overview" key="1">
            {/* GRID STATS */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              {[
                { title: 'Market Cap', value: marketData?.market_cap?.usd, icon: <GlobalOutlined />, color: 'var(--accent-primary)' },
                { title: '24h Volume', value: marketData?.total_volume?.usd, icon: <LineChartOutlined />, color: 'var(--accent-secondary)' },
                { title: 'Circulating Supply', value: marketData?.circulating_supply, icon: <FireOutlined />, color: 'var(--accent-tertiary)' }
              ].map((item, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <Card className="glassmorphic-card" bodyStyle={{ padding: '20px' }}>
                    <Statistic 
                      title={<Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.icon} {item.title}</Text>}
                      value={item.value}
                      formatter={val => `$${millify(val)}`}
                      valueStyle={{ color: 'var(--text-primary)', fontWeight: '800' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* PERFORMANCE & SUPPLY */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card className="glassmorphic-card" title={<span style={{color: '#fff'}}>Price Performance</span>}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <PerformanceMetric label="1h" value={marketData?.price_change_percentage_1h} />
                    <PerformanceMetric label="24h" value={marketData?.price_change_percentage_24h} />
                    <PerformanceMetric label="7d" value={marketData?.price_change_percentage_7d} />
                    <PerformanceMetric label="30d" value={marketData?.price_change_percentage_30d} />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="glassmorphic-card" title={<span style={{color: '#fff'}}>Supply Integrity</span>}>
                  <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>CIRCULATING VS MAX SUPPLY</Text>
                  <div style={{ margin: '20px 0' }}>
                    <Progress 
                      percent={Number((marketData?.circulating_supply / (marketData?.max_supply || marketData?.total_supply) * 100).toFixed(2))} 
                      strokeColor={{ '0%': 'var(--accent-primary)', '100%': 'var(--accent-tertiary)' }}
                      trailColor="rgba(255,255,255,0.05)"
                      strokeWidth={10}
                    />
                  </div>
                  <Row justify="space-between">
                    <Col><Text style={{color: 'var(--text-secondary)'}}>Max: {millify(marketData?.max_supply || 0)}</Text></Col>
                    <Col><Text style={{color: 'var(--text-secondary)'}}>Circ: {millify(marketData?.circulating_supply || 0)}</Text></Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* CALCULATOR: Special Border Glow */}
            <Card 
              className="glassmorphic-card" 
              style={{ marginTop: '16px', border: '1px solid rgba(37, 99, 235, 0.4)' }}
              title={<span style={{color: '#fff'}}><RocketOutlined /> Profit Projection</span>}
            >
              <Row align="middle" gutter={32}>
                <Col xs={24} md={12}>
                  <Text style={{ color: 'var(--text-secondary)' }}>Target Multiplier: <span style={{ color: 'var(--accent-tertiary)', fontWeight: 'bold' }}>{whatIfMultiplier}x ATH</span></Text>
                  <Slider min={0.5} max={10} step={0.5} value={whatIfMultiplier} onChange={setWhatIfMultiplier} />
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '15px', borderRadius: '12px', border: '1px dashed var(--accent-primary)' }}>
                    <Row justify="space-between">
                      <Text style={{color: 'var(--text-secondary)'}}>Projected Price:</Text>
                      <Text style={{color: '#fff', fontWeight: '800'}}>${((marketData?.ath?.usd || 0) * whatIfMultiplier).toLocaleString()}</Text>
                    </Row>
                    <Row justify="space-between" style={{ marginTop: '8px' }}>
                      <Text style={{color: 'var(--text-secondary)'}}>Potential Gain:</Text>
                      <Text style={{color: '#10b981', fontWeight: '800'}}>
                        {(((marketData?.ath?.usd || 0) * whatIfMultiplier / (marketData?.current_price?.usd || 1) - 1) * 100).toFixed(0)}%
                      </Text>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="AI Sentiment" key="2">
            <AISentiment coinDetails={coinDetails} visible={visible} onSentimentUpdate={setAiSentiment} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Whale Watch" key="3">
            <WhaleWatch coinData={coinDetails} coinId={coinId} aiSentiment={aiSentiment} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CoinDetails;