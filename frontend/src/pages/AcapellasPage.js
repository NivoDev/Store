import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import apiService from '../services/api';
import ProductCard from '../components/product/ProductCard';
import SEOHead from '../components/common/SEOHead';
import { useAudio } from '../contexts/AudioContext';

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

const AcapellasPage = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const { playTrack, isCurrentTrack, isTrackPlaying } = useAudio();
  const [acapellas, setAcapellas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from API
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await apiService.getProducts({ type: 'acapella' });
        if (result.success) {
          setAcapellas(result.data.products || []);
        } else {
          setError(result.error || 'Failed to load products');
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

    const handleAddToCart = (product) => {
    console.log('Product added to cart:', product);
    // Redirect to cart page
    navigate('/cart');
  };

  const handlePlay = (product) => {
    console.log('Playing product:', product);
    playTrack(product);
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
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            Loading acapellas...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        {!loading && !error && acapellas.length > 0 && (
          <ProductGrid>
            {acapellas.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPlay={handlePlay}
                isPlaying={isCurrentTrack(product.id) && isTrackPlaying(product.id)}
                onAuthClick={onAuthClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ProductGrid>
        )}

        {!loading && !error && acapellas.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#94a3b8'
          }}>
            No acapellas available at the moment.
          </div>
        )}
      </Container>
    </PageContainer>
  );
};

export default AcapellasPage;
