import React, { useState } from "react";
import millify from "millify";
import { Typography, Row, Col, Statistic, Spin, Alert, Tooltip } from "antd";

import { useGetGlobalStatsQuery } from "../services/coinGeckoApi";
import Cryptocurrencies from "./Cryptocurrencies";

const { Title } = Typography;

const Homepage = ({ onShowAllChange }) => {
  const { data, isFetching, error } = useGetGlobalStatsQuery();
  const globalStats = data?.data;
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    if (onShowAllChange) {
      onShowAllChange(newShowAll);
    }
  };

  if (isFetching) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, fontFamily: 'Inter', fontSize: '16px', color: '#fff' }}>Loading global statistics...</p>
      </div>
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
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Stats Section - Fixed Height */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24, flexShrink: 0 }}>
        <Col xs={12} sm={12} md={6}>
          <Tooltip title="This metric represents the current number of actively traded cryptocurrencies in the market. A higher count indicates growing market diversity and innovation." placement="top">
            <div className="glassmorphic-card" style={{ padding: 20, textAlign: 'center', cursor: 'help' }}>
              <Statistic 
                title="Active Cryptocurrencies" 
                value={globalStats?.active_cryptocurrencies || 0}
                valueStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: '24px' }}
              />
            </div>
          </Tooltip>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Tooltip title="Total number of exchanges and trading pairs available globally. More markets typically correlate with higher liquidity and better price discovery." placement="top">
            <div className="glassmorphic-card" style={{ padding: 20, textAlign: 'center', cursor: 'help' }}>
              <Statistic
                title="Markets"
                value={globalStats?.markets || 0}
                valueStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: '24px' }}
              />
            </div>
          </Tooltip>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Tooltip title="The aggregate value of all cryptocurrencies combined, measured in USD. This metric serves as a key indicator of overall market health and investor confidence." placement="top">
            <div className="glassmorphic-card" style={{ padding: 20, textAlign: 'center', cursor: 'help' }}>
              <Statistic
                title="Total Market Cap"
                value={globalStats?.total_market_cap?.usd ? millify(globalStats.total_market_cap.usd) : "N/A"}
                prefix="$"
                valueStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: '24px' }}
              />
            </div>
          </Tooltip>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Tooltip title="Total USD value traded across all cryptocurrencies in the last 24 hours. High volume suggests strong market activity and can validate price movements." placement="top">
            <div className="glassmorphic-card" style={{ padding: 20, textAlign: 'center', cursor: 'help' }}>
              <Statistic
                title="Total 24h Volume"
                value={globalStats?.total_volume?.usd ? millify(globalStats.total_volume.usd) : "N/A"}
                prefix="$"
                valueStyle={{ color: '#fff', fontFamily: 'Inter', fontWeight: 800, fontSize: '24px' }}
              />
            </div>
          </Tooltip>
        </Col>
      </Row>

      {/* Header - Fixed */}
      <div className="home-heading-container" style={{ flexShrink: 0 }}>
        <Title level={3} className="home-title" style={{ fontFamily: 'Inter', fontWeight: 800, color: '#fff' }}>
          {showAll ? "Top 100 Cryptocurrencies" : "Top 12 Cryptocurrencies"}
        </Title>
        <span 
          onClick={handleToggle} 
          style={{ 
            cursor: 'pointer', 
            color: '#fff', 
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'Inter',
            transition: 'all 0.2s ease',
            padding: '8px 20px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'transparent';
          }}
        >
          {showAll ? "Show Less" : "Show All"}
        </span>
      </div>
      
      {/* Crypto Cards - Scrollable Area */}
      <div style={{ flex: 1, overflow: 'hidden', marginBottom: showAll ? 0 : 20 }}>
        <Cryptocurrencies simplified={!showAll} limit={showAll ? 100 : 12} />
      </div>

      {/* Footer - Only show when not showing all */}
      {!showAll && (
        <div style={{ 
          marginTop: 'auto',
          padding: '24px 60px', 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          textAlign: 'center',
          borderRadius: '20px 20px 0 0',
          flexShrink: 0
        }}>
          <Title level={4} style={{ color: 'white', fontFamily: 'Inter', fontWeight: 700, marginBottom: 12 }}>
            Velaris © 2026
          </Title>
          <Typography.Text style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '15px',
            fontFamily: 'Inter',
            fontWeight: 700
          }}>
            Built by Clarisse Umulisa
          </Typography.Text>
        </div>
      )}
    </div>
  );
};

export default Homepage;