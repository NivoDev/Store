import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMail, FiHome, FiDownload } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[6]};
  background: linear-gradient(135deg, ${theme.colors.dark[900]} 0%, ${theme.colors.dark[800]} 100%);
`;

const Card = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[12]};
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const SuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.success[500]}, ${theme.colors.success[600]});
  border-radius: 50%;
  margin-bottom: ${theme.spacing[6]};
  color: white;
  font-size: 40px;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const Message = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[8]};
`;

const EmailCard = styled.div`
  background: ${theme.colors.dark[800]};
  border: 1px solid ${theme.colors.primary[500]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
  position: relative;
  overflow: hidden;
`;

const EmailCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[4]};
`;

const EmailIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary[600]};
  border-radius: 50%;
  color: white;
  font-size: 20px;
`;

const EmailTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin: 0;
`;

const EmailMessage = styled.p`
  color: ${theme.colors.dark[200]};
  margin: 0;
  line-height: 1.5;
`;

const OrderDetails = styled.div`
  background: ${theme.colors.dark[700]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
  text-align: left;
`;

const OrderDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[2]} 0;
  border-bottom: 1px solid ${theme.colors.dark[600]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderDetailLabel = styled.span`
  color: ${theme.colors.dark[300]};
  font-weight: ${theme.typography.weights.medium};
`;

const OrderDetailValue = styled.span`
  color: ${theme.colors.dark[50]};
  font-weight: ${theme.typography.weights.semibold};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const AnimatedText = styled(motion.div)`
  margin-bottom: ${theme.spacing[4]};
`;

const GuestCheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { orderNumber, orderData } = location.state || {};

  useEffect(() => {
    // Redirect to home if no order data
    if (!orderNumber) {
      navigate('/');
    }
  }, [navigate, orderNumber]);

  if (!orderNumber) {
    return null;
  }

  const handleGoToDownloads = () => {
    navigate('/guest-downloads', { 
      state: { orderNumber: orderNumber } 
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SuccessIcon>
          <FiCheckCircle size={40} />
        </SuccessIcon>

        <AnimatedText
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Title>Thank You for Your Purchase! 🎉</Title>
        </AnimatedText>

        <AnimatedText
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Message>
            Your order has been processed successfully. We've sent you an email with your download links.
          </Message>
        </AnimatedText>

        <AnimatedText
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EmailCard>
            <EmailCardHeader>
              <EmailIcon>
                <FiMail size={20} />
              </EmailIcon>
              <EmailTitle>Check Your Email</EmailTitle>
            </EmailCardHeader>
            <EmailMessage>
              We've sent your download links to your email address. Please check your inbox and spam folder.
            </EmailMessage>
          </EmailCard>
        </AnimatedText>

        {orderData && (
          <AnimatedText
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <OrderDetails>
              <OrderDetailRow>
                <OrderDetailLabel>Order Number:</OrderDetailLabel>
                <OrderDetailValue>{orderData.order_number || orderNumber}</OrderDetailValue>
              </OrderDetailRow>
              <OrderDetailRow>
                <OrderDetailLabel>Email:</OrderDetailLabel>
                <OrderDetailValue>{orderData.guest_email}</OrderDetailValue>
              </OrderDetailRow>
              <OrderDetailRow>
                <OrderDetailLabel>Total:</OrderDetailLabel>
                <OrderDetailValue>${orderData.total_amount?.toFixed(2) || '0.00'}</OrderDetailValue>
              </OrderDetailRow>
              <OrderDetailRow>
                <OrderDetailLabel>Status:</OrderDetailLabel>
                <OrderDetailValue style={{ color: theme.colors.success[400] }}>Completed</OrderDetailValue>
              </OrderDetailRow>
            </OrderDetails>
          </AnimatedText>
        )}

        <AnimatedText
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ButtonGroup>
            <Button
              variant="primary"
              size="lg"
              onClick={handleGoToDownloads}
              style={{
                background: theme.colors.gradients.neon,
                border: 'none',
                color: 'white',
                fontWeight: theme.typography.weights.semibold,
                padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
                fontSize: theme.typography.sizes.lg
              }}
            >
              <FiDownload size={20} style={{ marginRight: theme.spacing[2] }} />
              Access Downloads
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleGoHome}
              style={{
                padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
                fontSize: theme.typography.sizes.lg
              }}
            >
              <FiHome size={20} style={{ marginRight: theme.spacing[2] }} />
              Back to Home
            </Button>
          </ButtonGroup>
        </AnimatedText>
      </Card>
    </Container>
  );
};

export default GuestCheckoutSuccessPage;
