'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '../../theme';

const Card = styled(Link)`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[6]};
  text-decoration: none;
  transition: all 300ms ease-in-out;
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows['2xl']};
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${theme.spacing[4]};
  background: ${theme.colors.dark[800]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.dark[700]} 0%, ${theme.colors.dark[800]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const ProductTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin: 0;
  line-height: 1.3;
`;

const ProductDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[300]};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing[4]};
`;

const Price = styled.span`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary[400]};
`;

const Type = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.dark[400]};
  background: rgba(255, 255, 255, 0.05);
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  type: string;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card href={`/products/${product.id}`}>
      <ImageContainer>
        {product.image_url ? (
          <ProductImage 
            src={product.image_url} 
            alt={product.title}
            loading="lazy"
          />
        ) : (
          <PlaceholderImage>
            No Image
          </PlaceholderImage>
        )}
      </ImageContainer>
      
      <ProductInfo>
        <ProductTitle>{product.title}</ProductTitle>
        <ProductDescription>{product.description}</ProductDescription>
        
        <ProductFooter>
          <Price>${product.price.toFixed(2)}</Price>
          <Type>{product.type}</Type>
        </ProductFooter>
      </ProductInfo>
    </Card>
  );
}
