import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiCheck } from 'react-icons/fi';
import { theme } from '../../theme';
import apiService from '../../services/api';

const NewsletterContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[4]};
  }
`;

const NewsletterTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
  text-align: center;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[100]};
  font-size: ${theme.typography.sizes.sm};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: ${theme.colors.gradients.button};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  color: white;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.gradients.hover};
    box-shadow: ${theme.shadows.neon};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[4]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid ${theme.colors.success[500]};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.success[400]};
`;

const SuccessTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.success[300]};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
`;

const SuccessText = styled.p`
  color: ${theme.colors.success[400]};
  font-size: ${theme.typography.sizes.sm};
`;

const NewsletterSignup = ({ title = "Sign up to our newsletter", compact = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Please enter both name and email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await apiService.subscribeNewsletter(formData.name, formData.email);
      
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '' });
      } else {
        setError(result.error || 'Failed to subscribe to newsletter');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Failed to subscribe to newsletter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <NewsletterContainer>
        <SuccessMessage>
          <SuccessTitle>
            <FiCheck size={20} />
            Thank you for subscribing!
          </SuccessTitle>
          <SuccessText>You'll receive our latest updates in your inbox.</SuccessText>
        </SuccessMessage>
      </NewsletterContainer>
    );
  }

  if (error) {
    return (
      <NewsletterContainer>
        <NewsletterTitle>{title}</NewsletterTitle>
        <div style={{
          color: theme.colors.error,
          fontSize: theme.typography.sizes.sm,
          textAlign: 'center',
          marginTop: theme.spacing[2],
          padding: theme.spacing[3],
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${theme.colors.error}`,
          borderRadius: theme.borderRadius.lg
        }}>
          {error}
        </div>
      </NewsletterContainer>
    );
  }

  return (
    <NewsletterContainer>
      <NewsletterTitle>{title}</NewsletterTitle>
      <NewsletterForm onSubmit={handleSubmit}>
        <FormGroup>
          <NewsletterInput
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </FormGroup>
        <FormGroup>
          <NewsletterInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
          />
        </FormGroup>
        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              Subscribing
              <LoadingSpinner />
            </>
          ) : (
            <>
              <FiMail size={16} />
              Subscribe
            </>
          )}
        </SubmitButton>
      </NewsletterForm>
    </NewsletterContainer>
  );
};

export default NewsletterSignup;