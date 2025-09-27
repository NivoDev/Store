import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiMusic, 
  FiInstagram, 
  FiTwitter, 
  FiFacebook,
  FiYoutube,
  FiHeart,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { theme } from '../../theme';
import apiService from '../../services/api';

const FooterContainer = styled.footer`
  background: ${theme.colors.gradients.card};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[16]} ${theme.spacing[6]} ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[4]} ${theme.spacing[6]};
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[12]};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing[6]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[8]};
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FooterTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.dark[300]};
  text-decoration: none;
  font-size: ${theme.typography.sizes.sm};
  transition: color ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    color: ${theme.colors.primary[400]};
  }
`;

const FooterText = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[2]};
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.dark[300]};
  text-decoration: none;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    background: ${theme.colors.primary[500]};
    color: white;
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.neon};
  }
`;

const NewsletterSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[4]};
  }
`;

const NewsletterTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const NewsletterDescription = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing[2]};
  }
`;

const NewsletterInputRow = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing[2]};
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
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

const NewsletterButton = styled(motion.button)`
  background: ${theme.colors.gradients.button};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  color: white;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    background: ${theme.colors.gradients.hover};
    box-shadow: ${theme.shadows.neon};
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing[3]};
  }
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !name) {
      setMessage('Please enter both name and email');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const result = await apiService.subscribeNewsletter(name, email);
      
      if (result.success) {
        setMessage('Successfully subscribed to newsletter!');
        setIsSuccess(true);
        setEmail('');
        setName('');
      } else {
        setMessage(result.error || 'Failed to subscribe to newsletter');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Failed to subscribe to newsletter');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>Shop</FooterTitle>
            <FooterLink to="/sample-packs">Sample Packs</FooterLink>
            <FooterLink to="/midi-packs">MIDI Packs</FooterLink>
            <FooterLink to="/acapellas">Acapellas</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/cookies">Cookie Policy</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Connect</FooterTitle>
            <FooterText>
              Follow us for the latest releases and exclusive content from Atomic Rose Tools.
            </FooterText>
            <SocialLinks>
              <SocialLink
                href="https://instagram.com/atomicrosetools"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInstagram size={18} />
              </SocialLink>
              <SocialLink
                href="https://twitter.com/atomicrosetools"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiTwitter size={18} />
              </SocialLink>
              <SocialLink
                href="https://facebook.com/atomicrosetools"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiFacebook size={18} />
              </SocialLink>
              <SocialLink
                href="https://youtube.com/atomicrosetools"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiYoutube size={18} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterGrid>

        <NewsletterSection>
          <NewsletterTitle>Stay in the Loop</NewsletterTitle>
          <NewsletterDescription>
            Get notified about new releases, exclusive deals, and behind-the-scenes content.
          </NewsletterDescription>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInputRow>
              <NewsletterInput
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <NewsletterInput
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </NewsletterInputRow>
            <NewsletterButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </NewsletterButton>
          </NewsletterForm>
          {message && (
            <div style={{
              marginTop: theme.spacing[3],
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.lg,
              backgroundColor: isSuccess ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isSuccess ? theme.colors.success[500] : theme.colors.error}`,
              color: isSuccess ? theme.colors.success[400] : theme.colors.error,
              fontSize: theme.typography.sizes.sm,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2]
            }}>
              {isSuccess ? <FiCheck size={16} /> : <FiX size={16} />}
              {message}
            </div>
          )}
        </NewsletterSection>

        <FooterBottom>
          <Copyright>
            <FiMusic size={16} />
            © 2025 Atomic Rose Tools. Made with
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FiHeart size={14} color={theme.colors.error} />
            </motion.div>
            for the psytrance community.
          </Copyright>

          <LegalLinks>
            <a 
              href="https://guerrillatrance.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: theme.colors.primary[400], 
                fontWeight: theme.typography.weights.medium,
                textDecoration: 'none',
                fontSize: theme.typography.sizes.sm,
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.color = theme.colors.primary[300]}
              onMouseOut={(e) => e.target.style.color = theme.colors.primary[400]}
            >
              Made by Guerrilla
            </a>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
