import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiSearch,
  FiMusic,
  FiDisc,
  FiMic
} from 'react-icons/fi';
import { theme } from '../../theme';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${theme.zIndex.sticky};
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
    height: 70px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  text-decoration: none;
  color: ${theme.colors.dark[50]};
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: ${theme.colors.gradients.neon};
    border-radius: ${theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: ${theme.shadows.neon};
  }
  
  .logo-text {
    background: ${theme.colors.gradients.neon};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  &:hover .logo-icon {
    box-shadow: ${theme.shadows.neonHover};
    animation: neonGlow 0.5s ease-in-out;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.dark[300]};
  text-decoration: none;
  font-weight: ${theme.typography.weights.medium};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  position: relative;
  
  &:hover {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.1);
  }
  
  &.active {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.15);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 2px;
      background: ${theme.colors.gradients.neon};
      border-radius: ${theme.borderRadius.full};
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const SearchButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.1);
  }
`;

const CartButton = styled(motion.button)`
  position: relative;
  background: transparent;
  border: none;
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.1);
  }
  
  .cart-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: ${theme.colors.gradients.neon};
    color: white;
    font-size: ${theme.typography.sizes.xs};
    font-weight: ${theme.typography.weights.bold};
    padding: 2px 6px;
    border-radius: ${theme.borderRadius.full};
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${theme.shadows.neon};
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing[6]};
  
  @media (min-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  color: ${theme.colors.dark[300]};
  text-decoration: none;
  font-weight: ${theme.typography.weights.medium};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.1);
  }
  
  &.active {
    color: ${theme.colors.primary[400]};
    background: rgba(14, 165, 233, 0.15);
  }
`;

const MobileActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.dark[800]};
  padding-top: ${theme.spacing[6]};
`;

const Header = ({ onAuthClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/', label: 'Home', icon: FiMusic },
    { path: '/sample-packs', label: 'Sample Packs', icon: FiDisc },
    { path: '/midi-packs', label: 'MIDI Packs', icon: FiMusic },
    { path: '/acapellas', label: 'Acapellas', icon: FiMic }
  ];

  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <div className="logo-icon">
            <FiMusic size={20} />
          </div>
          <span className="logo-text">Guerrilla</span>
        </Logo>

        <DesktopNav>
          <NavLinks>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={isActiveLink(item.path) ? 'active' : ''}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </NavLinks>
        </DesktopNav>

        <RightSection>
          <SearchButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSearch size={20} />
          </SearchButton>

          <CartButton
            onClick={handleCartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.div
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {itemCount}
              </motion.div>
            )}
          </CartButton>

          {isAuthenticated ? (
            <Button variant="ghost" size="sm">
              <FiUser size={16} />
              {user?.name || 'Profile'}
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={onAuthClick}>
              Sign In
            </Button>
          )}

          <MobileMenuButton
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </RightSection>
      </Nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MobileNavLinks>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <MobileNavLink
                    key={item.path}
                    to={item.path}
                    className={isActiveLink(item.path) ? 'active' : ''}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    {item.label}
                  </MobileNavLink>
                );
              })}
            </MobileNavLinks>

            <MobileActions>
              <Button variant="ghost" fullWidth>
                <FiSearch size={16} />
                Search Products
              </Button>
              
              {isAuthenticated ? (
                <Button variant="secondary" fullWidth>
                  <FiUser size={16} />
                  {user?.name || 'Profile'}
                </Button>
              ) : (
                <Button variant="primary" fullWidth onClick={onAuthClick}>
                  Sign In
                </Button>
              )}
            </MobileActions>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
