import React, { useState } from 'react';
import { Modal, Card, Row, Col, Statistic, Spin, Tag, Typography, Tabs, Slider, Progress } from 'antd';
import { RiseOutlined, FallOutlined, ThunderboltOutlined, RocketOutlined, TrophyOutlined, LineChartOutlined, FireOutlined } from '@ant-design/icons';
import millify from 'millify';
import { useGetCryptoDetailsQuery } from '../services/coinGeckoApi';
import WhaleWatch from './WhaleWatch';
import AISentiment from './AISentiment';

const { Title, Text } = Typography;

const CoinDetails = ({ coinId, visible, onClose }) => {
  const { data: coinDetails, isFetching } = useGetCryptoDetailsQuery(coinId, { skip: !visible });
  const [whatIfMultiplier, setWhatIfMultiplier] = useState(1);
  const [aiSentiment, setAiSentiment] = useState(null);

  if (isFetching) {
    return (
      <Modal open={visible} onCancel={onClose} footer={null} width={1200} centered>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
          <p style={{ marginTop: 20, fontFamily: 'Inter', fontSize: '16px', color: '#fff' }}>Loading coin details...</p>
        </div>
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
      style={{ top: 20 }}
      bodyStyle={{ padding: '0', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      {/* Header Section */}
      <div style={{ 
        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <img 
          src={coinDetails.image?.large} 
          alt={coinDetails.name} 
          style={{ width: 72, height: 72, borderRadius: '50%', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
        />
        <div style={{ flex: 1 }}>
          <Title level={2} style={{ margin: 0, color: 'white', fontFamily: 'Inter', fontWeight: 800, fontSize: '32px' }}>
            {coinDetails.name}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.95)', fontSize: '18px', fontFamily: 'Inter', fontWeight: 600 }}>
            {coinDetails.symbol?.toUpperCase()}
          </Text>
          <div style={{ marginTop: '12px' }}>
            <Tag color="gold" icon={<TrophyOutlined />} style={{ fontSize: '14px', fontWeight: 600, padding: '6px 14px' }}>
              Rank #{coinDetails.market_cap_rank}
            </Tag>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Title level={1} style={{ margin: 0, color: 'white', fontFamily: 'Inter', fontWeight: 800, fontSize: '40px' }}>
            ${marketData?.current_price?.usd?.toLocaleString()}
          </Title>
          <Tag 
            color={priceChange24h >= 0 ? 'success' : 'error'}
            style={{ fontSize: '18px', padding: '8px 16px', marginTop: '12px', fontWeight: 700 }}
            icon={priceChange24h >= 0 ? <RiseOutlined /> : <FallOutlined />}
          >
            {priceChange24h?.toFixed(2)}% (24h)
          </Tag>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab={<span style={{ fontSize: '15px', fontWeight: 600 }}>Overview</span>} key="1">
            {/* Quick Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Market Cap</span>}
                    value={marketData?.market_cap?.usd}
                    formatter={(value) => `$${millify(value)}`}
                    valueStyle={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Inter' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>24h Volume</span>}
                    value={marketData?.total_volume?.usd}
                    formatter={(value) => `$${millify(value)}`}
                    valueStyle={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Inter' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>24h High</span>}
                    value={marketData?.high_24h?.usd}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Inter' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '16px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', border: 'none' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>24h Low</span>}
                    value={marketData?.low_24h?.usd}
                    prefix="$"
                    precision={2}
                    valueStyle={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Inter' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Price Changes */}
            <Card title={<span style={{ fontSize: '16px', fontWeight: 700 }}><LineChartOutlined /> Price Performance</span>} style={{ marginBottom: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', border: 'none' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>1 Hour</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '24px',
                          fontWeight: 800,
                          fontFamily: 'Inter',
                          color: (marketData?.price_change_percentage_1h || 0) >= 0 ? '#52c41a' : '#f5222d'
                        }}
                      >
                        {(marketData?.price_change_percentage_1h || 0) >= 0 ? '+' : ''}
                        {marketData?.price_change_percentage_1h?.toFixed(2) || '0.00'}%
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>7 Days</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '24px',
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
                  <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>30 Days</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text 
                        strong 
                        style={{ 
                          fontSize: '24px',
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
            <Card title={<span style={{ fontSize: '16px', fontWeight: 700 }}><FireOutlined /> Supply Information</span>} style={{ marginBottom: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', border: 'none' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Circulating Supply</Text>
                  <div><Text strong style={{ fontSize: '18px', fontFamily: 'Inter', fontWeight: 700 }}>{millify(marketData?.circulating_supply || 0)}</Text></div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Total Supply</Text>
                  <div><Text strong style={{ fontSize: '18px', fontFamily: 'Inter', fontWeight: 700 }}>{marketData?.total_supply ? millify(marketData.total_supply) : '∞'}</Text></div>
                </Col>
                <Col span={8}>
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Max Supply</Text>
                  <div><Text strong style={{ fontSize: '18px', fontFamily: 'Inter', fontWeight: 700 }}>{marketData?.max_supply ? millify(marketData.max_supply) : '∞'}</Text></div>
                </Col>
              </Row>
              {marketData?.circulating_supply && marketData?.max_supply && (
                <div style={{ marginTop: '24px' }}>
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>Supply Progress</Text>
                  <Progress 
                    percent={Number((marketData.circulating_supply / marketData.max_supply * 100).toFixed(2))} 
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    strokeWidth={12}
                    style={{ marginTop: '12px' }}
                  />
                </div>
              )}
            </Card>

            {/* All-Time Stats */}
            <Card title={<span style={{ fontSize: '16px', fontWeight: 700 }}>All-Time Statistics</span>} style={{ marginBottom: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', border: 'none' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>All-Time High</Text>
                    <div><Text strong style={{ fontSize: '24px', color: '#52c41a', fontFamily: 'Inter', fontWeight: 800 }}>${marketData?.ath?.usd?.toLocaleString()}</Text></div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(marketData?.ath_date?.usd).toLocaleDateString()}
                    </Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>All-Time Low</Text>
                    <div><Text strong style={{ fontSize: '24px', color: '#f5222d', fontFamily: 'Inter', fontWeight: 800 }}>${marketData?.atl?.usd?.toLocaleString()}</Text></div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(marketData?.atl_date?.usd).toLocaleDateString()}
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%) !important', border: '1px solid #f59e0b' }} bodyStyle={{ background: 'transparent' }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>ATH</span>}
                    value={marketData?.ath?.usd}
                    prefix="$"
                    formatter={(value) => millify(value)}
                    valueStyle={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={12} lg={8}>
                <Card size="small" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%) !important', border: '1px solid #f59e0b' }} bodyStyle={{ background: 'transparent' }}>
                  <Statistic
                    title="ATH"
                    value={marketData?.ath?.usd}
                    prefix="$"
                    formatter={(value) => millify(value)}
                    valueStyle={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24' }}
                  />
                </Card>
              </Col>

              {/* What If Calculator */}
              <Col span={24}>
                <Card 
                  title={<span style={{ fontSize: '16px', fontWeight: 700 }}><RocketOutlined /> What If Calculator</span>}
                  style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', border: 'none' }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <Text style={{ fontSize: '13px', color: '#fff', display: 'block', marginBottom: '12px' }}>
                    What if {coinDetails.name} reaches {whatIfMultiplier}x its All-Time High?
                  </Text>
                  <Slider
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={whatIfMultiplier}
                    onChange={setWhatIfMultiplier}
                    marks={{
                      0.5: '0.5x',
                      1: 'ATH',
                      2: '2x',
                      3: '3x',
                      5: '5x'
                    }}
                    style={{ marginBottom: '16px' }}
                  />
                  <Row gutter={12}>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Projected Price</Text>
                        <Text strong style={{ fontSize: '18px', color: '#1a1a1a', fontWeight: 800 }}>
                          ${((marketData?.ath?.usd || 0) * whatIfMultiplier).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.9)', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>Potential Gain</Text>
                        <Text strong style={{ fontSize: '18px', color: '#52c41a', fontWeight: 800 }}>
                          {(((marketData?.ath?.usd || 0) * whatIfMultiplier / (marketData?.current_price?.usd || 1) - 1) * 100).toFixed(0)}%
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span style={{ fontSize: '15px', fontWeight: 600 }}><ThunderboltOutlined /> AI Sentiment</span>} key="2">
            <AISentiment coinDetails={coinDetails} visible={visible} onSentimentUpdate={setAiSentiment} />
          </Tabs.TabPane>

          <Tabs.TabPane tab={<span style={{ fontSize: '15px', fontWeight: 600 }}>🐋 Whale Watch</span>} key="3">
            <WhaleWatch coinData={coinDetails} coinId={coinId} aiSentiment={aiSentiment} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CoinDetails;