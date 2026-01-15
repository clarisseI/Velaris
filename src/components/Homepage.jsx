import React, { useState } from "react";
import millify from "millify";
import { Typography, Row, Col, Statistic, Alert, Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { useGetGlobalStatsQuery } from "../services/coinGeckoApi";
import Cryptocurrencies from "./Cryptocurrencies";
import Navbar from "./Navbar";
import { 
PageContainer,
StatCard,
PopoverContent,
PopoverTitle,
InfoIcon,
ToggleButton,
LoadingContainer,

  Text
} from "../styles/components";
import { theme } from "../styles/theme";

const { Title } = Typography;

const Homepage = () => {
  const { data, isFetching, error } = useGetGlobalStatsQuery();
  const globalStats = data?.data;
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  if (isFetching) {
    return (
      <LoadingContainer minHeight="100vh" flex>
        <div className="spinner" />
        <Text size="lg" color="primary" margin="20px 0 0 0">Loading global statistics...</Text>
      </LoadingContainer>
    );
  }
  
  if (error) {
    console.error('Homepage API Error:', error);
    return (
      <Alert
        message="Error Loading Data"
        description={`Unable to fetch global statistics. ${error.status || ''} CoinGecko may be rate limiting requests. Please try again in a few moments.`}
        type="error"
        showIcon
        style={{ margin: '20px', borderRadius: '16px', fontFamily: 'Inter' }}
      />
    );
  }
  
  return (
    <PageContainer>
      {/* Stats Section - Fixed Height */}
      <Navbar />
      <Row gutter={[16, 16]} style={{ marginBottom: 24, flexShrink: 0 }}>
        <Col xs={12} sm={12} md={6}>
          <div className="glassmorphic-card">
            <StatCard>
              <Popover
                content={
                  <PopoverContent>
                    This metric represents the current number of actively traded cryptocurrencies in the market. A higher count indicates growing market diversity and innovation.
                  </PopoverContent>
                }
                title={<PopoverTitle>Active Cryptocurrencies</PopoverTitle>}
                trigger="click"
                overlayStyle={{ maxWidth: 320 }}
              >
                <InfoIcon>
                  <InfoCircleOutlined />
                </InfoIcon>
              </Popover>
              <Statistic 
                title="Active Cryptocurrencies" 
                value={globalStats?.active_cryptocurrencies || 0}
                valueStyle={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: 800, fontSize: theme.typography.sizes['2xl'] }}
              />
            </StatCard>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <div className="glassmorphic-card">
            <StatCard>
              <Popover
                content={
                  <PopoverContent>
                    Total number of exchanges and trading pairs available globally. More markets typically correlate with higher liquidity and better price discovery.
                  </PopoverContent>
                }
                title={<PopoverTitle>Markets</PopoverTitle>}
                trigger="click"
                overlayStyle={{ maxWidth: 320 }}
              >
                <InfoIcon>
                  <InfoCircleOutlined />
                </InfoIcon>
              </Popover>
              <Statistic
                title="Markets"
                value={globalStats?.markets || 0}
                valueStyle={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: 800, fontSize: theme.typography.sizes['2xl'] }}
              />
            </StatCard>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <div className="glassmorphic-card">
            <StatCard>
              <Popover
                content={
                  <PopoverContent>
                    The aggregate value of all cryptocurrencies combined, measured in USD. This metric serves as a key indicator of overall market health and investor confidence.
                  </PopoverContent>
                }
                title={<PopoverTitle>Total Market Cap</PopoverTitle>}
                trigger="click"
                overlayStyle={{ maxWidth: 320 }}
              >
                <InfoIcon>
                  <InfoCircleOutlined />
                </InfoIcon>
              </Popover>
              <Statistic
                title="Total Market Cap"
                value={globalStats?.total_market_cap?.usd ? millify(globalStats.total_market_cap.usd) : "N/A"}
                prefix="$"
                valueStyle={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: 800, fontSize: theme.typography.sizes['2xl'] }}
              />
            </StatCard>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <div className="glassmorphic-card">
            <StatCard>
              <Popover
                content={
                  <PopoverContent>
                    Total USD value traded across all cryptocurrencies in the last 24 hours. High volume suggests strong market activity and can validate price movements.
                  </PopoverContent>
                }
                title={<PopoverTitle>Total 24h Volume</PopoverTitle>}
                trigger="click"
                overlayStyle={{ maxWidth: 320 }}
              >
                <InfoIcon>
                  <InfoCircleOutlined />
                </InfoIcon>
              </Popover>
              <Statistic
                title="Total 24h Volume"
                value={globalStats?.total_volume?.usd ? millify(globalStats.total_volume.usd) : "N/A"}
                prefix="$"
                valueStyle={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamily, fontWeight: 800, fontSize: theme.typography.sizes['2xl'] }}
              />
            </StatCard>
          </div>
        </Col>
      </Row>

      {/* Header - Fixed */}
      <div className="home-heading-container" style={{ flexShrink: 0 }}>
        <Title level={3} className="home-title" style={{ fontFamily: theme.typography.fontFamily, fontWeight: 800, color: theme.colors.primary }}>
          {showAll ? "Top 100 Cryptocurrencies" : "Top 12 Cryptocurrencies"}
        </Title>
        <ToggleButton onClick={handleToggle}>
          {showAll ? "Show Less" : "Show All"}
        </ToggleButton>
      </div>
      
      {/* Crypto Cards - Scrollable Area */}
      <div 
        className="crypto-scroll-container"
        style={{ 
          flex: 1, 
          overflow: 'auto',
          marginBottom: 0,
          paddingBottom: showAll ? 20 : 0
        }}
      >
        <Cryptocurrencies simplified={!showAll} limit={showAll ? 100 : 12} />
      </div>

      <div style={{
        position: 'fixed',
        bottom: theme.spacing.lg,
        left: theme.spacing.lg,
        zIndex: 100,
        color: theme.colors.info,
        fontSize: theme.typography.sizes.lg,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.weights.extrabold
      }}>
        Velaris © 2026
      </div>
    </PageContainer>
  );
};

export default Homepage;