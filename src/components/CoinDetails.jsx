import React, { useState } from 'react';
import { Modal, Card, Row, Col, Statistic, Tag, Typography, Tabs, Slider, Progress } from 'antd';
import { RiseOutlined, FallOutlined, ThunderboltOutlined, RocketOutlined, TrophyOutlined, LineChartOutlined, FireOutlined } from '@ant-design/icons';
import millify from 'millify';
import { useGetCryptoDetailsQuery } from '../services/coinGeckoApi';
import WhaleWatch from './WhaleWatch';
import AISentiment from './AISentiment';
import { LoadingContainer, FlexContainer, Text as StyledText} from '../styles/components';
import { theme } from '../styles/theme';

const { Title, Text } = Typography;

const CoinDetails = ({ coinId, visible, onClose }) => {
  const { data: coinDetails, isFetching } = useGetCryptoDetailsQuery(coinId, { skip: !visible });
  const [whatIfMultiplier, setWhatIfMultiplier] = useState(1);
  const [aiSentiment, setAiSentiment] = useState(null);

  if (isFetching) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} width={1200} centered>
        <LoadingContainer padding={theme.spacing['3xl']}>
          <div className="spinner" />
          <StyledText size="lg" color="primary" margin="20px 0 0 0">Loading coin details...</StyledText>
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
      width={1100}
      style={{ top: 10 }}
      bodyStyle={{ padding: '0', height: 'calc(100vh - 40px)', overflowY: 'auto', background: theme.gradients.lightBlue }}
      closeIcon={<span style={{ color: theme.colors.primary, fontSize: theme.typography.sizes['2xl'], fontWeight: theme.typography.weights.bold }}>×</span>}
    >
      {/* Header Section */}
      <div style={{ 
        background: theme.gradients.purple,
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.lg,
        boxShadow: theme.shadows.md
      }}>
        <img 
          src={coinDetails.image?.large} 
          alt={coinDetails.name} 
          style={{ width: 50, height: 50, borderRadius: '50%', border: `3px solid ${theme.colors.primary}`, boxShadow: theme.shadows.sm }} 
        />
        <div style={{ flex: 1 }}>
          <Title level={3} style={{ margin: 0, color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: theme.typography.weights.bold, fontSize: theme.typography.sizes['2xl'] }}>
            {coinDetails.name}
          </Title>
          <FlexContainer align="center" gap={theme.spacing.sm} style={{ marginTop: '4px' }}>
            <Text style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.md, fontFamily: theme.typography.fontFamily, fontWeight: theme.typography.weights.semibold }}>
              {coinDetails.symbol?.toUpperCase()}
            </Text>
            <Tag color="gold" icon={<TrophyOutlined />} style={{ fontSize: theme.typography.sizes.xs, fontWeight: theme.typography.weights.semibold, padding: '2px 8px', margin: 0 }}>
              #{coinDetails.market_cap_rank}
            </Tag>
          </FlexContainer>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Title level={2} style={{ margin: 0, color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: theme.typography.weights.bold, fontSize: theme.typography.sizes['3xl'] }}>
            ${marketData?.current_price?.usd?.toLocaleString()}
          </Title>
          <Tag 
            color={priceChange24h >= 0 ? 'success' : 'error'}
            style={{ fontSize: theme.typography.sizes.sm, padding: '4px 10px', marginTop: '4px', fontWeight: theme.typography.weights.bold }}
            icon={priceChange24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
          >
            {priceChange24h?.toFixed(2)}% (24h)
          </Tag>
        </div>
      </div>

      <div style={{ padding: `${theme.spacing.md} ${theme.spacing.lg}` }}>
        <Tabs defaultActiveKey="1" size="small">
          <Tabs.TabPane tab={<span style={{ fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.semibold }}>Overview</span>} key="1">
            {/* Quick Stats */}
            <Row gutter={[12, 12]} style={{ marginBottom: theme.spacing.md }}>
              <Col xs={12} sm={6}>
                <Card size="small" bodyStyle={{ padding: theme.spacing.sm }} style={{ textAlign: 'center', borderRadius: theme.borderRadius.md, background: theme.gradients.purple, border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.xs }}>Market Cap</span>}
                    value={marketData?.market_cap?.usd}
                    formatter={(value) => `$${millify(value)}`}
                    valueStyle={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fontFamily }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" bodyStyle={{ padding: theme.spacing.sm }} style={{ textAlign: 'center', borderRadius: theme.borderRadius.md, background: theme.gradients.pink, border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.xs }}>24h Volume</span>}
                    value={marketData?.total_volume?.usd}
                    formatter={(value) => `$${millify(value)}`}
                    valueStyle={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fontFamily }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" bodyStyle={{ padding: theme.spacing.sm }} style={{ textAlign: 'center', borderRadius: theme.borderRadius.md, background: theme.gradients.cyan, border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.xs }}>24h High</span>}
                    value={marketData?.high_24h?.usd}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fontFamily }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" bodyStyle={{ padding: theme.spacing.sm }} style={{ textAlign: 'center', borderRadius: theme.borderRadius.md, background: theme.gradients.yellow, border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: theme.colors.muted, fontSize: theme.typography.sizes.xs }}>24h Low</span>}
                    value={marketData?.low_24h?.usd}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, fontFamily: theme.typography.fontFamily }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Price Changes */}
            <Card bodyStyle={{ padding: theme.spacing.md }} title={<span style={{ fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.bold }}><LineChartOutlined /> Price Performance</span>} style={{ marginBottom: theme.spacing.md, borderRadius: theme.borderRadius.md, background: theme.gradients.orange, border: 'none' }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: theme.spacing.sm, background: theme.colors.cardBg, borderRadius: theme.borderRadius.sm }}>
                    <Text type="secondary" style={{ fontSize: theme.typography.sizes.xs, fontWeight: theme.typography.weights.semibold }}>1H</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: theme.typography.sizes['2xl'],
                          fontWeight: theme.typography.weights.bold,
                          fontFamily: theme.typography.fontFamily,
                          color: (marketData?.price_change_percentage_1h || 0) >= 0 ? theme.colors.success : theme.colors.error
                        }}
                      >
                        {(marketData?.price_change_percentage_1h || 0) >= 0 ? '+' : ''}
                        {marketData?.price_change_percentage_1h?.toFixed(2) || '0.00'}%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(82, 138, 177, 0.7)', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>7D</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '18px',
                          fontWeight: 800,
                          fontFamily: 'Inter',
                          color: (marketData?.price_change_percentage_7d || 0) >= 0 ? '#52c41a' : '#f5222d'
                        }}
                      >
                        {(marketData?.price_change_percentage_7d || 0) >= 0 ? '+' : ''}
                        {marketData?.price_change_percentage_7d?.toFixed(2) || '0.00'}%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(141, 173, 224, 0.7)', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600 }}>30D</Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '18px',
                          fontWeight: 800,
                          fontFamily: 'Inter',
                          color: (marketData?.price_change_percentage_30d || 0) >= 0 ? '#52c41a' : '#f5222d'
                        }}
                      >
                        {(marketData?.price_change_percentage_30d || 0) >= 0 ? '+' : ''}
                        {marketData?.price_change_percentage_30d?.toFixed(2) || '0.00'}%
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Supply Info */}
            <Card bodyStyle={{ padding: '12px' }} title={<span style={{ fontSize: '13px', fontWeight: 700 }}><FireOutlined /> Supply</span>} style={{ marginBottom: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: 'none' }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>Circulating</Text>
                  <div><Text strong style={{ fontSize: '14px', fontFamily: 'Inter', fontWeight: 700 }}>{millify(marketData?.circulating_supply || 0)}</Text></div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>Total</Text>
                  <div><Text strong style={{ fontSize: '14px', fontFamily: 'Inter', fontWeight: 700 }}>{marketData?.total_supply ? millify(marketData.total_supply) : '∞'}</Text></div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>Max</Text>
                  <div><Text strong style={{ fontSize: '14px', fontFamily: 'Inter', fontWeight: 700 }}>{marketData?.max_supply ? millify(marketData.max_supply) : '∞'}</Text></div>
                </Col>
              </Row>
              {marketData?.circulating_supply && marketData?.max_supply && (
                <div style={{ marginTop: '12px' }}>
                  <Progress 
                    percent={Number((marketData.circulating_supply / marketData.max_supply * 100).toFixed(2))} 
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    strokeWidth={8}
                    size="small"
                  />
                </div>
              )}
            </Card>

            {/* All-Time Stats */}
            <Card bodyStyle={{ padding: '12px' }} title={<span style={{ fontSize: '13px', fontWeight: 700 }}>All-Time</span>} style={{ marginBottom: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', border: 'none' }}>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <div style={{ padding: '12px', background: 'rgba(173, 208, 228, 0.7)', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>ATH</Text>
                    <div><Text strong style={{ fontSize: '16px', color: '#52c41a', fontFamily: 'Inter', fontWeight: 800 }}>${marketData?.ath?.usd?.toLocaleString()}</Text></div>
                    <Text type="secondary" style={{ fontSize: '9px' }}>
                      {new Date(marketData?.ath_date?.usd).toLocaleDateString()}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px', background: 'rgba(106, 80, 80, 0.7)', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '10px', fontWeight: 600 }}>ATL</Text>
                    <div><Text strong style={{ fontSize: '16px', color: '#f5222d', fontFamily: 'Inter', fontWeight: 800 }}>${marketData?.atl?.usd?.toLocaleString()}</Text></div>
                    <Text type="secondary" style={{ fontSize: '9px' }}>
                      {new Date(marketData?.atl_date?.usd).toLocaleDateString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* What If Calculator */}
            <Card 
              title={<span style={{ fontSize: '13px', fontWeight: 700 }}><RocketOutlined /> What If Calculator</span>}
              style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', border: 'none' }}
              bodyStyle={{ padding: '12px' }}
            >
              <Text style={{ fontSize: '11px', color: '#fff', display: 'block', marginBottom: '8px' }}>
                What if {coinDetails.name} reaches {whatIfMultiplier}x ATH?
              </Text>
              <Slider
                min={0.5}
                max={5}
                step={0.1}
                value={whatIfMultiplier}
                onChange={setWhatIfMultiplier}
                marks={{
                  0.5: { style: { fontSize: '10px' }, label: '0.5x' },
                  1: { style: { fontSize: '10px' }, label: 'ATH' },
                  2: { style: { fontSize: '10px' }, label: '2x' },
                  3: { style: { fontSize: '10px' }, label: '3x' },
                  5: { style: { fontSize: '10px' }, label: '5x' }
                }}
                style={{ marginBottom: '12px' }}
              />
              <Row gutter={12}>
                <Col span={12}>
                  <div style={{ padding: '8px', background: 'rgba(102, 67, 67, 0.9)', borderRadius: '8px', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '9px', display: 'block' }}>Price</Text>
                    <Text strong style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 800 }}>
                      ${((marketData?.ath?.usd || 0) * whatIfMultiplier).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '8px', background: 'rgba(130, 148, 187, 0.9)', borderRadius: '8px', textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '9px', display: 'block' }}>Gain</Text>
                    <Text strong style={{ fontSize: '14px', color: '#52c41a', fontWeight: 800 }}>
                      {(((marketData?.ath?.usd || 0) * whatIfMultiplier / (marketData?.current_price?.usd || 1) - 1) * 100).toFixed(0)}%
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span style={{ fontSize: '13px', fontWeight: 600 }}><ThunderboltOutlined /> AI Sentiment</span>} key="2">
            <AISentiment coinDetails={coinDetails} visible={visible} onSentimentUpdate={setAiSentiment} />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span style={{ fontSize: '13px', fontWeight: 600 }}>🐋 Whale Watch</span>} key="3">
            <WhaleWatch coinData={coinDetails} coinId={coinId} aiSentiment={aiSentiment} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CoinDetails;