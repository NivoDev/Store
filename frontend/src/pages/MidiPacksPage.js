import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import apiService from '../services/api';
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

const MidiPacksPage = ({ onAuthClick }) => {
  const navigate = useNavigate();
    const [midiPacks, setMidiPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from API
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = await apiService.getProducts({ type: 'midi-pack' });
        if (result.success) {
          setMidiPacks(result.data.products || []);
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

  return (
    <PageContainer>
      <SEOHead 
        title="MIDI Packs for Psytrance Production"
        description="Professional MIDI packs for progressive psytrance. Basslines, melodies, arpeggios, and sequences. Compatible with all major DAWs."
        keywords="psytrance MIDI packs, MIDI files, basslines, melodies, psytrance production, electronic music MIDI"
        type="website"
      />
      <Container>
        <Title>MIDI Packs</Title>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            Loading MIDI packs...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        {!loading && !error && midiPacks.length > 0 && (
          <ProductGrid>
            {midiPacks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAuthClick={onAuthClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ProductGrid>
        )}

        {!loading && !error && midiPacks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#94a3b8'
          }}>
            No MIDI packs available at the moment.
          </div>
        )}
      </Container>
    </PageContainer>
  );
};

export default MidiPacksPage;
