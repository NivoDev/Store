import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { theme } from '../theme';
import { getProductById } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import { FiPlay, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

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

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const { addItem, isInCart } = useCart();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!product) {
    return (
      <PageContainer>
        <Container>
          <div>Product not found</div>
        </Container>
      </PageContainer>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <PageContainer>
      <Container>
        <ProductGrid>
          <ImageSection>
            <ProductImage 
              src={product.image || '/images/placeholder-product.jpg'} 
              alt={product.title}
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
          </ImageSection>
          
          <InfoSection>
            <Title>{product.title}</Title>
            <Artist>by {product.artist}</Artist>
            <Price>${product.price}</Price>
            <Description>{product.description}</Description>
            
            <Actions>
              <Button variant="primary" size="lg" onClick={handlePlay}>
                <FiPlay size={20} />
                {isPlaying ? 'Pause' : 'Play'} Preview
              </Button>
              <Button 
                variant={isInCart(product.id) ? "secondary" : "primary"} 
                size="lg"
                onClick={handleAddToCart}
              >
                <FiShoppingCart size={20} />
                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
              </Button>
              <Button variant="ghost" size="lg">
                <FiHeart size={20} />
              </Button>
              <Button variant="ghost" size="lg">
                <FiShare2 size={20} />
              </Button>
            </Actions>
          </InfoSection>
        </ProductGrid>
      </Container>
    </PageContainer>
  );
};

export default ProductDetailPage;
