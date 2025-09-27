import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { theme } from '../theme';
import apiService from '../services/api';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
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

const Header = styled.div`
  margin-bottom: ${theme.spacing[8]};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[6]};
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[8]};
  flex-wrap: wrap;
`;

const SearchAndFilter = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex: 1;
  max-width: 600px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]} ${theme.spacing[12]};
  color: ${theme.colors.dark[100]};
  font-size: ${theme.typography.sizes.base};
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.dark[400]};
`;

const FilterButton = styled(Button)`
  min-width: 120px;
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[1]};
`;

const ViewButton = styled.button`
  background: ${props => props.active ? theme.colors.gradients.button : 'transparent'};
  border: none;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.active ? 'white' : theme.colors.dark[300]};
  cursor: pointer;
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  
  &:hover:not(:disabled) {
    color: ${props => props.active ? 'white' : theme.colors.dark[200]};
  }
`;

const FilterSection = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[6]};
`;

const FilterGroup = styled.div``;

const FilterTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[3]};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.dark[300]};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.dark[200]};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${theme.colors.primary[500]};
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.dark[300]};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.view === 'grid' 
      ? 'repeat(auto-fit, minmax(300px, 1fr))' 
      : '1fr'
  };
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[4]};
  }
`;

const AcapellasPage = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const { playTrack, isCurrentTrack, isTrackPlaying } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [acapellas, setAcapellas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: [],
    bpm: [],
    price: []
  });

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
