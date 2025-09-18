import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import SEOHead from '../components/common/SEOHead';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const LastUpdated = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[8]};
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const SubsectionTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[100]};
  margin-bottom: ${theme.spacing[3]};
`;

const Paragraph = styled.p`
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[4]};
`;

const List = styled.ul`
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[4]};
  padding-left: ${theme.spacing[6]};
`;

const ListItem = styled.li`
  margin-bottom: ${theme.spacing[2]};
`;

const HighlightBox = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin: ${theme.spacing[6]} 0;
`;


const TermsOfServicePage = () => {
  return (
    <PageContainer>
      <SEOHead 
        title="Terms of Service"
        description="Terms of Service for Atomic Rose Tools Store. Read our terms and conditions for using our digital music products and services."
        keywords="terms of service, terms and conditions, legal agreement, Atomic Rose Tools, music licensing"
        type="article"
      />
      
      <Container>
        <Title>Terms of Service</Title>
        <LastUpdated>Last updated: September 13, 2025</LastUpdated>

        <Section>
          <SectionTitle>1. Acceptance of Terms</SectionTitle>
          <Paragraph>
            Welcome to Atomic Rose Tools Store ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, products, and services. By accessing or using our services, you agree to be bound by these Terms.
          </Paragraph>
          <Paragraph>
            If you do not agree to these Terms, please do not use our services.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Description of Service</SectionTitle>
          <Paragraph>
            Atomic Rose Tools Store provides digital music products including:
          </Paragraph>
          <List>
            <ListItem>Sample packs (audio loops and one-shots)</ListItem>
            <ListItem>MIDI packs (musical sequences and patterns)</ListItem>
            <ListItem>Acapellas (vocal recordings)</ListItem>
            <ListItem>Construction kits and stems</ListItem>
            <ListItem>Related digital music content</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Account Registration</SectionTitle>
          <SubsectionTitle>3.1 Account Creation</SubsectionTitle>
          <Paragraph>
            To purchase and download products, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
          </Paragraph>
          
          <SubsectionTitle>3.2 Account Security</SubsectionTitle>
          <Paragraph>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. Purchases and Payments</SectionTitle>
          <SubsectionTitle>4.1 Pricing</SubsectionTitle>
          <Paragraph>
            All prices are displayed in USD and are subject to change without notice. We reserve the right to modify prices at any time, but price changes will not affect orders already placed.
          </Paragraph>
          
          <SubsectionTitle>4.2 Payment Processing</SubsectionTitle>
          <Paragraph>
            Payments are processed securely through our payment provider (PayMe.io). By making a purchase, you authorize us to charge the provided payment method for the total amount of your order.
          </Paragraph>
          
          <SubsectionTitle>4.3 Order Completion</SubsectionTitle>
          <Paragraph>
            Orders are considered complete upon successful payment processing. You will receive an email confirmation with download links for your purchased products.
          </Paragraph>
        </Section>

        <HighlightBox>
          <SectionTitle>5. Digital Product Licensing</SectionTitle>
          <SubsectionTitle>5.1 License Grant</SubsectionTitle>
          <Paragraph>
            Upon purchase, we grant you a non-exclusive, worldwide, perpetual license to use our digital products in accordance with these terms. This license includes:
          </Paragraph>
          <List>
            <ListItem>Use in commercial and non-commercial music productions</ListItem>
            <ListItem>Modification, editing, and processing of the content</ListItem>
            <ListItem>Incorporation into original musical compositions</ListItem>
            <ListItem>Distribution of derivative works containing our content</ListItem>
          </List>

          <SubsectionTitle>5.2 License Restrictions</SubsectionTitle>
          <Paragraph>
            You may NOT:
          </Paragraph>
          <List>
            <ListItem>Resell, redistribute, or share the original files</ListItem>
            <ListItem>Claim ownership or authorship of the original content</ListItem>
            <ListItem>Use the content in isolation without significant transformation</ListItem>
            <ListItem>Include the content in competing sample libraries</ListItem>
            <ListItem>Use the content for illegal or harmful purposes</ListItem>
          </List>
        </HighlightBox>

        <Section>
          <SectionTitle>6. Intellectual Property</SectionTitle>
          <Paragraph>
            All content on our website and in our products, including but not limited to audio files, artwork, text, and software, is protected by intellectual property laws. We retain all rights not expressly granted to you under these Terms.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Downloads and Access</SectionTitle>
          <SubsectionTitle>7.1 Download Links</SubsectionTitle>
          <Paragraph>
            Download links are provided via email after successful purchase. Links are valid for 30 days and allow up to 5 download attempts per product.
          </Paragraph>
          
          <SubsectionTitle>7.2 Technical Requirements</SubsectionTitle>
          <Paragraph>
            You are responsible for ensuring your system meets the technical requirements to download and use our products. We provide products in standard formats (WAV, MIDI) compatible with most digital audio workstations.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Refunds and Returns</SectionTitle>
          <SubsectionTitle>8.1 Refund Policy</SubsectionTitle>
          <Paragraph>
            Due to the digital nature of our products, all sales are final. However, we may provide refunds at our discretion in the following circumstances:
          </Paragraph>
          <List>
            <ListItem>Technical issues preventing download or use</ListItem>
            <ListItem>Duplicate purchases made in error</ListItem>
            <ListItem>Products that materially differ from their description</ListItem>
          </List>
          
          <SubsectionTitle>8.2 Refund Process</SubsectionTitle>
          <Paragraph>
            Refund requests must be submitted within 14 days of purchase. Please note that contact information has been removed as these features are not currently in use.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Prohibited Uses</SectionTitle>
          <Paragraph>
            You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services. Prohibited activities include:
          </Paragraph>
          <List>
            <ListItem>Attempting to gain unauthorized access to our systems</ListItem>
            <ListItem>Interfering with other users' access to our services</ListItem>
            <ListItem>Using automated systems to access our content</ListItem>
            <ListItem>Violating any applicable laws or regulations</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>10. Disclaimer of Warranties</SectionTitle>
          <Paragraph>
            Our services and products are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, secure, or error-free.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Limitation of Liability</SectionTitle>
          <Paragraph>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>12. Indemnification</SectionTitle>
          <Paragraph>
            You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>13. Privacy Policy</SectionTitle>
          <Paragraph>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our services, to understand our practices regarding the collection and use of your information.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>14. Modifications to Terms</SectionTitle>
          <Paragraph>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes are posted constitutes acceptance of the modified Terms.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>15. Termination</SectionTitle>
          <Paragraph>
            We may terminate or suspend your account and access to our services at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>16. Governing Law</SectionTitle>
          <Paragraph>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>17. Dispute Resolution</SectionTitle>
          <Paragraph>
            Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>18. Severability</SectionTitle>
          <Paragraph>
            If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue to be valid and enforceable to the fullest extent permitted by law.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>19. Effective Date</SectionTitle>
          <Paragraph>
            <strong>Effective Date:</strong> These Terms of Service are effective as of September 13, 2025.
          </Paragraph>
          <Paragraph>
            <strong>Note:</strong> Contact and support features have been removed as they are not currently in use.
          </Paragraph>
        </Section>
      </Container>
    </PageContainer>
  );
};

export default TermsOfServicePage;
