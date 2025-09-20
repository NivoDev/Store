import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';
import apiService from '../services/api';

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
  background: rgba(59, 130, 246, 0.1);
  color: ${theme.colors.primary[500]};
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  text-align: left;
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[200]};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
  
  &:invalid {
    border-color: ${theme.colors.error};
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.success};
  font-size: ${theme.typography.sizes.sm};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.dark[400]};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[6]};
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.primary[400]};
  }
`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.forgotPassword(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send password reset email');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IconContainer>
            <FiCheckCircle size={40} />
          </IconContainer>

          <Title>Check Your Email</Title>
          <Message>
            If an account with that email exists, we've sent you a password reset link. 
            Please check your inbox and spam folder.
          </Message>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Back to Login
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSuccess(false)}
              fullWidth
            >
              Try Another Email
            </Button>
          </div>
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
        <BackLink to="/login">
          <FiArrowLeft />
          Back to Login
        </BackLink>

        <IconContainer>
          <FiMail size={40} />
        </IconContainer>

        <Title>Forgot Password?</Title>
        <Message>
          No worries! Enter your email address and we'll send you a link to reset your password.
        </Message>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </Form>

        <div style={{ marginTop: theme.spacing[6], textAlign: 'center' }}>
          <p style={{ color: theme.colors.dark[400], fontSize: theme.typography.sizes.sm }}>
            Remember your password?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: theme.colors.primary[400], 
                textDecoration: 'none',
                fontWeight: theme.typography.weights.medium
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default ForgotPasswordPage;

