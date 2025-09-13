import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { getProductsByType } from '../data/mockProducts';
import ProductCard from '../components/product/ProductCard';
import SEOHead from '../components/common/SEOHead';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  margin-top: ${theme.spacing[8]};
`;

const AcapellasPage = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const acapellas = getProductsByType('acapella');

  const handlePlay = (product) => {
    setCurrentlyPlaying(currentlyPlaying === product.id ? null : product.id);
  };

  return (
    <PageContainer>
      <SEOHead 
        title="Psytrance Acapellas & Vocals"
        description="Professional acapellas and vocal samples for psytrance production. Ethereal voices, chants, and vocal elements for electronic music."
        keywords="psytrance acapellas, vocal samples, psytrance vocals, chants, ethereal voices, electronic music vocals"
        type="website"
      />
      <Container>
        <Title>Acapellas</Title>
        <ProductGrid>
          {acapellas.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPlay={handlePlay}
              isPlaying={currentlyPlaying === product.id}
            />
          ))}
        </ProductGrid>
      </Container>
    </PageContainer>
  );
};

export default AcapellasPage;
