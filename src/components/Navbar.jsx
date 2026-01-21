import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing['2xl']} 40px;
  background: ${theme.gradients.blue};
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing['2xl']};
  flex-shrink: 0;

  @media screen and (max-width: 991px) {
    padding: ${theme.spacing['xl']} 30px;
    margin-bottom: ${theme.spacing.xl};
  }
  @media screen and (max-width: 767px) {
    padding: ${theme.spacing.lg} 20px;
    margin-bottom: ${theme.spacing.lg};
  }
  @media screen and (max-width: 575px) {
    padding: ${theme.spacing.md} 16px;
    margin-bottom: ${theme.spacing.md};
  }
  
`;

const LogoLink = styled(Link)`
  color: ${theme.colors.info};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.info};
  }
`;
const Description = styled.span`
  color: ${theme.colors.primary};
  font-family: ${theme.typography.fontFamily};
  font-weight: ${theme.typography.weights.medium};
  font-size: ${theme.typography.sizes.xl};
  margin-top: 12px;
  text-align: center;
  opacity: 0.92;
  max-width: 700px;
  display: block;
  line-height: 1.7;
  
  @media screen and (max-width: 991px) {
    font-size: ${theme.typography.sizes.lg};
    margin-top: 10px;
    max-width: 600px;
  }
  
  @media screen and (max-width: 767px) {
    font-size: ${theme.typography.sizes.md};
    margin-top: 8px;
    max-width: 500px;
    line-height: 1.6;
  }
  
  @media screen and (max-width: 575px) {
    font-size: ${theme.typography.sizes.base};
    margin-top: 6px;
    max-width: 100%;
    line-height: 1.5;
  }
  
  b {
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.info};
  }
  
  br {
    @media screen and (max-width: 575px) {
      display: none;
    }
  }
`;

const Navbar = ({ hideDescription }) => {
  return (
    <Header>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography.Title 
          level={3} 
          style={{ 
            color: theme.colors.info, 
            margin: 0, 
            fontFamily: theme.typography.fontFamily, 
            fontWeight: theme.typography.weights.extrabold 
          }}
        >
          <LogoLink to="/">Velaris</LogoLink>
        </Typography.Title>
        {!hideDescription && (
          <Description>
            AI-powered crypto insights, whale tracking, and more.
            <br />
            <b>Click any cryptocurrency</b> to see price charts, stats, and news.
            <br />
            <b>Ask our AI agent</b> anything about crypto trends, coins, or whale activity.
            <br />
            Discover, analyze, and stay ahead in the crypto world with Velaris.
          </Description>
        )}
      </div>
    </Header>
  );
};

export default Navbar;