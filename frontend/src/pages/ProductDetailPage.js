import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { theme } from '../theme/index';
import apiService from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import AudioPlayer from '../components/audio/AudioPlayer';
import Modal from '../components/modals/Modal';
import guestCartService from '../services/guestCart';
import { FiShoppingCart, FiHeart, FiShare2, FiPlay, FiPause } from 'react-icons/fi';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[8]};
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${theme.borderRadius.xl};
`;

const InfoSection = styled.div``;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const Artist = styled.div`
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.lg};
  margin-bottom: ${theme.spacing[6]};
`;

const Price = styled.div`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[6]};
`;

const Description = styled.p`
  color: ${theme.colors.dark[300]};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[8]};
`;

const SamplePreviews = styled.div`
  margin-top: ${theme.spacing[8]};
  padding: ${theme.spacing[6]};
  background: ${theme.colors.dark[800]};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.dark[700]};
`;

const SamplePreviewsTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const SamplePreviewsDescription = styled.p`
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[6]};
  line-height: 1.6;
`;

const SamplesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
`;

const SampleItem = styled.div`
  background: ${theme.colors.dark[700]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.dark[600]};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${theme.colors.primary[500]};
    transform: translateY(-2px);
  }
`;

const SampleTitle = styled.div`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[100]};
  margin-bottom: ${theme.spacing[2]};
`;

const SamplePlayer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[3]};
`;

const PlayButton = styled.button`
  background: ${theme.colors.primary[600]};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.primary[700]};
    transform: scale(1.1);
  }
`;

const SampleDuration = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[400]};
`;

const LikeButton = styled(Button)`
  ${props => props.isLiked && `
    background: ${theme.colors.error};
    color: white;
    border-color: ${theme.colors.error};
    
    &:hover {
      background: #dc2626;
      border-color: #dc2626;
    }
  `}
`;

const ShareButton = styled(Button)`
  position: relative;
`;

const ShareDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.colors.dark[800]};
  border: 1px solid ${theme.colors.dark[600]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[2]};
  min-width: 200px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const ShareOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  width: 100%;
  padding: ${theme.spacing[2]};
  background: none;
  border: none;
  color: ${theme.colors.dark[100]};
  text-align: left;
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.dark[700]};
  }
