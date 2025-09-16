'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '@/theme';

const HeaderContainer = styled.header`
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.header};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  text-decoration: none;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[8]};
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.dark[300]};
  text-decoration: none;
  font-weight: ${theme.typography.weights.medium};
  transition: color 150ms ease-in-out;

  &:hover {
    color: ${theme.colors.dark[100]};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  align-items: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  font-weight: ${theme.typography.weights.medium};
  transition: all 150ms ease-in-out;
  cursor: pointer;

  ${({ $variant = 'secondary' }) =>
    $variant === 'primary'
      ? `
        background: ${theme.colors.gradients.button};
        color: white;
        border: none;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.lg};
        }
      `
      : `
        background: transparent;
        color: ${theme.colors.dark[300]};
        border: 1px solid ${theme.colors.dark[600]};
        
        &:hover {
          color: ${theme.colors.dark[100]};
          border-color: ${theme.colors.dark[500]};
        }
      `}
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <Logo href="/">Atomic Rose Tools</Logo>
        
        <NavLinks>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/sample-packs">Sample Packs</NavLink>
          <NavLink href="/midi-packs">MIDI Packs</NavLink>
          <NavLink href="/acapellas">Acapellas</NavLink>
        </NavLinks>

        <AuthButtons>
          <Button $variant="secondary">Sign In</Button>
          <Button $variant="primary">Sign Up</Button>
        </AuthButtons>
      </Nav>
    </HeaderContainer>
  );
}
