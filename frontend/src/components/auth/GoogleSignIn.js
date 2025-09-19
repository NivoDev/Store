import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { theme } from '../../theme';
import apiService from '../../services/api';

const GoogleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: ${theme.colors.dark[50]};
  border: 1px solid ${theme.colors.dark[200]};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.dark[800]};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${theme.colors.dark[100]};
    border-color: ${theme.colors.dark[300]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid ${theme.colors.dark[800]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GoogleSignIn = ({ onSuccess, onError, disabled = false }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || disabled) return;
    
    setLoading(true);
    
    try {
      // Get Google auth URL from backend
      const result = await apiService.getGoogleAuthUrl();
      
      if (result.success) {
        // Store state for CSRF protection
        localStorage.setItem('google_oauth_state', result.data.state);
        
        // Redirect to Google OAuth
        window.location.href = result.data.auth_url;
      } else {
        throw new Error(result.error || 'Failed to initiate Google sign-in');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (onError) {
        onError(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleButton
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading || disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <IconContainer>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <FcGoogle size={20} />
        )}
      </IconContainer>
      {loading ? 'Signing in...' : 'Continue with Google'}
    </GoogleButton>
  );
};

export default GoogleSignIn;
