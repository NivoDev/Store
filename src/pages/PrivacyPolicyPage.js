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

const ContactInfo = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin-top: ${theme.spacing[6]};
`;

const PrivacyPolicyPage = () => {
  return (
    <PageContainer>
      <SEOHead 
        title="Privacy Policy"
        description="Privacy Policy for Atomic Rose Tools Store. Learn how we collect, use, and protect your personal information when you use our services."
        keywords="privacy policy, data protection, personal information, Atomic Rose Tools, music store privacy"
        type="article"
      />
      
      <Container>
        <Title>Privacy Policy</Title>
        <LastUpdated>Last updated: September 13, 2025</LastUpdated>

        <Section>
          <SectionTitle>1. Introduction</SectionTitle>
          <Paragraph>
            Welcome to Atomic Rose Tools Store ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </Paragraph>
          <Paragraph>
            By accessing or using our services, you agree to the collection and use of information in accordance with this Privacy Policy.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Information We Collect</SectionTitle>
          
          <SubsectionTitle>2.1 Personal Information</SubsectionTitle>
          <Paragraph>We may collect the following personal information:</Paragraph>
          <List>
            <ListItem>Name and email address when you create an account</ListItem>
            <ListItem>Payment information (processed securely through our payment providers)</ListItem>
            <ListItem>Billing and shipping addresses</ListItem>
            <ListItem>Communication preferences</ListItem>
            <ListItem>Purchase history and download records</ListItem>
          </List>

          <SubsectionTitle>2.2 Automatically Collected Information</SubsectionTitle>
          <Paragraph>We automatically collect certain information when you visit our website:</Paragraph>
          <List>
            <ListItem>IP address and device information</ListItem>
            <ListItem>Browser type and version</ListItem>
            <ListItem>Pages visited and time spent on our site</ListItem>
            <ListItem>Referring website addresses</ListItem>
            <ListItem>Cookies and similar tracking technologies</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. How We Use Your Information</SectionTitle>
          <Paragraph>We use your information for the following purposes:</Paragraph>
          <List>
            <ListItem>Processing and fulfilling your orders</ListItem>
            <ListItem>Managing your account and providing customer support</ListItem>
            <ListItem>Sending you important updates about your purchases</ListItem>
            <ListItem>Improving our website and services</ListItem>
            <ListItem>Sending marketing communications (with your consent)</ListItem>
            <ListItem>Preventing fraud and ensuring security</ListItem>
            <ListItem>Complying with legal obligations</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Information Sharing and Disclosure</SectionTitle>
          <Paragraph>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</Paragraph>
          <List>
            <ListItem><strong>Payment Processors:</strong> We share payment information with secure payment providers (PayMe.io) to process transactions</ListItem>
            <ListItem><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in operating our website</ListItem>
            <ListItem><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</ListItem>
            <ListItem><strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. Data Security</SectionTitle>
          <Paragraph>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
          </Paragraph>
          <List>
            <ListItem>Encryption of sensitive data</ListItem>
            <ListItem>Secure payment processing</ListItem>
            <ListItem>Regular security assessments</ListItem>
            <ListItem>Access controls and authentication</ListItem>
            <ListItem>Secure data storage practices</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Cookies and Tracking Technologies</SectionTitle>
          <Paragraph>
            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
          </Paragraph>
          <SubsectionTitle>Types of Cookies We Use:</SubsectionTitle>
          <List>
            <ListItem><strong>Essential Cookies:</strong> Required for basic website functionality</ListItem>
            <ListItem><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</ListItem>
            <ListItem><strong>Preference Cookies:</strong> Remember your settings and preferences</ListItem>
            <ListItem><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. Your Rights and Choices</SectionTitle>
          <Paragraph>You have the following rights regarding your personal information:</Paragraph>
          <List>
            <ListItem><strong>Access:</strong> Request access to your personal data</ListItem>
            <ListItem><strong>Correction:</strong> Update or correct inaccurate information</ListItem>
            <ListItem><strong>Deletion:</strong> Request deletion of your personal data</ListItem>
            <ListItem><strong>Portability:</strong> Request a copy of your data in a portable format</ListItem>
            <ListItem><strong>Opt-out:</strong> Unsubscribe from marketing communications</ListItem>
            <ListItem><strong>Restriction:</strong> Request restriction of processing</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>8. Data Retention</SectionTitle>
          <Paragraph>
            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We will delete or anonymize your information when it is no longer needed, unless we are required to retain it for legal or regulatory purposes.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. Third-Party Links</SectionTitle>
          <Paragraph>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>10. International Data Transfers</SectionTitle>
          <Paragraph>
            Your information may be transferred to and processed in countries other than your own. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>11. Children's Privacy</SectionTitle>
          <Paragraph>
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>12. Changes to This Privacy Policy</SectionTitle>
          <Paragraph>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
          </Paragraph>
        </Section>

        <ContactInfo>
          <SectionTitle>13. Contact Information</SectionTitle>
          <Paragraph>
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> privacy@atomicrosetools.com<br />
            <strong>Address:</strong> Atomic Rose Tools Store<br />
            Privacy Department<br />
            [Your Address]<br />
            [City, State, ZIP Code]
          </Paragraph>
          <Paragraph>
            We will respond to your inquiries within a reasonable timeframe and in accordance with applicable law.
          </Paragraph>
        </ContactInfo>
      </Container>
    </PageContainer>
  );
};

export default PrivacyPolicyPage;
