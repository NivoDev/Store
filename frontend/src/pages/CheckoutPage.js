import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';
import Button from '../components/common/Button';
import apiService from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [guestOrder, setGuestOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    // Check if we have a guest order from email verification
    if (location.state?.guestOrder && location.state?.fromVerification) {
      setGuestOrder(location.state.guestOrder);
      setIsEmailVerified(true); // Only set verified if coming from verification flow
    } else {
      // If no guest order or not from verification, redirect to cart
      navigate('/cart');
    }
  }, [location.state, navigate]);

  const handleCompleteCheckout = async () => {
    if (!guestOrder?.verification_token) {
      setError('No verification token available');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await apiService.verifyGuestOrder(guestOrder.verification_token);
      if (result.success) {
        // Redirect to guest downloads with order data
        navigate('/guest-downloads', {
          state: {
            orderData: result.data,
            fromCheckout: true
          }
        });
      } else {
        setError(result.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!guestOrder) {
    return (
      <PageContainer>
        <Container>
          <Title>Loading...</Title>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Title>Complete Your Purchase</Title>
        
        <div style={{
          background: theme.colors.gradients.card,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing[6],
          marginBottom: theme.spacing[6]
        }}>
          <h3 style={{ 
            color: theme.colors.dark[100], 
            marginBottom: theme.spacing[4],
            fontSize: theme.typography.sizes.xl
          }}>
            Order Summary
          </h3>
          
          <div style={{ marginBottom: theme.spacing[4] }}>
            <p style={{ color: theme.colors.dark[300], marginBottom: theme.spacing[2] }}>
              <strong>Order Number:</strong> {guestOrder.order_number}
            </p>
            <p style={{ color: theme.colors.dark[300], marginBottom: theme.spacing[2] }}>
              <strong>Email:</strong> {guestOrder.guest_email}
            </p>
            <p style={{ color: theme.colors.dark[300], marginBottom: theme.spacing[2] }}>
              <strong>Items:</strong> {guestOrder.items?.length || 0} product(s)
            </p>
            <p style={{ 
              color: theme.colors.primary[400], 
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.semibold
            }}>
              <strong>Total:</strong> ${guestOrder.total_amount?.toFixed(2) || '0.00'}
            </p>
          </div>

          {isEmailVerified && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              marginBottom: theme.spacing[4]
            }}>
              <p style={{ 
                color: theme.colors.success, 
                margin: 0,
                fontSize: theme.typography.sizes.sm
              }}>
                ✅ Email verified successfully
              </p>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              marginBottom: theme.spacing[4]
            }}>
              <p style={{ 
                color: theme.colors.error, 
                margin: 0,
                fontSize: theme.typography.sizes.sm
              }}>
                ❌ {error}
              </p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isProcessing}
            onClick={handleCompleteCheckout}
          >
            {isProcessing ? 'Processing...' : 'Complete Purchase'}
          </Button>
        </div>

        <div style={{ 
          textAlign: 'center', 
          padding: theme.spacing[4],
          color: theme.colors.dark[400],
          fontSize: theme.typography.sizes.sm
        }}>
          <p>This is a demo checkout. In production, this would integrate with PayMe.io</p>
        </div>
      </Container>
    </PageContainer>
  );
};

export default CheckoutPage;
