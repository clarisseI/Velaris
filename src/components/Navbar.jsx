import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing['2xl']} 60px;
  background: ${theme.gradients.blue};
  border-radius: 0 0 ${theme.borderRadius.xl} ${theme.borderRadius.xl};
  margin-bottom: ${theme.spacing['3xl']};
  flex-shrink: 0;
`;

const LogoLink = styled(Link)`
  color: ${theme.colors.info};
  text-decoration: none;
  
  &:hover {
    color: ${theme.colors.info};
  }
`;

const Navbar = () => {
  return (
    <Header>
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
    </Header>
  );
};

export default Navbar;