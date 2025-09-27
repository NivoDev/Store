import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { theme } from '../theme';
import apiService from '../services/api';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  background: ${theme.colors.gradients.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Card = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.shadows.neon};
`;

const GiftIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${theme.spacing[6]};
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[8]};
  line-height: 1.6;
`;

const DownloadButton = styled.button`
  background: ${theme.colors.gradients.button};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  color: white;
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  transition: all ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  box-shadow: ${theme.shadows.neon};
  
  &:hover:not(:disabled) {
    box-shadow: ${theme.shadows.neonHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: ${theme.spacing[6]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  font-weight: ${theme.typography.weights.medium};
  
  ${props => {
    if (props.type === 'success') {
      return `
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        color: ${theme.colors.success[600]};
      `;
    } else if (props.type === 'error') {
      return `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: ${theme.colors.error};
      `;
    } else {
      return `
        background: rgba(14, 165, 233, 0.1);
        border: 1px solid rgba(14, 165, 233, 0.3);
        color: ${theme.colors.primary[500]};
      `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NewsletterGiftPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downloadData, setDownloadData] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const email = searchParams.get('email');

  useEffect(() => {
    const loadGift = async () => {
      if (!email) {
        setError('Email parameter is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await apiService.downloadNewsletterGift(email);
        
        if (result.success) {
          setDownloadData(result.data);
        } else {
          setError(result.error || 'Failed to load gift');
        }
      } catch (err) {
        console.error('Error loading newsletter gift:', err);
        setError('Failed to load gift. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadGift();
  }, [email]);

  const handleDownload = async () => {
    if (!downloadData?.download_url) return;

    try {
      setDownloading(true);
      
      // Open download in new tab
      window.open(downloadData.download_url, '_blank');
      
      // Show success message briefly
      setTimeout(() => {
        setDownloading(false);
      }, 2000);
      
    } catch (err) {
      console.error('Download error:', err);
      setError('Download failed. Please try again.');
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <Card>
            <GiftIcon>🎁</GiftIcon>
            <Title>Loading Your Gift...</Title>
            <StatusMessage type="info">
              <LoadingSpinner />
              Preparing your free newsletter gift...
            </StatusMessage>
          </Card>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Container>
          <Card>
            <GiftIcon>❌</GiftIcon>
            <Title>Oops! Something went wrong</Title>
            <Subtitle>
              We couldn't load your newsletter gift. This might be because:
            </Subtitle>
            <ul style={{ 
              textAlign: 'left', 
              color: theme.colors.dark[300], 
              marginBottom: theme.spacing[6],
              paddingLeft: theme.spacing[4]
            }}>
              <li>The email link has expired</li>
              <li>You've already downloaded this gift</li>
              <li>There was a technical issue</li>
            </ul>
            <StatusMessage type="error">
              <FiAlertCircle size={20} />
              {error}
            </StatusMessage>
            <DownloadButton 
              onClick={() => navigate('/')}
              style={{ marginTop: theme.spacing[4] }}
            >
              Go to Homepage
            </DownloadButton>
          </Card>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Card>
          <GiftIcon>🎁</GiftIcon>
          <Title>Your Free Newsletter Gift!</Title>
          <Subtitle>
            Thank you for subscribing to our newsletter! Here's your exclusive gift - 
            a special collection of high-quality samples crafted just for our subscribers.
          </Subtitle>
          
          <DownloadButton 
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <LoadingSpinner />
                Downloading...
              </>
            ) : (
              <>
                <FiDownload size={24} />
                Download Your Gift
              </>
            )}
          </DownloadButton>

          {downloading && (
            <StatusMessage type="success">
              <FiCheckCircle size={20} />
              Download started! Check your downloads folder.
            </StatusMessage>
          )}

          <div style={{ 
            marginTop: theme.spacing[8], 
            padding: theme.spacing[4], 
            background: 'rgba(14, 165, 233, 0.1)', 
            borderRadius: theme.borderRadius.lg,
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <h3 style={{ 
              color: theme.colors.dark[50], 
              marginBottom: theme.spacing[2],
              fontSize: theme.typography.sizes.lg
            }}>
              What's in your gift?
            </h3>
            <p style={{ 
              color: theme.colors.dark[300], 
              margin: 0,
              fontSize: theme.typography.sizes.sm
            }}>
              High-quality WAV samples, construction kits, and loops perfect for progressive psytrance production. 
              All samples are royalty-free and ready to use in your DAW.
            </p>
          </div>
        </Card>
      </Container>
    </PageContainer>
  );
};

export default NewsletterGiftPage;
