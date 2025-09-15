import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiMusic, 
  FiInstagram, 
  FiTwitter, 
  FiFacebook,
  FiYoutube,
  FiHeart
} from 'react-icons/fi';
import { theme } from '../../theme';

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
  gap: ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
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
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    // Newsletter signup functionality would be implemented here
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
            <NewsletterInput
              type="email"
              placeholder="Enter your email address"
              required
            />
            <NewsletterButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe
            </NewsletterButton>
          </NewsletterForm>
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
            {/* Contact and Support links removed - not in use */}
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
