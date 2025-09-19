import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { theme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import apiService from '../../services/api';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: ${theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]};
`;

const Modal = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[8]};
  width: 100%;
  max-width: 480px;
  position: relative;
  box-shadow: ${theme.shadows['2xl']};
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  background: transparent;
  border: none;
  color: ${theme.colors.dark[400]};
  cursor: pointer;
  padding: ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  &:hover {
    color: ${theme.colors.dark[200]};
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const Title = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const Subtitle = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.base};
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[1]};
  margin-bottom: ${theme.spacing[6]};
`;

const Tab = styled(motion.button)`
  flex: 1;
  background: transparent;
  border: none;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.dark[300]};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  &.active {
    background: ${theme.colors.gradients.button};
    color: white;
    box-shadow: ${theme.shadows.md};
  }
  &:hover:not(.active) {
    color: ${theme.colors.dark[200]};
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.dark[400]};
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[12]};
  color: ${theme.colors.dark[100]};
  font-size: ${theme.typography.sizes.base};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  &::placeholder { color: ${theme.colors.dark[400]}; }
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }
  &:focus + ${InputIcon} { color: ${theme.colors.primary[400]}; }
`;

const PasswordToggle = styled(motion.button)`
  position: absolute;
  right: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${theme.colors.dark[400]};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  &:hover { color: ${theme.colors.dark[200]}; }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing[1]};
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin: ${theme.spacing[2]} 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${theme.colors.primary[500]};
`;

const CheckboxLabel = styled.label`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
  cursor: pointer;
`;

const ForgotPassword = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.sm};
  cursor: pointer;
  text-align: center;
  margin: ${theme.spacing[2]} 0;
  &:hover { color: ${theme.colors.primary[300]}; text-decoration: underline; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin: ${theme.spacing[6]} 0;
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  span {
    color: ${theme.colors.dark[400]};
    font-size: ${theme.typography.sizes.sm};
    white-space: nowrap;
  }
`;

const SocialButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[200]};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SwitchInline = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.sm};
  cursor: pointer;
  margin-top: ${theme.spacing[2]};
  text-align: center;
  &:hover { text-decoration: underline; color: ${theme.colors.primary[300]}; }
`;

const AuthModal = ({ isOpen, onClose, onSuccessfulLogin }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState('form'); // 'form' | 'verify'
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const { login, register, isLoading, error } = useAuth();

  const { register: registerField, handleSubmit, formState: { errors }, reset } = useForm();

  const handleClose = () => {
    reset();
    setVerificationStep('form');
    setVerificationEmail('');
    setOtpCode('');
    onClose();
  };

  const onSubmit = async (data) => {
    if (activeTab === 'signin') {
      const result = await login(data.email, data.password);
      if (result.success) {
        if (onSuccessfulLogin) onSuccessfulLogin(); else handleClose();
      }
    } else {
      const result = await register(data);
      if (result.success) {
        setVerificationEmail(data.email);
        setVerificationStep('verify');
      }
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setVerificationStep('form');
    setVerificationEmail('');
    setOtpCode('');
    reset();
  };

  const handleVerification = async () => {
    if (!otpCode || otpCode.length !== 6) return;
    try {
      const result = await apiService.verifyUserEmail(otpCode, verificationEmail);
      if (result.success) {
        if (onSuccessfulLogin) onSuccessfulLogin(); else handleClose();
      } else {
        console.error('Verification failed:', result.error);
        
        // If token expired, show a message and allow re-registration
        if (result.expired) {
          alert('Your verification code has expired. Please register again with the same email address.');
          // Reset to registration form
          setActiveTab('signup');
          setVerificationStep('form');
          setVerificationEmail('');
          setOtpCode('');
        }
      }
    } catch (e) {
      console.error('Verification error:', e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={verificationStep === 'verify' ? undefined : handleClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {verificationStep === 'form' && (
              <CloseButton onClick={handleClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FiX size={20} />
              </CloseButton>
            )}

            <Header>
              <Title>
                {verificationStep === 'verify'
                  ? 'Verify Your Email'
                  : activeTab === 'signin'
                    ? 'Welcome Back'
                    : 'Join Atomic Rose'}
              </Title>
              <Subtitle>
                {verificationStep === 'verify'
                  ? `We've sent a verification code to ${verificationEmail}. Please check your inbox and enter the code below.`
                  : activeTab === 'signin'
                    ? 'Sign in to access your account and continue your musical journey'
                    : 'Create your account to start exploring premium psytrance content'}
              </Subtitle>
            </Header>

            {/* ---- TAB SWITCHER (only in form step) ---- */}
            {verificationStep === 'form' && (
              <TabContainer>
                <Tab
                  className={activeTab === 'signin' ? 'active' : ''}
                  onClick={() => switchTab('signin')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </Tab>
                <Tab
                  className={activeTab === 'signup' ? 'active' : ''}
                  onClick={() => switchTab('signup')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </Tab>
              </TabContainer>
            )}

            {/* ---- BODY ---- */}
            {verificationStep === 'verify' ? (
              <Form>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code from your email"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                  />
                  <InputIcon><FiMail size={18} /></InputIcon>
                </InputGroup>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleVerification}
                  disabled={!otpCode || otpCode.length !== 6}
                >
                  Verify Email
                </Button>

                <ForgotPassword
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVerificationStep('form')}
                >
                  Back to Sign Up
                </ForgotPassword>
              </Form>
            ) : (
              <>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  {activeTab === 'signup' && (
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        {...registerField('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' }
                        })}
                      />
                      <InputIcon><FiUser size={18} /></InputIcon>
                      {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </InputGroup>
                  )}

                  <InputGroup>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...registerField('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    <InputIcon><FiMail size={18} /></InputIcon>
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                  </InputGroup>

                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      {...registerField('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                    />
                    <InputIcon><FiLock size={18} /></InputIcon>
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </PasswordToggle>
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                  </InputGroup>

                  {activeTab === 'signup' && (
                    <>
                      <CheckboxGroup>
                        <Checkbox
                          type="checkbox"
                          id="terms"
                          {...registerField('terms', {
                            required: 'You must accept the Terms and Conditions to continue'
                          })}
                        />
                        <CheckboxLabel htmlFor="terms">
                          I agree to the{' '}
                          <a
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: theme.colors.primary[400], textDecoration: 'underline' }}
                          >
                            Terms and Conditions
                          </a>{' '}and{' '}
                          <a
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: theme.colors.primary[400], textDecoration: 'underline' }}
                          >
                            Privacy Policy
                          </a>
                        </CheckboxLabel>
                      </CheckboxGroup>
                      {errors.terms && <ErrorMessage>{errors.terms.message}</ErrorMessage>}

                      <CheckboxGroup>
                        <Checkbox type="checkbox" id="newsletter" {...registerField('newsletter')} />
                        <CheckboxLabel htmlFor="newsletter">
                          Subscribe to newsletter for exclusive releases and deals
                        </CheckboxLabel>
                      </CheckboxGroup>
                    </>
                  )}

                  {error && <ErrorMessage>{error}</ErrorMessage>}

                  <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
                    {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                  </Button>

                  {activeTab === 'signin' ? (
                    <>
                      <ForgotPassword type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Forgot your password?
                      </ForgotPassword>
                      <SwitchInline onClick={() => switchTab('signup')}>
                        New here? Create an account
                      </SwitchInline>
                    </>
                  ) : (
                    <SwitchInline onClick={() => switchTab('signin')}>
                      Already have an account? Sign in
                    </SwitchInline>
                  )}
                </Form>

                <Divider><span>or continue with</span></Divider>

                <SocialButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </SocialButton>
              </>
            )}
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
