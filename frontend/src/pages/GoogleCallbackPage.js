import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { theme } from '../theme';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.gradients.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[6]};
`;

const Card = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[8]};
  width: 100%;
  max-width: 480px;
  text-align: center;
  box-shadow: ${theme.shadows['2xl']};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto ${theme.spacing[6]};
  background: ${props => props.success 
    ? 'rgba(34, 197, 94, 0.1)' 
    : props.error 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(59, 130, 246, 0.1)'
  };
  color: ${props => props.success 
    ? theme.colors.success 
    : props.error 
      ? theme.colors.error 
      : theme.colors.primary[500]
  };
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const Message = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[8]};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top: 3px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        // Check for OAuth errors
        if (error) {
          setStatus('error');
          setMessage('Google sign-in was cancelled or failed. Please try again.');
          return;
        }
        
        if (!code) {
          setStatus('error');
          setMessage('Invalid authorization code. Please try signing in again.');
          return;
        }
        
        // Verify state parameter for CSRF protection
        const storedState = localStorage.getItem('google_oauth_state');
        if (state !== storedState) {
          setStatus('error');
          setMessage('Invalid state parameter. Please try signing in again.');
          return;
        }
        
        // Clean up stored state
        localStorage.removeItem('google_oauth_state');
        
        // Call backend to handle the OAuth callback
        const result = await apiService.handleGoogleCallback(code, state);
        
        if (result.success) {
          // Update auth context
          login(result.data.user, result.data.access_token);
          
          setStatus('success');
          setMessage('Successfully signed in with Google!');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(result.error || 'Failed to sign in with Google. Please try again.');
        }
        
      } catch (error) {
        console.error('Google callback error:', error);
        setStatus('error');
        setMessage('An error occurred during sign-in. Please try again.');
      }
    };
    
    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  if (status === 'loading') {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconContainer>
            <FiLoader size={40} />
          </IconContainer>
          <Title>Signing you in...</Title>
          <Message>
            Please wait while we complete your Google sign-in.
          </Message>
          <LoadingSpinner />
        </Card>
      </Container>
    );
  }

  if (status === 'success') {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconContainer success>
            <FiCheckCircle size={40} />
          </IconContainer>
          <Title>Welcome!</Title>
          <Message>
            You have successfully signed in with Google. Redirecting you to the home page...
          </Message>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconContainer error>
          <FiXCircle size={40} />
        </IconContainer>
        <Title>Sign-in Failed</Title>
        <Message>
          {message}
        </Message>
        <div style={{ marginTop: theme.spacing[6] }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: theme.colors.primary[500],
              color: theme.colors.dark[50],
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = theme.colors.primary[600];
            }}
            onMouseOut={(e) => {
              e.target.style.background = theme.colors.primary[500];
            }}
          >
            Try Again
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default GoogleCallbackPage;
