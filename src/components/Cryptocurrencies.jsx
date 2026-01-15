import React, { useState, useMemo } from "react";
import millify from "millify";

import { Card, Row, Col, Input, Alert, Spin } from "antd";

import { useGetCryptosQuery } from "../services/coinGeckoApi";
import CoinDetails from "./CoinDetails";

const Cryptocurrencies = ({ simplified, limit = 100 }) => {
  const displayLimit = limit;
  const { data: cryptosList, isFetching, error } = useGetCryptosQuery({ limit: displayLimit });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Use useMemo for performance optimization
  const cryptos = useMemo(() => {
    if (!cryptosList) return [];
    
    return cryptosList.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cryptosList, searchTerm]);

  if (isFetching) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Loading cryptocurrencies...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert
        message="Error Loading Cryptocurrencies"
        description={`Failed to fetch cryptocurrency data: ${error.error || 'Please try again later'}`}
        type="error"
        showIcon
      />
    );
  }
  
  console.log("Cryptos data:", cryptosList);

  const handleCoinClick = (coinId) => {
    setSelectedCoin(coinId);
    setDetailsVisible(true);
  };

  return (
    <>
      {!simplified && (
        <div className="search-crypto" style={{ marginBottom: 20 }}>
          <Input
            placeholder="Search for Cryptocurrency"
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            size="large"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }}
          />
        </div>
      )}
      <Row gutter={[16, 16]} className="crypto-card-container">
        {cryptos && cryptos.length > 0 ? (
          cryptos.map((currency) => (
            <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.id}>
              <Card
                className="glassmorphic-card"
                title={`${currency.market_cap_rank || 'N/A'}. ${currency.name}`}
                extra={
                  <img
                    className="crypto-image"
                    src={currency.image}
                    alt={`${currency.name} logo`}
                    style={{ width: 35, height: 35 }}
                    loading="lazy"
                  />
                }
                hoverable
                onClick={() => handleCoinClick(currency.id)}
                aria-label={`${currency.name} cryptocurrency card - click for details`}
                style={{ cursor: 'pointer' }}
              >
                <p style={{ color: '#000', marginBottom: 8 }}>Price: ${currency.current_price ? millify(currency.current_price) : 'N/A'}</p>
                <p style={{ color: '#000', marginBottom: 8 }}>Market Cap: ${currency.market_cap ? millify(currency.market_cap) : 'N/A'}</p>
                <p style={{ color: '#000' }}>24h Change: <span style={{ 
                  color: (currency.price_change_percentage_24h || 0) >= 0 ? '#52c41a' : '#f5222d',
                  fontWeight: 'bold'
                }}>
                  {currency.price_change_percentage_24h ? currency.price_change_percentage_24h.toFixed(2) : '0.00'}%
                </span></p>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Alert
              message="No cryptocurrencies found"
              description="Try adjusting your search term"
              type="info"
              showIcon
            />
          </Col>
        )}
      </Row>

      <CoinDetails
        coinId={selectedCoin}
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
      />
    </>
  );
};

export default Cryptocurrencies;
