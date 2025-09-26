import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiDownload, FiMail, FiHome } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';

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
  max-width: 600px;
  text-align: center;
  box-shadow: ${theme.shadows['2xl']};
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  color: ${theme.colors.success};
  margin: 0 auto ${theme.spacing[6]};
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

const OrderInfo = styled.div`
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin: ${theme.spacing[6]} 0;
  text-align: left;
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[3]};
  
  &:last-child {
    margin-bottom: 0;
    font-weight: ${theme.typography.weights.semibold};
    color: ${theme.colors.primary[400]};
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: ${theme.spacing[3]};
  }
`;

const OrderLabel = styled.span`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
`;

const OrderValue = styled.span`
  color: ${theme.colors.dark[50]};
  font-weight: ${theme.typography.weights.medium};
`;

const TotalValue = styled.span`
  color: ${theme.colors.primary[400]};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
`;

const DownloadInfo = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[6]} 0;
`;

const InfoText = styled.p`
  color: ${theme.colors.success};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  margin-top: ${theme.spacing[8]};
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { orderData, orderNumber, message } = location.state || {};

  if (!orderData) {
    // Redirect to home if no order data
    navigate('/');
    return null;
  }

  const handleGoToDownloads = () => {
    if (orderData.customer.email) {
      // Redirect to guest download page with order number
      navigate('/guest-downloads', { 
        state: { orderNumber: orderNumber } 
      });
    } else {
      // Redirect to profile for authenticated users
      navigate('/profile');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SuccessIcon>
          <FiCheckCircle size={50} />
        </SuccessIcon>

        <Title>Payment Successful! 🎉</Title>
        <Message>
          {message || 'Thank you for your purchase! Your order has been processed successfully.'}
        </Message>

        {orderData && (
          <OrderInfo>
            <OrderRow>
              <OrderLabel>Order Number:</OrderLabel>
              <OrderValue>{orderNumber}</OrderValue>
            </OrderRow>
            <OrderRow>
              <OrderLabel>Customer:</OrderLabel>
              <OrderValue>{orderData.customer.firstName} {orderData.customer.lastName}</OrderValue>
            </OrderRow>
            <OrderRow>
              <OrderLabel>Email:</OrderLabel>
              <OrderValue>{orderData.customer.email}</OrderValue>
            </OrderRow>
            <OrderRow>
              <OrderLabel>Items:</OrderLabel>
              <OrderValue>{orderData.items.length} product(s)</OrderValue>
            </OrderRow>
            <OrderRow>
              <OrderLabel>Total:</OrderLabel>
              <TotalValue>${orderData.total.toFixed(2)}</TotalValue>
            </OrderRow>
          </OrderInfo>
        )}

        <DownloadInfo>
          <InfoText>
            <FiMail />
            A confirmation email with download links has been sent to your email address.
          </InfoText>
          <InfoText style={{ marginTop: theme.spacing[2] }}>
            <FiDownload />
            You can also access your downloads below.
          </InfoText>
        </DownloadInfo>

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={handleGoHome}
          >
            <FiHome />
            Go to Home
          </Button>
          <Button
            variant="primary"
            onClick={handleGoToDownloads}
          >
            <FiDownload />
            Access Downloads
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default CheckoutSuccessPage;
