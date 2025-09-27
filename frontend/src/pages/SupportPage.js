import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle, FiHeadphones, FiHelpCircle, FiZap, FiShield } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { theme } from '../theme';
import Button from '../components/common/Button';
import SEOHead from '../components/common/SEOHead';

// Psychedelic animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.3), 0 0 40px rgba(139, 92, 246, 0.2); }
  50% { box-shadow: 0 0 30px rgba(14, 165, 233, 0.5), 0 0 60px rgba(139, 92, 246, 0.4); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.extrabold};
  background: ${theme.colors.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[6]};
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
  animation: ${float} 6s ease-in-out infinite;
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[8]};
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[8]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const SupportCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[8]};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${theme.colors.gradients.neon};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 255, 255, 0.3);
    box-shadow: ${theme.shadows.neon};

    &::before {
      opacity: 1;
    }
  }
`;

const FormCard = styled(SupportCard)`
  grid-column: 1 / -1;
  
  @media (min-width: 769px) {
    grid-column: 2;
  }
`;

const InfoCard = styled(SupportCard)`
  @media (min-width: 769px) {
    grid-column: 1;
  }
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.gradients.button};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  animation: ${pulse} 2s ease-in-out infinite;
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
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[200]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  option {
    background: ${theme.colors.dark[800]};
    color: ${theme.colors.dark[50]};
  }
`;

const SubmitButton = styled(Button)`
  background: ${theme.colors.gradients.button};
  border: none;
  color: white;
  font-weight: ${theme.typography.weights.bold};
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.sizes.lg};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${glow} 3s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.neonHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(0, 255, 255, 0.2);
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.gradients.neon};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const InfoText = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[300]};
  line-height: 1.5;
`;

const StatusMessage = styled(motion.div)`
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-weight: ${theme.typography.weights.medium};
`;

const SuccessMessage = styled(StatusMessage)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: ${theme.colors.success};
`;

const ErrorMessage = styled(StatusMessage)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: ${theme.colors.error};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RecaptchaContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: ${theme.spacing[4]} 0;
  padding: ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.03);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const RecaptchaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[2]};
`;

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const recaptchaRef = useRef(null);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }

      const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setRecaptchaLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadRecaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('reCAPTCHA loaded:', recaptchaLoaded);
    setIsSubmitting(true);
    setStatus(null);

    try {
      // Get reCAPTCHA token
      let recaptchaToken = '';
      if (recaptchaLoaded && window.grecaptcha) {
        const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
        try {
          recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'submit' });
        } catch (error) {
          console.warn('reCAPTCHA execution failed:', error);
          // Continue without token in test mode
        }
      } else {
        // In test mode, generate a dummy token if reCAPTCHA isn't loaded
        recaptchaToken = 'test-token-' + Date.now();
      }

      // EmailJS configuration
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_xxxxxxx';
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_xxxxxxx';
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'xxxxxxxxxxxxxxx';

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        to_email: 'atomicrosetools@gmail.com',
        'g-recaptcha-response': recaptchaToken // Add reCAPTCHA token
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('Email sent successfully:', result);
      
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Support - Atomic Rose Tools"
        description="Get help with your Atomic Rose Tools account, downloads, and technical issues. Our support team is here to assist you."
        keywords="support, help, contact, atomic rose tools, technical support"
      />
      
      <PageContainer>
        <Container>
          <Header>
            <Title>Support Center</Title>
            <Subtitle>
              Need help? We're here to assist you with any questions or issues you might have. 
              Reach out to our support team and we'll get back to you as soon as possible.
            </Subtitle>
          </Header>

          <ContentGrid>
            <InfoCard
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CardTitle>
                <IconWrapper>
                  <FiHeadphones />
                </IconWrapper>
                How We Can Help
              </CardTitle>
              
              <InfoList>
                <InfoItem>
                  <InfoIcon>
                    <FiZap />
                  </InfoIcon>
                  <InfoContent>
                    <InfoTitle>Technical Issues</InfoTitle>
                    <InfoText>
                      Having trouble with downloads, account access, or technical problems? 
                      We'll help you get back on track.
                    </InfoText>
                  </InfoContent>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <FiHelpCircle />
                  </InfoIcon>
                  <InfoContent>
                    <InfoTitle>Account Support</InfoTitle>
                    <InfoText>
                      Questions about your account, billing, or subscription? 
                      Our team can assist with all account-related matters.
                    </InfoText>
                  </InfoContent>
                </InfoItem>
                
                <InfoItem>
                  <InfoIcon>
                    <FiMessageSquare />
                  </InfoIcon>
                  <InfoContent>
                    <InfoTitle>General Questions</InfoTitle>
                    <InfoText>
                      Need information about our products, services, or have any other questions? 
                      We're here to help.
                    </InfoText>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <FormCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <CardTitle>
                <IconWrapper>
                  <FiMail />
                </IconWrapper>
                Send us a Message
              </CardTitle>

              {status === 'success' && (
                <SuccessMessage
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiCheckCircle />
                  Message sent successfully! We'll get back to you soon.
                </SuccessMessage>
              )}

              {status === 'error' && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle />
                  Something went wrong. Please try again or contact us directly.
                </ErrorMessage>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="download">Download Issue</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="message">Message *</Label>
                  <TextArea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide as much detail as possible about your issue or question..."
                    required
                  />
                </FormGroup>

                {/* reCAPTCHA */}
                <RecaptchaContainer>
                  <div>
                <RecaptchaInfo>
                  <FiShield />
                  {process.env.REACT_APP_RECAPTCHA_SITE_KEY === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' ? 
                    '🔧 Test Mode: Using reCAPTCHA test key for development' :
                    'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.'
                  }
                </RecaptchaInfo>
                    <div ref={recaptchaRef} id="recaptcha-container"></div>
                  </div>
                </RecaptchaContainer>

                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send Message
                    </>
                  )}
                </SubmitButton>
              </Form>
            </FormCard>
          </ContentGrid>
        </Container>
      </PageContainer>
    </>
  );
};

export default SupportPage;
