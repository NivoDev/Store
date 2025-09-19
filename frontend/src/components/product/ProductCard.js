import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPlay, 
  FiPause, 
  FiShoppingCart, 
  FiHeart, 
  FiClock,
  FiMusic,
  FiTag,
  FiDownload
} from 'react-icons/fi';
import { theme } from '../../theme';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Modal from '../modals/Modal';
import apiService from '../../services/api';
import guestCartService from '../../services/guestCart';
import GuestPurchaseModal from '../modals/GuestPurchaseModal';
import PurchaseSuccessModal from '../modals/PurchaseSuccessModal';

const Card = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  
  &:hover {
    border-color: rgba(14, 165, 233, 0.3);
    box-shadow: ${theme.shadows.neon};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
  opacity: 0;
  transition: opacity ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled(motion.button)`
  background: ${theme.colors.gradients.button};
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: ${theme.shadows.neon};
  
  &:hover {
    box-shadow: ${theme.shadows.neonHover};
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: ${theme.spacing[3]};
  left: ${theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  z-index: 2;
`;

const Badge = styled.div`
  background: ${props => {
    if (props.type === 'new') return theme.colors.neon.green;
    if (props.type === 'bestseller') return theme.colors.neon.orange;
    if (props.type === 'featured') return theme.colors.neon.purple;
    if (props.type === 'discount') return theme.colors.error;
    return theme.colors.primary[500];
  }};
  color: white;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FavoriteButton = styled(motion.button)`
  position: absolute;
  top: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  z-index: 2;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
    color: ${theme.colors.error};
  }
  
  &.active {
    color: ${theme.colors.error};
  }
`;

const Content = styled.div`
  padding: ${theme.spacing[4]};
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing[3]};
`;

const Title = styled(Link)`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  text-decoration: none;
  display: block;
  margin-bottom: ${theme.spacing[1]};
  
  &:hover {
    color: ${theme.colors.primary[400]};
  }
`;

const Artist = styled.div`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const Genre = styled.div`
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing[2]};
`;

const Description = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.5;
  margin-bottom: ${theme.spacing[3]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[4]};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.dark[400]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const Price = styled.div`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
`;

const OriginalPrice = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[400]};
  text-decoration: line-through;
`;

const DiscountPercent = styled.div`
  background: ${theme.colors.error};
  color: white;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
`;

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
`;