`;

const ProductDetailPage = ({ onAuthClick }) => {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [playingSample, setPlayingSample] = useState(null);
  const [sampleAudio, setSampleAudio] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isInGuestCart, setIsInGuestCart] = useState(false);
  const [samples, setSamples] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const result = await apiService.getProduct(id);
        if (result.success) {
          setProduct(result.data);
          // Check if product is liked by current user
          if (user && user.liked_products) {
            const liked = user.liked_products.some(p => p === result.data.id);
            setIsLiked(liked);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, user]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sampleAudio) {
        sampleAudio.pause();
        sampleAudio.src = '';
      }
    };
  }, [sampleAudio]);

  // Check cart status for guest users
  useEffect(() => {
    if (!user && product) {
      const checkCartStatus = () => {
        const freshCart = guestCartService.loadCart();
        const inCart = freshCart.items.some(item => item.id === product.id);
        setIsInGuestCart(inCart);
      };
      
      // Check immediately
      checkCartStatus();
      
      // Listen for storage events (cart changes in other tabs)
      window.addEventListener('storage', checkCartStatus);
      
      // Listen for custom cart change events
      window.addEventListener('guestCartChanged', checkCartStatus);
      
      return () => {
        window.removeEventListener('storage', checkCartStatus);
        window.removeEventListener('guestCartChanged', checkCartStatus);
      };
    } else {
      // If user is logged in, make sure guest cart state is false
      setIsInGuestCart(false);
    }
  }, [product?.id, user]);

  // Load samples when product loads
  useEffect(() => {
    const loadSamples = async () => {
      if (!product?.id) return;
      
      try {
        setLoadingSamples(true);
        const result = await apiService.getProductSamples(product.id);
        if (result.success) {
          setSamples(result.data || []);
        } else {
          console.error('Failed to load samples:', result.error);
          setSamples([]);
        }
      } catch (error) {
        console.error('Error loading samples:', error);
        setSamples([]);
      } finally {
        setLoadingSamples(false);
      }
    };

    loadSamples();
  }, [product?.id]);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareDropdown && !event.target.closest('[data-share-dropdown]')) {
        setShowShareDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareDropdown]);

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <div>Loading product...</div>
        </Container>
      </PageContainer>
    );
  }

  if (error || !product) {
    return (
      <PageContainer>
        <Container>
          <div>Product not found</div>
        </Container>
      </PageContainer>
    );
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For authenticated users, check if they already purchased this product
    if (isAuthenticated && user) {
      try {
        const result = await apiService.checkProductPurchased(product.id);
        if (result.success && result.data.has_purchased) {
          // User has already purchased this product, show duplicate purchase modal
          alert('You have already purchased this product. Check your profile for downloads.');
          return;
        }
      } catch (error) {
        console.error('❌ Error checking product purchase:', error);
        // Continue with normal flow if check fails
      }
    }
    
    // Normal add to cart flow
    addItem(product);
  };

  const handleAddToGuestCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🛒 Adding product ${product.id} to guest cart`);
    
    try {
      const result = guestCartService.addItem(product);
      console.log(`🛒 AddItem result:`, result);
      
      setIsInGuestCart(true);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('guestCartChanged'));
      
      console.log(`✅ Product ${product.id} added to guest cart. Cart status: ${guestCartService.isInCart(product.id)}`);
    } catch (error) {
      console.error(`❌ Error adding product to guest cart:`, error);
    }
  };

  const handleRemoveFromGuestCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🗑️ Removing product ${product.id} from guest cart`);
    
    try {
      guestCartService.removeItem(product.id);
      setIsInGuestCart(false);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('guestCartChanged'));
      
      console.log(`✅ Product ${product.id} removed from guest cart. Cart status: ${guestCartService.isInCart(product.id)}`);
    } catch (error) {
      console.error(`❌ Error removing product from guest cart:`, error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const result = await apiService.likeProduct(product.id);
      if (result.success) {
        setIsLiked(result.liked);
        // Trigger user data refresh
        window.dispatchEvent(new CustomEvent('userDataUpdated'));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = product.title;
    const text = `Check out "${title}" on Atomic Rose Tools`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
    setShowShareDropdown(false);
  };

  const handleSamplePlay = async (sample) => {
    if (playingSample === sample.id) {
      // Stop current sample
      if (sampleAudio) {
        sampleAudio.pause();
        setSampleAudio(null);
      }
      setPlayingSample(null);
    } else {
      // Stop any currently playing sample
      if (sampleAudio) {
        sampleAudio.pause();
        sampleAudio.src = '';
      }

      try {
        // Get presigned URL for the sample
        const result = await apiService.getSamplePreview(sample.id, product.id);
        if (result.success) {
          const audio = new Audio(result.data.preview_url);
          audio.addEventListener('ended', () => {
            setPlayingSample(null);
            setSampleAudio(null);
          });
          audio.addEventListener('error', (e) => {
            console.error('Error playing sample:', e);
            setPlayingSample(null);
            setSampleAudio(null);
          });
          audio.play();
          setSampleAudio(audio);
          setPlayingSample(sample.id);
        } else {
          console.error('Failed to get sample preview:', result.error);
        }
      } catch (error) {
        console.error('Error playing sample:', error);
      }
    }
  };

  // Use real sample data from the API
  const samplePreviews = samples;


  return (
    <PageContainer>
      <Container>
        <ProductGrid>
          <ImageSection>
            <ProductImage 
              src={product.cover_image_url || '/images/placeholder-product.jpg'} 
              alt={product.title}
              onError={(e) => {
                e.target.src = '/images/missing-product.jpg';
              }}
            />
          </ImageSection>
          
          <InfoSection>
            <Title>{product.title}</Title>
            <Artist>by {product.artist}</Artist>
            <Price>${product.price}</Price>
            <Description>{product.description}</Description>
            
            {/* Audio Player */}
            <AudioPlayer product={product} />
            
            <Actions>
              <Button 
                variant={user ? (isInCart(product.id) ? "secondary" : "primary") : (isInGuestCart ? "secondary" : "primary")} 
                size="lg"
                onClick={(e) => {
                  console.log(`🔘 Button clicked! User:`, user, `isInGuestCart:`, isInGuestCart);
                  if (user) {
                    handleAddToCart(e);
                  } else if (isInGuestCart) {
                    handleRemoveFromGuestCart(e);
                  } else {
                    handleAddToGuestCart(e);
                  }
                }}
                disabled={user ? isInCart(product.id) : false}
                title={
                  user 
                    ? (isInCart(product.id) ? "Added to cart - view cart to checkout" : "Add to cart")
                    : isInGuestCart 
                      ? "Remove from cart"
                      : "Add to cart"
                }
              >
                <FiShoppingCart size={20} />
                {user 
                  ? (isInCart(product.id) ? 'Added to Cart' : `Add to Cart - $${product.price}`)
                  : isInGuestCart
                    ? 'Remove from Cart'
                    : `Add to Cart - $${product.price}`
                }
              </Button>
              <LikeButton 
                variant="ghost" 
                size="lg"
                isLiked={isLiked}
                onClick={handleLike}
              >
                <FiHeart size={20} />
                {isLiked ? 'Liked' : 'Like'}
              </LikeButton>
              <ShareButton 
                variant="ghost" 
                size="lg"
                data-share-dropdown
                onClick={() => setShowShareDropdown(!showShareDropdown)}
              >
                <FiShare2 size={20} />
                Share
                {showShareDropdown && (
                  <ShareDropdown>
                    <ShareOption onClick={() => handleShare('twitter')}>
                      🐦 Share on Twitter
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('facebook')}>
                      📘 Share on Facebook
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('linkedin')}>
                      💼 Share on LinkedIn
                    </ShareOption>
                    <ShareOption onClick={() => handleShare('copy')}>
                      📋 Copy Link
                    </ShareOption>
                  </ShareDropdown>
                )}
              </ShareButton>
            </Actions>
          </InfoSection>
        </ProductGrid>

                {/* Sample Previews Section */}
                <SamplePreviews>
                  <SamplePreviewsTitle>Sample Previews</SamplePreviewsTitle>
                  <SamplePreviewsDescription>
                    Preview individual samples from this pack. Each sample is carefully crafted to showcase the unique character and quality of this collection.
                  </SamplePreviewsDescription>
                  {loadingSamples ? (
                    <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.dark[300] }}>
                      Loading samples...
                    </div>
                  ) : samplePreviews.length > 0 ? (
                    <SamplesGrid>
                      {samplePreviews.map((sample) => (
                        <SampleItem key={sample.id} onClick={() => handleSamplePlay(sample)}>
                          <SampleTitle>{sample.title}</SampleTitle>
                          <SamplePlayer>
                            <PlayButton>
                              {playingSample === sample.id ? <FiPause size={16} /> : <FiPlay size={16} />}
                            </PlayButton>
                            <SampleDuration>{sample.duration}</SampleDuration>
                          </SamplePlayer>
                        </SampleItem>
                      ))}
                    </SamplesGrid>
                  ) : (
                    <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.dark[300] }}>
                      No samples available for preview
                    </div>
                  )}
                </SamplePreviews>
      </Container>
      
      {/* Login Prompt Modal */}
      <Modal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="Sign In Required"
      >
        <div style={{ textAlign: 'center', padding: theme.spacing[6] }}>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing[4] }}>🔒</div>
          <h3 style={{ 
            color: theme.colors.dark[50], 
            marginBottom: theme.spacing[3],
            fontSize: theme.typography.sizes.xl
          }}>
            Sign in to like products
          </h3>
          <p style={{ 
            color: theme.colors.dark[300], 
            marginBottom: theme.spacing[6],
            lineHeight: 1.6
          }}>
            Create an account or sign in to save your favorite products and access your personal collection.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing[3], justifyContent: 'center' }}>
            <Button 
              variant="ghost" 
              onClick={() => setShowLoginPrompt(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowLoginPrompt(false);
                if (onAuthClick) {
                  onAuthClick();
                } else {
                  // Fallback to URL redirect if no callback provided
                  window.location.href = '/#auth';
                }
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default ProductDetailPage;
