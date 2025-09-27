import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../contexts/AudioContext';
import apiService from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { FiHeart, FiShoppingBag, FiMail } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[4]};s
  margin-bottom: ${theme.spacing[8]};
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.colors.gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes['2xl']};
  color: white;
  font-weight: ${theme.typography.weights.bold};
`;

const UserDetails = styled.div`
  text-align: left;
`;

const UserName = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const UserEmail = styled.p`
  color: ${theme.colors.dark[300]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const ThankYouMessage = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  margin-top: ${theme.spacing[6]};
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${theme.colors.gradients.neon};
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }
`;

const ThankYouText = styled.p`
  color: ${theme.colors.success[400]};
  font-size: ${theme.typography.sizes.base};
  margin: 0;
  font-weight: ${theme.typography.weights.semibold};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;


const TabsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[8]};
  border-bottom: 1px solid ${theme.colors.dark[200]};
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
  color: ${props => props.active ? theme.colors.primary[500] : theme.colors.dark[400]};
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary[500] : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  &:hover {
    color: ${theme.colors.primary[500]};
  }
`;

const ContentSection = styled.div`
  min-height: 400px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  margin-top: ${theme.spacing[6]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.dark[400]};
`;

const EmptyIcon = styled.div`
  font-size: ${theme.typography.sizes['6xl']};
  margin-bottom: ${theme.spacing[4]};
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[300]};
  margin: 0 0 ${theme.spacing[2]} 0;
`;

const EmptyDescription = styled.p`
  color: ${theme.colors.dark[400]};
  margin: 0;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.dark[400]};
`;

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { playTrack, isCurrentTrack, isTrackPlaying } = useAudio();
  const [activeTab, setActiveTab] = useState('liked');
  const [likedProducts, setLikedProducts] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProducts();
    }
  }, [isAuthenticated]);

  const loadUserProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [likedResult, purchasedResult] = await Promise.all([
        apiService.getLikedProducts(),
        apiService.getPurchasedProducts()
      ]);

      if (likedResult.success) {
        setLikedProducts(likedResult.data.products || []);
      } else {
        console.error('Failed to load liked products:', likedResult.error);
      }

      if (purchasedResult.success) {
        setPurchasedProducts(purchasedResult.data.products || []);
      } else {
        console.error('Failed to load purchased products:', purchasedResult.error);
      }
    } catch (err) {
      console.error('Error loading user products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async (productId) => {
    // This would be called from ProductCard when user likes/unlikes
    // For now, just reload the data
    await loadUserProducts();
  };

  const handleDownload = async (productId) => {
    setDownloading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const result = await apiService.getDownloadUrl(productId);
      if (result.success) {
        // Open download URL in new tab
        window.open(result.data.download_url, '_blank');
      } else {
        console.error('Download failed:', result.error);
        alert('Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handlePlay = (product) => {
    console.log('Playing product:', product);
    playTrack(product);
  };

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <Title>Profile</Title>
            <EmptyState>
              <EmptyIcon>👤</EmptyIcon>
              <EmptyTitle>Please sign in to view your profile</EmptyTitle>
              <EmptyDescription>Sign in to see your liked and purchased products</EmptyDescription>
            </EmptyState>
          </Header>
        </Container>
      </PageContainer>
    );
  }

  const currentProducts = activeTab === 'liked' ? likedProducts : purchasedProducts;
  const tabTitle = activeTab === 'liked' ? 'Liked Products' : 'Purchased Products';

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>My Profile</Title>
          <UserInfo>
            <UserAvatar>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </UserAvatar>
            <UserDetails>
              <UserName>{user?.name}</UserName>
              <UserEmail>
                <FiMail size={16} />
                {user?.email}
              </UserEmail>
            </UserDetails>
          </UserInfo>
          
          {purchasedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ThankYouMessage>
                <ThankYouText>
                  🎉 Thank you for your purchase! Welcome to the Atomic Rose community! Check your email for download links.
                </ThankYouText>
              </ThankYouMessage>
            </motion.div>
          )}
        </Header>

        <TabsContainer>
          <Tab 
            active={activeTab === 'liked'} 
            onClick={() => setActiveTab('liked')}
          >
            <FiHeart />
            Liked Products ({likedProducts.length})
          </Tab>
          <Tab 
            active={activeTab === 'purchased'} 
            onClick={() => setActiveTab('purchased')}
          >
            <FiShoppingBag />
            Purchased Products ({purchasedProducts.length})
          </Tab>
        </TabsContainer>

        <ContentSection>
          {loading ? (
            <LoadingSpinner>Loading...</LoadingSpinner>
          ) : error ? (
            <EmptyState>
              <EmptyIcon>⚠️</EmptyIcon>
              <EmptyTitle>Error loading products</EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
            </EmptyState>
          ) : currentProducts.length === 0 ? (
            <EmptyState>
              <EmptyIcon>{activeTab === 'liked' ? '❤️' : '🛍️'}</EmptyIcon>
              <EmptyTitle>No {tabTitle.toLowerCase()}</EmptyTitle>
              <EmptyDescription>
                {activeTab === 'liked' 
                  ? "You haven't liked any products yet. Start exploring and like products you're interested in!"
                  : "You haven't purchased any products yet. Browse our collection and make your first purchase!"
                }
              </EmptyDescription>
            </EmptyState>
          ) : (
            <ProductsGrid>
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPlay={handlePlay}
                  isPlaying={isCurrentTrack(product.id) && isTrackPlaying(product.id)}
                  onLikeToggle={handleLikeToggle}
                  showDownloadButton={activeTab === 'purchased'}
                  onDownload={() => handleDownload(product.id)}
                  isDownloading={downloading[product.id]}
                />
              ))}
            </ProductsGrid>
          )}
        </ContentSection>
      </Container>
    </PageContainer>
  );
};

export default ProfilePage;
