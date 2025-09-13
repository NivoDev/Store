import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
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
  margin-bottom: ${theme.spacing[8]};
  text-align: center;
`;

const CheckoutPage = () => {
  return (
    <PageContainer>
      <Container>
        <Title>Checkout</Title>
        <div style={{ 
          textAlign: 'center', 
          padding: theme.spacing[12],
          color: theme.colors.dark[300]
        }}>
          <p>Checkout functionality will be integrated with PayMe.io</p>
        </div>
      </Container>
    </PageContainer>
  );
};

export default CheckoutPage;
