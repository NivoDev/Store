import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';

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
`;

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Container>
          <Title>Profile</Title>
          <div style={{ 
            textAlign: 'center', 
            padding: theme.spacing[12],
            color: theme.colors.dark[300]
          }}>
            <p>Please sign in to view your profile</p>
          </div>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Title>Profile</Title>
        <div style={{ color: theme.colors.dark[300] }}>
          <h3 style={{ color: theme.colors.dark[50] }}>Welcome, {user?.name}</h3>
          <p>Email: {user?.email}</p>
        </div>
      </Container>
    </PageContainer>
  );
};

export default ProfilePage;
