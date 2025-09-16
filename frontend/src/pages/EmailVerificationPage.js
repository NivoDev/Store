import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

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
  margin-bottom: ${theme.spacing[6]};
`;

const ResendSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin-top: ${theme.spacing[6]};
`;

const ResendTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[100]};
  margin-bottom: ${theme.spacing[3]};
`;

const ResendMessage = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const EmailVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerification, isVerifyingEmail, isResendingVerification, verificationMessage, error } = useAuth();
  
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get email from location state if available
    if (location.state?.email) {
      setUserEmail(location.state.email);
    }

    // If we have a token, verify it
    if (token) {
      handleVerification(token);
    }
  }, [token, location.state]);

  const handleVerification = async (verificationToken) => {
    try {
      const result = await verifyEmail(verificationToken);
      if (result.success) {
        setVerificationStatus('success');
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      // If no email available, redirect to login
      navigate('/login');
      return;
    }

    try {
      await resendVerification(userEmail);
    } catch (error) {
      console.error('Resend verification error:', error);
    }
  };

  const getStatusContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          icon: <FiRefreshCw size={40} />,
          title: 'Verifying Email...',
          message: 'Please wait while we verify your email address.',
          showResend: false
        };
      
      case 'success':
        return {
          icon: <FiCheckCircle size={40} />,
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You will be redirected to your profile shortly.',
          showResend: false
        };
      
      case 'error':
        return {
          icon: <FiXCircle size={40} />,
          title: 'Verification Failed',
          message: error || 'The verification link is invalid or has expired. Please request a new verification email.',
          showResend: true
        };
      
      default:
        return {
          icon: <FiMail size={40} />,
          title: 'Email Verification',
          message: 'Please check your email and click the verification link.',
          showResend: true
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IconContainer 
          success={verificationStatus === 'success'}
          error={verificationStatus === 'error'}
        >
          {statusContent.icon}
        </IconContainer>

        <Title>{statusContent.title}</Title>
        <Message>{statusContent.message}</Message>

        {verificationMessage && (
          <Message style={{ color: theme.colors.success, marginBottom: theme.spacing[4] }}>
            {verificationMessage}
          </Message>
        )}

        {statusContent.showResend && (
          <ResendSection>
            <ResendTitle>Need a new verification email?</ResendTitle>
            <ResendMessage>
              Click the button below to resend the verification email to your inbox.
            </ResendMessage>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              loading={isResendingVerification}
              onClick={handleResendVerification}
            >
              {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </ResendSection>
        )}

        {verificationStatus === 'success' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/profile')}
          >
            Go to Profile
          </Button>
        )}

        {verificationStatus === 'error' && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default EmailVerificationPage;
