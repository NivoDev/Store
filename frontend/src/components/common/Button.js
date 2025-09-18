import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

// Button variants
const buttonVariants = {
  primary: css`
    background: ${theme.colors.gradients.button};
    color: white;
    border: none;
    box-shadow: ${theme.shadows.neon};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.gradients.hover};
      box-shadow: ${theme.shadows.neonHover};
      transform: translateY(-2px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
  
  secondary: css`
    background: transparent;
    color: ${theme.colors.primary[400]};
    border: 2px solid ${theme.colors.primary[500]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary[500]};
      color: white;
      box-shadow: ${theme.shadows.neon};
    }
  `,
  
  ghost: css`
    background: transparent;
    color: ${theme.colors.dark[300]};
    border: 1px solid ${theme.colors.dark[700]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.dark[800]};
      color: ${theme.colors.dark[100]};
      border-color: ${theme.colors.dark[600]};
    }
  `,
  
  danger: css`
    background: ${theme.colors.error};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #dc2626;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
    }
  `,
  
  neon: css`
    background: transparent;
    color: ${theme.colors.neon.cyan};
    border: 2px solid ${theme.colors.neon.cyan};
    text-shadow: 0 0 10px ${theme.colors.neon.cyan};
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    
    &:hover:not(:disabled) {
      background: ${theme.colors.neon.cyan};
      color: ${theme.colors.dark[950]};
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
    }
  `
};

// Size variants
const sizeVariants = {
  sm: css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    font-size: ${theme.typography.sizes.sm};
    min-height: 36px;
  `,
  
  md: css`
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.sizes.base};
    min-height: 44px;
  `,
  
  lg: css`
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.typography.sizes.lg};
    min-height: 52px;
  `,
  
  xl: css`
    padding: ${theme.spacing[5]} ${theme.spacing[10]};
    font-size: ${theme.typography.sizes.xl};
    min-height: 60px;
  `
};

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.typography.fonts.body};
  font-weight: ${theme.typography.weights.semibold};
  text-decoration: none;
  cursor: pointer;
  transition: all ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[400]};
    outline-offset: 2px;
  }
  
  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }
  
  &:active:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }
  
  /* Loading spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Apply variants */
  ${props => buttonVariants[props.variant || 'primary']}
  ${props => sizeVariants[props.size || 'md']}
  
  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Icon only */
  ${props => props.iconOnly && css`
    padding: ${theme.spacing[3]};
    min-width: 44px;
    aspect-ratio: 1;
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  iconOnly = false,
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props 
}) => {
  const motionProps = {
    whileTap: !disabled && !loading ? { scale: 0.98 } : {},
    whileHover: !disabled && !loading ? { scale: 1.02 } : {},
    transition: { type: "spring", stiffness: 400, damping: 17 }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      className={className}
      {...motionProps}
      {...props}
    >
      {loading ? (
        <>
          <div className="spinner" />
          Loading...
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button;
