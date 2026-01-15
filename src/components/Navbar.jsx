
import { Typography } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Headers = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 5rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px 20px 0 0;
  position: relative;
  z-index: 500;

  @media only Screen and (max-width: 64em) {
    padding: 0.5rem 3rem;
  }
  @media only Screen and (max-width: 40em) {
    padding: 0.5rem 1.5rem;
  }
`;

const Logo = styled.a``;

const Navbar = () => {
  return (
    <Headers>
      <Logo>
        <Typography.Title level={3} style={{ color: '#fff', margin: 0, fontFamily: 'Inter', fontWeight: 800 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Velaris</Link>
        </Typography.Title>
      </Logo>
    </Headers>
  );
};

export default Navbar;