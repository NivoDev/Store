import React, { useState } from 'react';
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
  FiTag
} from 'react-icons/fi';
import { theme } from '../../theme';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';

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

const ProductCard = ({ product, onPlay, isPlaying, className }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(product);
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
    <Card
      className={className}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <ImageContainer>
        <ProductImage 
          src={product.image || '/images/placeholder-product.jpg'} 
          alt={product.title}
          onError={(e) => {
            e.target.src = '/images/placeholder-product.jpg';
          }}
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
          <Button
            variant={isInCart(product.id) ? "secondary" : "primary"}
            size="sm"
            fullWidth
            onClick={handleAddToCart}
          >
            <FiShoppingCart size={16} />
            {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
          </Button>
        </Actions>
      </Content>
    </Card>
  );
};

export default ProductCard;
