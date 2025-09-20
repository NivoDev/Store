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
  const [orderNumber, setOrderNumber] = useState('');
  const [downloadsRemaining, setDownloadsRemaining] = useState(0);

  const fetchDownloadLinks = async (orderNumber) => {
    try {
      setLoading(true);
      console.log('🔄 Fetching fresh download links for order:', orderNumber);
      
      const response = await fetch(`https://store-6ryk.onrender.com/api/v1/guest-downloads/${orderNumber}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Fresh download links fetched:', data);
      
      if (data.download_links && data.download_links.length > 0) {
        setDownloadLinks(data.download_links);
        setOrderNumber(data.order_number);
        setDownloadsRemaining(data.downloads_remaining);
        setError(null);
      } else {
        setError('No download links available for this order.');
      }
    } catch (error) {
      console.error('❌ Error fetching download links:', error);
      setError(`Failed to load download links: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get download links from URL state, query params, or localStorage
    const state = location.state;
    const urlParams = new URLSearchParams(location.search);
    const orderFromUrl = urlParams.get('order');
    
    console.log('🔍 GuestDownloadPage - Location state:', state);
    console.log('🔍 GuestDownloadPage - Order from URL:', orderFromUrl);
    console.log('🔍 GuestDownloadPage - Download links from state:', state?.downloadLinks);
    
    // Priority 1: Order number from URL query parameter (email link)
    if (orderFromUrl) {
      console.log('📧 Guest accessed via email link, fetching fresh data for order:', orderFromUrl);
      fetchDownloadLinks(orderFromUrl);
    }
    // Priority 2: Order number from location state (payment completion)
    else if (state?.orderNumber) {
      console.log('💳 Guest accessed after payment completion, fetching fresh data for order:', state.orderNumber);
      fetchDownloadLinks(state.orderNumber);
    }
    // Priority 3: Download links from location state
    else if (state && state.downloadLinks && state.downloadLinks.length > 0) {
      console.log('✅ Using download links from state');
      setDownloadLinks(state.downloadLinks);
      setLoading(false);
    }
    // Priority 4: Fallback to localStorage (deprecated, but for backward compatibility)
    else {
      const storedLinks = localStorage.getItem('guest_download_links');
      console.log('🔍 GuestDownloadPage - Stored links from localStorage:', storedLinks);
      if (storedLinks) {
        try {
          const parsedLinks = JSON.parse(storedLinks);
          console.log('⚠️ Using deprecated localStorage data:', parsedLinks);
          if (parsedLinks && parsedLinks.length > 0) {
            setDownloadLinks(parsedLinks);
            // Clear localStorage since we're using it
            localStorage.removeItem('guest_download_links');
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
  }, [location.state, location.search]);

  const handleDownload = async (productId, downloadUrl) => {
    setDownloading(prev => ({ ...prev, [productId]: true }));
    
    try {
      // Check if we have downloads remaining
      if (downloadsRemaining <= 0) {
        setError('No downloads remaining for this order.');
        return;
      }
      
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
      
      // Decrease downloads remaining
      setDownloadsRemaining(prev => prev - 1);
      
      console.log(`✅ Download started for product ${productId}`);
      
      // If no downloads remaining, refresh the page to get updated status
      if (downloadsRemaining <= 1) {
        setTimeout(() => {
          if (orderNumber) {
            fetchDownloadLinks(orderNumber);
          }
        }, 2000);
      }
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

  // Special case: If coming from payment completion (has orderNumber but no downloads yet)
  const isFromPaymentCompletion = location.state?.orderNumber && downloadLinks.length === 0 && !error && !loading;
  
  if (isFromPaymentCompletion) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Thank You! 🎉</Title>
            <Subtitle>
              Your payment has been processed successfully!
            </Subtitle>
          </Header>

          <DownloadInfo style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            border: '1px solid rgba(34, 197, 94, 0.3)',
            marginBottom: theme.spacing[6]
          }}>
            <InfoText style={{ 
              color: '#22c55e',
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing[3]
            }}>
              ✅ Payment Successful!
            </InfoText>
            <InfoText style={{ 
              color: theme.colors.dark[200],
              fontSize: theme.typography.sizes.base,
              lineHeight: 1.6
            }}>
              Your download links have been sent to your email address. 
              Please check your inbox (and spam folder) for an email with the subject "Thank You for Your Purchase!"
            </InfoText>
          </DownloadInfo>

          <DownloadInfo style={{ 
            background: 'rgba(0, 255, 255, 0.1)', 
            border: '1px solid rgba(0, 255, 255, 0.3)'
          }}>
            <InfoText style={{ 
              color: '#00ffff',
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium
            }}>
              📧 Click the "Access Your Downloads" button in your email to download your files.
            </InfoText>
          </DownloadInfo>

          <div style={{ textAlign: 'center', marginTop: theme.spacing[8] }}>
            <BackButton onClick={handleBackToHome}>
              Back to Home
            </BackButton>
          </div>
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
          {downloadsRemaining > 0 && (
            <InfoText style={{ 
              marginTop: '16px', 
              color: '#00ffff',
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium
            }}>
              ⬇️ Downloads remaining: {downloadsRemaining}
            </InfoText>
          )}
          {downloadsRemaining === 0 && (
            <InfoText style={{ 
              marginTop: '16px', 
              color: '#ff6b6b',
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.medium
            }}>
              ⚠️ No downloads remaining for this order
            </InfoText>
          )}
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
                disabled={link.downloaded || downloading[link.product_id] || downloadsRemaining <= 0}
              >
                {downloading[link.product_id] ? (
                  <>
                    <LoadingSpinner />
                    Downloading...
                  </>
                ) : link.downloaded ? (
                  'Downloaded ✓'
                ) : downloadsRemaining <= 0 ? (
                  'No Downloads Remaining'
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
