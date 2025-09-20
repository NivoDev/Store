import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';
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
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const Required = styled.span`
  color: ${theme.colors.error};
  font-weight: ${theme.typography.weights.bold};
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  padding-right: ${props => props.type === 'password' ? '48px' : theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  width: 100%;
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

const ToggleButton = styled.button`
  position: absolute;
  right: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${theme.colors.dark[400]};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${theme.colors.dark[200]};
  }
`;

const PasswordStrength = styled.div`
  margin-top: ${theme.spacing[2]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const StrengthBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.strength === 'weak') return theme.colors.error;
    if (props.strength === 'medium') return '#f59e0b';
    if (props.strength === 'strong') return theme.colors.success;
    return 'transparent';
  }};
  width: ${props => {
    if (props.strength === 'weak') return '33%';
    if (props.strength === 'medium') return '66%';
    if (props.strength === 'strong') return '100%';
    return '0%';
  }};
  transition: all 0.3s ease;
`;

const StrengthText = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${props => {
    if (props.strength === 'weak') return theme.colors.error;
    if (props.strength === 'medium') return '#f59e0b';
    if (props.strength === 'strong') return theme.colors.success;
    return theme.colors.dark[400];
  }};
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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const calculatePasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }
    
    if (!formData.password) {
      setError('Please enter a new password');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.resetPassword(token, formData.password);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset password error:', err);
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
          <IconContainer success>
            <FiCheckCircle size={40} />
          </IconContainer>

          <Title>Password Reset Successfully!</Title>
          <Message>
            Your password has been updated successfully. You can now log in with your new password.
          </Message>

          <Button
            variant="primary"
            onClick={() => navigate('/login')}
            fullWidth
          >
            Go to Login
          </Button>
        </Card>
      </Container>
    );
  }

  if (error && !token) {
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

          <Title>Invalid Reset Link</Title>
          <Message>
            This password reset link is invalid or has expired. Please request a new one.
          </Message>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
            <Button
              variant="primary"
              onClick={() => navigate('/forgot-password')}
              fullWidth
            >
              Request New Reset Link
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/login')}
              fullWidth
            >
              Back to Login
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
        <IconContainer>
          <FiLock size={40} />
        </IconContainer>

        <Title>Reset Your Password</Title>
        <Message>
          Enter your new password below. Make sure it's secure and easy to remember.
        </Message>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label htmlFor="password">
              New Password <Required>*</Required>
            </Label>
            <InputContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                required
                disabled={loading}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </ToggleButton>
            </InputContainer>
            
            {formData.password && (
              <PasswordStrength>
                <StrengthBar>
                  <StrengthFill strength={passwordStrength} />
                </StrengthBar>
                <StrengthText strength={passwordStrength}>
                  Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </StrengthText>
              </PasswordStrength>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">
              Confirm Password <Required>*</Required>
            </Label>
            <InputContainer>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                required
                disabled={loading}
              />
              <ToggleButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </ToggleButton>
            </InputContainer>
          </FormGroup>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || !formData.password || !formData.confirmPassword}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
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

export default ResetPasswordPage;