const ProductCard = ({ product, onPlay, isPlaying, className, showDownload, onDownload, onLikeToggle, showDownloadButton, isDownloading, canDownload = true, downloadsRemaining = 0, onAuthClick, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [isInGuestCart, setIsInGuestCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addItem, isInCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Check if item is in guest cart on mount and when cart changes
  React.useEffect(() => {
    if (!user) {
      // Force reload the cart to get fresh state
      const freshCart = guestCartService.loadCart();
      const inCart = freshCart.items.some(item => item.id === product.id);
      console.log(`🔍 Initial cart check for product ${product.id}: ${inCart}`);
      console.log(`🔍 Cart items:`, freshCart.items.map(item => item.id));
      console.log(`🔍 Cart total items:`, freshCart.items.length);
      
      // Debug the cart state
      guestCartService.debugCart();
      
      setIsInGuestCart(inCart);
    } else {
      // If user is logged in, make sure guest cart state is false
      setIsInGuestCart(false);
    }
  }, [product.id, user]);

  // Listen for cart changes (when items are added/removed)
  React.useEffect(() => {
    if (!user) {
      const checkCartStatus = () => {
        // Force reload the cart to get fresh state
        const freshCart = guestCartService.loadCart();
        const inCart = freshCart.items.some(item => item.id === product.id);
        console.log(`🔍 Checking cart status for product ${product.id}: ${inCart}`);
        console.log(`🔍 Cart items:`, freshCart.items.map(item => item.id));
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
  }, [product.id, user]);

  // Check if product is liked on mount
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Check if product is in user's liked products
      const likedProducts = user.liked_products || [];
      setIsFavorite(likedProducts.includes(product.id));
    }
  }, [isAuthenticated, user, product.id]);

  // Image handling
  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    
    // Call the callback if provided (for redirect functionality)
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    try {
      // Always call the like endpoint (it handles toggle)
      const result = await apiService.likeProduct(product.id);
      if (result.success) {
        // Update the local state based on the response
        setIsFavorite(result.liked);
        if (onLikeToggle) {
          onLikeToggle(product.id);
        }
        
        // Refresh user data to get updated liked_products
        // This will trigger a re-render with the correct like status
        window.dispatchEvent(new CustomEvent('userDataUpdated'));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(product);
  };

  const handleAddToGuestCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🛒 Adding product ${product.id} to guest cart`);
    console.log(`🛒 Product data:`, product);
    console.log(`🛒 User state:`, user);
    console.log(`🛒 isInGuestCart state:`, isInGuestCart);
    
    try {
      const result = guestCartService.addItem(product);
      console.log(`🛒 AddItem result:`, result);
      
      setIsInGuestCart(true);
      console.log(`🛒 Set isInGuestCart to true`);
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('guestCartChanged'));
      
      console.log(`✅ Product ${product.id} added to guest cart. Cart status: ${guestCartService.isInCart(product.id)}`);
      
      // Debug cart state
      guestCartService.debugCart();
      
      // Call the callback if provided (for redirect functionality)
      if (onAddToCart) {
        onAddToCart(product);
      }
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
      
      // Debug cart state
      guestCartService.debugCart();
    } catch (error) {
      console.error(`❌ Error removing product from guest cart:`, error);
    }
  };


  const processPurchase = async (customerEmail = null, customerName = null) => {
    setIsPurchasing(true);
    
    try {
      let result;
      
      if (user) {
        // Authenticated user purchase
        const idempotencyKey = `${user.id}-${product.id}-${Date.now()}`;
        result = await apiService.mockPurchase(product.id, idempotencyKey);
      } else {
        // Guest purchase with modal data
        const idempotencyKey = `guest-${customerEmail}-${product.id}-${Date.now()}`;
        result = await apiService.guestPurchase(product.id, customerEmail, customerName, idempotencyKey);
        setShowGuestModal(false); // Close modal on success
      }
      
      if (result.success) {
        // Store purchase data and show success modal
        setPurchaseData(result.data);
        setShowSuccessModal(true);
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
      if (!user) {
        setShowGuestModal(false); // Close modal on error
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDuration = (duration) => {
    if (duration === 'N/A') return 'N/A';
    return duration;
  };

  const getBadges = () => {
    const badges = [];
    if (product.new) badges.push({ type: 'new', text: 'New' });
    if (product.bestseller) badges.push({ type: 'bestseller', text: 'Bestseller' });
    if (product.featured) badges.push({ type: 'featured', text: 'Featured' });
    if (product.discount > 0) badges.push({ type: 'discount', text: `-${product.discount}%` });
    return badges;
  };

  return (
    <>
    <Card
      className={className}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <ImageContainer>
        <ProductImage 
          src={imageError ? '/images/missing-product.jpg' : (product.cover_image_url || '/images/placeholder-product.jpg')} 
          alt={product.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        <ImageOverlay>
          <PlayButton
            onClick={handlePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
          </PlayButton>
        </ImageOverlay>

        <BadgeContainer>
          {getBadges().map((badge, index) => (
            <Badge key={index} type={badge.type}>
              {badge.text}
            </Badge>
          ))}
        </BadgeContainer>

        <FavoriteButton
          className={isFavorite ? 'active' : ''}
          onClick={handleFavorite}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </FavoriteButton>
      </ImageContainer>

      <Content>
        <Header>
          <Genre>{product.genre}</Genre>
          <Title to={`/product/${product.id}`}>{product.title}</Title>
          <Artist>by {product.artist}</Artist>
        </Header>

        <Description>{product.description}</Description>

        <MetaInfo>
          <MetaItem>
            <FiMusic size={12} />
            {product.samples} samples
          </MetaItem>
          <MetaItem>
            <FiClock size={12} />
            {formatDuration(product.duration)}
          </MetaItem>
          <MetaItem>
            <FiTag size={12} />
            {product.bpm}
          </MetaItem>
        </MetaInfo>

        <PriceContainer>
          <PriceInfo>
            <Price>${product.price}</Price>
            {product.originalPrice && (
              <OriginalPrice>${product.originalPrice}</OriginalPrice>
            )}
            {product.discount > 0 && (
              <DiscountPercent>{product.discount}% OFF</DiscountPercent>
            )}
          </PriceInfo>
        </PriceContainer>

        <Actions>
          {showDownloadButton ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={onDownload}
              disabled={isDownloading || !canDownload}
              title={!canDownload ? `No downloads remaining (${downloadsRemaining}/3 used)` : undefined}
            >
              <FiDownload size={16} />
              {isDownloading ? 'Generating...' : 
               !canDownload ? `No Downloads Left (${downloadsRemaining}/3)` :
               `Download (${downloadsRemaining} left)`}
            </Button>
          ) : showDownload ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={onDownload}
            >
              Download
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                size="sm"
                fullWidth
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
                disabled={isPurchasing || (isInCart(product.id) && user)}
                title={
                  user 
                    ? (isInCart(product.id) ? "Added to cart - view cart to checkout" : "Add to cart")
                    : isInGuestCart 
                      ? "Remove from cart"
                      : "Add to cart"
                }
              >
                <FiShoppingCart size={16} />
                {isPurchasing 
                  ? 'Processing...' 
                  : user 
                    ? (isInCart(product.id) ? 'Added to Cart' : `Add to Cart - $${product.price}`)
                    : isInGuestCart
                      ? 'Remove from Cart'
                      : `Add to Cart - $${product.price}`
                }
              </Button>
            </>
          )}
        </Actions>
      </Content>
    </Card>

    {/* Guest Purchase Modal */}
    <GuestPurchaseModal
      isOpen={showGuestModal}
      onClose={() => setShowGuestModal(false)}
      onPurchase={processPurchase}
      product={product}
      isLoading={isPurchasing}
    />

    {/* Purchase Success Modal */}
    <PurchaseSuccessModal
      isOpen={showSuccessModal}
      onClose={() => {
        setShowSuccessModal(false);
        setPurchaseData(null);
      }}
      onDownload={(url) => {
        window.open(url, '_blank');
        setShowSuccessModal(false);
        setPurchaseData(null);
      }}
      product={product}
      purchaseData={purchaseData}
    />
    
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
  </>
  );
};

export default ProductCard;
