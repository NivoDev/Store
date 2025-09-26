import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradients.background};
  padding: ${theme.spacing[6]};
`;

const Card = styled.div`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[4]};
`;

const Message = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.md};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(14, 165, 233, 0.3);
  border-top: 3px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto ${theme.spacing[4]};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const AutoLoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAutoLogin = async () => {
      try {
        const token = searchParams.get('token');
        const redirect = searchParams.get('redirect') || '/profile';
        
        if (!token) {
          setError('No authentication token provided');
          setLoading(false);
          return;
        }

        console.log('🔄 Auto-login attempt with token:', token.substring(0, 20) + '...');
        
        // Call the auto-login API with token as query parameter
        const response = await apiService.request(`/auth/auto-login?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`, {
          method: 'GET'
        });

        if (response.access_token && response.user) {
          console.log('✅ Auto-login successful');
          
          // Store the new token
          localStorage.setItem('access_token', response.access_token);
          
          // Update auth context using OAuth login method
          await loginWithOAuth(response.user, response.access_token);
          
          // Redirect to the intended page
          console.log('🔄 Redirecting to:', redirect);
          navigate(redirect, { replace: true });
        } else {
          setError('Auto-login failed: No access token or user data received');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
        setError(error.message || 'Auto-login failed. Please try signing in manually.');
        setLoading(false);
      }
    };

    handleAutoLogin();
  }, [searchParams, navigate, loginWithOAuth]);

  if (loading) {
    return (
      <Container>
        <Card>
          <Spinner />
          <Title>Signing you in...</Title>
          <Message>Please wait while we authenticate your account.</Message>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <Title>Auto-login Failed</Title>
          <ErrorMessage>{error}</ErrorMessage>
          <Message>
            Please try signing in manually or contact support if the problem persists.
          </Message>
          <button 
            onClick={() => navigate('/#auth')}
            style={{
              background: theme.colors.primary[500],
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.semiBold,
              cursor: 'pointer',
              marginTop: theme.spacing[4]
            }}
          >
            Sign In Manually
          </button>
        </Card>
      </Container>
    );
  }

  return null;
};

export default AutoLoginPage;
