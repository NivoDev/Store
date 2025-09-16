import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';
import apiService from '../services/api';

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

const OrderDetails = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[4]} 0;
  text-align: left;
`;

const OrderDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[2]};
  
  &:last-child {
    margin-bottom: 0;
    font-weight: ${theme.typography.weights.semibold};
    color: ${theme.colors.primary[400]};
  }
`;

const GuestEmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  const handleVerification = async (verificationToken) => {
    try {
      const result = await apiService.verifyGuestEmail(verificationToken);
      if (result.success) {
        setVerificationStatus('success');
        setOrderData(result.data);
        // Redirect to checkout after 3 seconds
        setTimeout(() => {
          navigate('/checkout', { 
            state: { 
              guestOrder: result.data,
              fromEmailVerification: true 
            }
          });
        }, 3000);
      } else {
        setVerificationStatus('error');
        setError(result.error || 'Email verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setError('Email verification failed. Please try again.');
    }
  };

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
          showDetails: false
        };
      
      case 'success':
        return {
          icon: <FiCheckCircle size={40} />,
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You will be redirected to complete your checkout shortly.',
          showDetails: true
        };
      
      case 'error':
        return {
          icon: <FiXCircle size={40} />,
          title: 'Verification Failed',
          message: error || 'The verification link is invalid or has expired.',
          showDetails: false
        };
      
      default:
        return {
          icon: <FiMail size={40} />,
          title: 'Verify Your Email',
          message: 'Please verify your email address to complete your purchase.',
          showDetails: false
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

        {statusContent.showDetails && orderData && (
          <OrderDetails>
            <OrderDetailRow>
              <span>Order Number:</span>
              <span>{orderData.order_number}</span>
            </OrderDetailRow>
            <OrderDetailRow>
              <span>Email:</span>
              <span>{orderData.guest_email}</span>
            </OrderDetailRow>
            <OrderDetailRow>
              <span>Status:</span>
              <span style={{ color: theme.colors.success }}>Email Verified</span>
            </OrderDetailRow>
          </OrderDetails>
        )}

        {verificationStatus === 'success' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/checkout', { 
              state: { 
                guestOrder: orderData,
                fromEmailVerification: true 
              }
            })}
          >
            Complete Checkout
          </Button>
        )}

        {verificationStatus === 'error' && (
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => navigate('/cart')}
          >
            Back to Cart
          </Button>
        )}
      </Card>
    </Container>
  );
};

export default GuestEmailVerificationPage;
