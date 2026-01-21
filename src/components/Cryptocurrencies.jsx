import React, { useState, useMemo, useEffect } from "react";
import millify from "millify";

import { Card, Input, Alert, Spin } from "antd";

import { useGetCryptosQuery } from "../services/coinGeckoApi";
import CoinDetails from "./CoinDetails";

const Cryptocurrencies = ({ simplified, limit = 100, showAll }) => {
  const displayLimit = limit;
  const { data: cryptosList, isFetching, error } = useGetCryptosQuery({ limit: displayLimit });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Reset search when switching between show all and show less
  useEffect(() => {
    if (!showAll) {
      setSearchTerm("");
    }
  }, [showAll]);

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
        <p style={{ marginTop: 20, color: '#fff' }}>Loading cryptocurrencies...</p>
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

  const handleCoinClick = (coinId) => {
    setSelectedCoin(coinId);
    setDetailsVisible(true);
  };

  return (
    <>
      {!simplified && (
        <div className="search-crypto">
          <Input
            placeholder="Search for Cryptocurrency"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            size="large"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: '100%'
            }}
          />
        </div>
      )}
      
      <div className="crypto-card-container">
        {cryptos && cryptos.length > 0 ? (
          cryptos.map((currency) => (
            <Card
              key={currency.id}
              className="glassmorphic-card crypto-card"
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
              <p style={{ marginBottom: 8 }}>
                Price: ${currency.current_price ? millify(currency.current_price) : 'N/A'}
              </p>
              <p style={{ marginBottom: 8 }}>
                Market Cap: ${currency.market_cap ? millify(currency.market_cap) : 'N/A'}
              </p>
              <p style={{ marginBottom: 0 }}>
                24h Change: <span style={{ 
                  color: (currency.price_change_percentage_24h || 0) >= 0 ? '#52c41a' : '#f5222d',
                  fontWeight: 'bold'
                }}>
                  {currency.price_change_percentage_24h ? currency.price_change_percentage_24h.toFixed(2) : '0.00'}%
                </span>
              </p>
            </Card>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <Alert
              message="No cryptocurrencies found"
              description="Try adjusting your search term"
              type="info"
              showIcon
            />
          </div>
        )}
      </div>

      <CoinDetails
        coinId={selectedCoin}
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
      />
    </>
  );
};

export default Cryptocurrencies;