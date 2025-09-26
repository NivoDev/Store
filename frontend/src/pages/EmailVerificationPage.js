import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle, FiXCircle, FiRefreshCw, FiUser } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.gradients.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
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
      : props.warning
        ? 'rgba(245, 158, 11, 0.1)'
        : 'rgba(59, 130, 246, 0.1)'
  };
  color: ${props => props.success 
    ? theme.colors.success 
    : props.error 
      ? theme.colors.error 
      : props.warning
        ? '#f59e0b'
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
  margin-bottom: ${theme.spacing[6]};
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[4]} 0;
  text-align: left;
`;

const UserInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[2]};
  
  &:last-child {
    margin-bottom: 0;
    font-weight: ${theme.typography.weights.semibold};
    color: ${theme.colors.primary[400]};
  }
`;

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'already_verified', 'error'
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const handleVerification = useCallback(async (verificationToken) => {
    try {
      const result = await apiService.verifyUserEmailToken(verificationToken);
      if (result.success) {
        if (result.already_verified) {
          setVerificationStatus('already_verified');
          setUserData(result.data.user);
        } else {
          setVerificationStatus('success');
          setUserData(result.data.user);
          
          // Auto-login the user if verification was successful
          if (result.data.access_token) {
            // Use the proper OAuth login function from AuthContext
            const loginResult = await loginWithOAuth(result.data.user, result.data.access_token);
            if (loginResult.success) {
              console.log('✅ User auto-logged in after email verification');
              // Redirect to profile after successful login
              setTimeout(() => {
                navigate('/profile');
              }, 2000);
            } else {
              console.error('❌ Auto-login failed after email verification');
              // Still show success but let user manually login
            }
          }
        }
      } else {
        setVerificationStatus('error');
        setError(result.error || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setError('Email verification failed. Please try again.');
    }
  }, [loginWithOAuth, navigate]);

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setVerificationStatus('error');
      setError('No verification token provided');
    }
  }, [token, handleVerification]);

  const getStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          icon: <FiRefreshCw size={40} />,
          title: 'Verifying Email...',
          message: 'Please wait while we verify your email address.',
          showUserInfo: false,
          iconType: 'default'
        };
      
      case 'success':
        return {
          icon: <FiCheckCircle size={40} />,
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You are now logged in and can access your account.',
          showUserInfo: true,
          iconType: 'success'
        };
      
      case 'already_verified':
        return {
          icon: <FiUser size={40} />,
          title: 'Already Verified',
          message: 'Your email has already been verified! You can log in to your account.',
          showUserInfo: true,
          iconType: 'warning'
        };
      
      case 'error':
        return {
          icon: <FiXCircle size={40} />,
          title: 'Verification Failed',
          message: error || 'The verification link is invalid or has expired.',
          showUserInfo: false,
          iconType: 'error'
        };
      
      default:
        return {
          icon: <FiMail size={40} />,
          title: 'Verify Your Email',
          message: 'Please verify your email address to complete your registration.',
          showUserInfo: false,
          iconType: 'default'
        };
    }
  };

  const statusContent = getStatusContent();

  const handleGoToLogin = () => {
    navigate('/');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconContainer 
          success={statusContent.iconType === 'success'}
          error={statusContent.iconType === 'error'}
          warning={statusContent.iconType === 'warning'}
        >
          {statusContent.icon}
        </IconContainer>

        <Title>{statusContent.title}</Title>
        <Message>{statusContent.message}</Message>

        {statusContent.showUserInfo && userData && (
          <UserInfo>
            <UserInfoRow>
              <span>Name:</span>
              <span>{userData.name || 'N/A'}</span>
            </UserInfoRow>
            <UserInfoRow>
              <span>Email:</span>
              <span>{userData.email || 'N/A'}</span>
            </UserInfoRow>
            <UserInfoRow>
              <span>Status:</span>
              <span style={{ color: theme.colors.success }}>Email Verified</span>
            </UserInfoRow>
          </UserInfo>
        )}

        {verificationStatus === 'success' && (
          <div style={{ display: 'flex', gap: theme.spacing[3], justifyContent: 'center' }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoToLogin}
            >
              Go to Home
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGoToProfile}
            >
              View Profile
            </Button>
          </div>
        )}

        {verificationStatus === 'already_verified' && (
          <div style={{ display: 'flex', gap: theme.spacing[3], justifyContent: 'center' }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoToLogin}
            >
              Go to Home
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGoToProfile}
            >
              View Profile
            </Button>
          </div>
        )}

        {verificationStatus === 'error' && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleGoToLogin}
          >
            Go to Home
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default EmailVerificationPage;
