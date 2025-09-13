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

const CookiePolicyPage = () => {
  return (
    <PageContainer>
      <SEOHead 
        title="Cookie Policy"
        description="Cookie Policy for Atomic Rose Tools. Learn how we use cookies to enhance your browsing experience and provide essential functionality."
        keywords="cookie policy, cookies, web tracking, Atomic Rose Tools, privacy"
        type="article"
      />
      
      <Container>
        <Title>Cookie Policy</Title>
        <LastUpdated>Last updated: September 13, 2025</LastUpdated>

        <Paragraph>
          This Cookie Policy explains how and why cookies may be stored on and accessed from your device when you use the Atomic Rose Tools website.
        </Paragraph>

        <Section>
          <SectionTitle>1. What are Cookies?</SectionTitle>
          <Paragraph>
            Cookies are small text files that are placed on your device by a web server when you access our website. They are widely used to make websites work more efficiently and to provide information to the website owner.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. How We Use Cookies</SectionTitle>
          <Paragraph>
            We use cookies to enhance your browsing experience and provide essential functionality, such as:
          </Paragraph>
          <List>
            <ListItem><strong>Authentication:</strong> To remember if you are logged in, so you don't have to sign in on every visit.</ListItem>
            <ListItem><strong>Shopping Cart:</strong> To remember the items you have added to your cart between visits.</ListItem>
            <ListItem><strong>Analytics:</strong> To understand how our website is used and to improve its performance.</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Types of Cookies We Use</SectionTitle>
          <Paragraph>
            <strong>Strictly Necessary Cookies:</strong> These are essential for the operation of our website. Without these cookies, services like the shopping cart cannot function.
          </Paragraph>
          <Paragraph>
            <strong>Performance Cookies:</strong> These cookies collect information about how you use our website, such as which pages you visit most often. This data is aggregated and anonymous and is used to improve the website's performance.
          </Paragraph>
        </Section>

        <HighlightBox>
          <SectionTitle>4. Your Choices</SectionTitle>
          <Paragraph>
            You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline them if you prefer. However, this may prevent you from taking full advantage of the website.
          </Paragraph>
        </HighlightBox>
      </Container>
    </PageContainer>
  );
};

export default CookiePolicyPage;
