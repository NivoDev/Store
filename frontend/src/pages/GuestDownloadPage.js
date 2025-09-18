import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: ${theme.spacing[8]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  background: ${theme.colors.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[4]};
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[6]};
  line-height: 1.6;
`;

const DownloadCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[6]};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.gradients.neon};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 255, 255, 0.3);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: ${theme.spacing[3]};
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.md};
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: rgba(0, 255, 255, 0.4);
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 255, 255, 0.2);
  }
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductArtist = styled.p`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[2]};
`;

const ProductPrice = styled.p`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary[400]};
  margin: 0;
`;

const DownloadSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${theme.spacing[4]};
`;

const DownloadButton = styled.button`
  background: ${theme.colors.gradients.neon};
  border: none;
  color: white;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DownloadInfo = styled.div`
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${theme.colors.gradients.neon};
  }
`;

const InfoText = styled.p`
  color: ${theme.colors.primary[300]};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
  font-weight: ${theme.typography.weights.medium};
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  text-align: center;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
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

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${theme.colors.dark[300]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${theme.spacing[6]};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${theme.colors.dark[50]};
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);

    &::before {
      left: 100%;
    }
  }
`;

const GuestDownloadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    // Get download links from URL state or localStorage
    const state = location.state;
    console.log('🔍 GuestDownloadPage - Location state:', state);
    console.log('🔍 GuestDownloadPage - Download links from state:', state?.downloadLinks);
    
    if (state && state.downloadLinks && state.downloadLinks.length > 0) {
      console.log('✅ Using download links from state');
      setDownloadLinks(state.downloadLinks);
      setLoading(false);
    } else {
      // Try to get from localStorage as fallback
      const storedLinks = localStorage.getItem('guest_download_links');
      console.log('🔍 GuestDownloadPage - Stored links from localStorage:', storedLinks);
      if (storedLinks) {
        try {
          const parsedLinks = JSON.parse(storedLinks);
          console.log('✅ Using download links from localStorage:', parsedLinks);
          if (parsedLinks && parsedLinks.length > 0) {
            setDownloadLinks(parsedLinks);
          } else {
            setError('No download links found. Please complete your purchase first.');
          }
        } catch (e) {
          console.error('Error parsing stored download links:', e);
          setError('Invalid download data. Please complete your purchase again.');
        }
      } else {
        setError('No download links found. Please complete your purchase first.');
      }
      setLoading(false);
    }
  }, [location.state]);

  const handleDownload = async (productId, downloadUrl) => {
    setDownloading(prev => ({ ...prev, [productId]: true }));
    
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Mark as downloaded (disable button)
      setDownloadLinks(prev => 
        prev.map(link => 
          link.product_id === productId 
            ? { ...link, downloaded: true }
            : link
        )
      );
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download file. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleBackToHome = () => {
    // Clear stored download links
    localStorage.removeItem('guest_download_links');
    navigate('/');
  };

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
            <LoadingSpinner />
            <p style={{ marginTop: theme.spacing[4], color: theme.colors.dark[300] }}>
              Loading your downloads...
            </p>
          </div>
        </Container>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Download Error</Title>
            <ErrorMessage>
              <ErrorText>{error}</ErrorText>
            </ErrorMessage>
            <BackButton onClick={handleBackToHome}>
              Back to Home
            </BackButton>
          </Header>
        </Container>
      </PageContainer>
    );
  }

  if (downloadLinks.length === 0) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>No Downloads Available</Title>
            <Subtitle>
              It looks like you don't have any downloads available at the moment.
            </Subtitle>
            <BackButton onClick={handleBackToHome}>
              Back to Home
            </BackButton>
          </Header>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Thank You! 🎉</Title>
          <Subtitle>
            Your purchase has been completed successfully! Download your purchased products below. 
            Each download link can only be used once.
          </Subtitle>
        </Header>

        <DownloadInfo>
          <InfoText>
            ⚠️ Each download link can only be used once. Make sure to save your files after downloading.
          </InfoText>
        </DownloadInfo>

        <DownloadInfo style={{ 
          background: 'rgba(34, 197, 94, 0.1)', 
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: theme.spacing[6],
          position: 'relative'
        }}>
          <InfoText style={{ 
            color: '#22c55e',
            fontSize: theme.typography.sizes.base,
            fontWeight: theme.typography.weights.medium
          }}>
            📧 A download link has been sent to your email address for additional access. 
            Check your inbox and spam folder.
          </InfoText>
        </DownloadInfo>

        {downloadLinks.map((link) => (
          <DownloadCard key={link.product_id}>
            <ProductInfo>
              <ProductImage 
                src={link.cover_image_url || '/images/placeholder-product.jpg'} 
                alt={link.title}
                onError={(e) => {
                  e.target.src = '/images/missing-product.jpg';
                }}
              />
              <ProductDetails>
                <ProductTitle>{link.title}</ProductTitle>
                <ProductArtist>by {link.artist}</ProductArtist>
                <ProductPrice>{link.price}</ProductPrice>
              </ProductDetails>
            </ProductInfo>
            
            <DownloadSection>
              <DownloadButton
                onClick={() => handleDownload(link.product_id, link.download_url)}
                disabled={link.downloaded || downloading[link.product_id]}
              >
                {downloading[link.product_id] ? (
                  <>
                    <LoadingSpinner />
                    Downloading...
                  </>
                ) : link.downloaded ? (
                  'Downloaded ✓'
                ) : (
                  'Download Now'
                )}
              </DownloadButton>
            </DownloadSection>
          </DownloadCard>
        ))}

        <div style={{ textAlign: 'center', marginTop: theme.spacing[8] }}>
          <BackButton onClick={handleBackToHome}>
            Back to Home
          </BackButton>
        </div>
      </Container>
    </PageContainer>
  );
};

export default GuestDownloadPage;
