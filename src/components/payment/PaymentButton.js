import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCreditCard, FiShield, FiCheck } from 'react-icons/fi';
import { theme } from '../../theme';
import { usePayMe } from '../../hooks/usePayMe';
import Button from '../common/Button';

const PaymentContainer = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
`;

const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  background: rgba(16, 185, 129, 0.1);
  color: ${theme.colors.success};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[6]};
`;

const PaymentMethod = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${theme.colors.primary[500]};
    color: ${theme.colors.dark[200]};
  }
  
  &.active {
    background: rgba(14, 165, 233, 0.1);
    border-color: ${theme.colors.primary[500]};
    color: ${theme.colors.primary[400]};
  }
`;

const MethodIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MethodName = styled.div`
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PaymentSummary = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[2]} 0;
  color: ${theme.colors.dark[300]};
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  &.total {
    color: ${theme.colors.dark[50]};
    font-weight: ${theme.typography.weights.semibold};
    font-size: ${theme.typography.sizes.lg};
  }
`;

const PaymentStatus = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing[6]};
  
  &.success {
    color: ${theme.colors.success};
  }
  
  &.error {
    color: ${theme.colors.error};
  }
`;

const StatusIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.success ? theme.colors.success : theme.colors.error};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[4]};
  color: white;
`;

const PaymentButton = ({ 
  amount, 
  currency = 'USD', 
  description, 
  onSuccess, 
  onError,
  disabled = false 
}) => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const { 
    isLoading, 
    error, 
    createPaymentSession, 
    processPayment, 
    clearError 
  } = usePayMe();

  const paymentMethods = [
    { id: 'credit_card', name: 'Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'apple_pay', name: 'Apple Pay', icon: '🍎' },
    { id: 'google_pay', name: 'Google Pay', icon: '🅶' }
  ];

  const handlePayment = async () => {
    try {
      setPaymentStatus('processing');
      clearError();

      // Create payment session
      const sessionResult = await createPaymentSession({
        amount,
        currency,
        description,
        metadata: {
          paymentMethod: selectedMethod,
          timestamp: new Date().toISOString()
        }
      });

      if (!sessionResult.success) {
        throw new Error(sessionResult.error || 'Failed to create payment session');
      }

      // Process payment
      const paymentResult = await processPayment(
        sessionResult.session.sessionId, 
        selectedMethod
      );

      if (paymentResult.success) {
        setPaymentStatus('success');
        onSuccess && onSuccess(paymentResult.payment);
      } else {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }
    } catch (err) {
      setPaymentStatus('error');
      setErrorMessage(err.message);
      onError && onError(err);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
    clearError();
  };

  if (paymentStatus === 'success') {
    return (
      <PaymentContainer>
        <PaymentStatus 
          className="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatusIcon success>
            <FiCheck size={32} />
          </StatusIcon>
          <h3>Payment Successful!</h3>
          <p>Your purchase has been completed successfully.</p>
          <Button 
            variant="primary" 
            onClick={resetPayment}
            style={{ marginTop: theme.spacing[4] }}
          >
            Make Another Purchase
          </Button>
        </PaymentStatus>
      </PaymentContainer>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <PaymentContainer>
        <PaymentStatus 
          className="error"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StatusIcon>
            <FiCreditCard size={32} />
          </StatusIcon>
          <h3>Payment Failed</h3>
          <p>{errorMessage || error || 'Something went wrong with your payment.'}</p>
          <Button 
            variant="primary" 
            onClick={resetPayment}
            style={{ marginTop: theme.spacing[4] }}
          >
            Try Again
          </Button>
        </PaymentStatus>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <PaymentHeader>
        <FiCreditCard size={24} color={theme.colors.primary[400]} />
        <h3 style={{ 
          color: theme.colors.dark[50], 
          margin: 0,
          fontFamily: theme.typography.fonts.heading
        }}>
          Secure Payment
        </h3>
        <SecurityBadge>
          <FiShield size={16} />
          SSL Secured
        </SecurityBadge>
      </PaymentHeader>

      <PaymentMethods>
        {paymentMethods.map((method) => (
          <PaymentMethod
            key={method.id}
            className={selectedMethod === method.id ? 'active' : ''}
            onClick={() => setSelectedMethod(method.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={paymentStatus === 'processing'}
          >
            <MethodIcon>
              <span style={{ fontSize: '20px' }}>{method.icon}</span>
            </MethodIcon>
            <MethodName>{method.name}</MethodName>
          </PaymentMethod>
        ))}
      </PaymentMethods>

      <PaymentSummary>
        <SummaryRow>
          <span>Subtotal</span>
          <span>${amount.toFixed(2)}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Processing Fee</span>
          <span>$0.00</span>
        </SummaryRow>
        <SummaryRow className="total">
          <span>Total</span>
          <span>${amount.toFixed(2)} {currency}</span>
        </SummaryRow>
      </PaymentSummary>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handlePayment}
        loading={paymentStatus === 'processing' || isLoading}
        disabled={disabled || paymentStatus === 'processing'}
      >
        {paymentStatus === 'processing' 
          ? 'Processing Payment...' 
          : `Pay $${amount.toFixed(2)} with PayMe.io`
        }
      </Button>

      <div style={{ 
        textAlign: 'center', 
        marginTop: theme.spacing[4],
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.dark[400]
      }}>
        Powered by PayMe.io • Your payment information is secure and encrypted
      </div>
    </PaymentContainer>
  );
};

export default PaymentButton;
