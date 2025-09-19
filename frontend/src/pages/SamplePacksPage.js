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

const PageContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing[8]} ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]} ${theme.spacing[4]};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing[8]};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
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

const SamplePacksPage = ({ onAuthClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [samplePacks, setSamplePacks] = useState([]);
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
        console.log('🔄 SamplePacksPage: Starting to load products...');
        setLoading(true);
        const result = await apiService.getProducts({ type: 'sample-pack' });
        console.log('📦 SamplePacksPage: API result:', result);
        if (result.success) {
          console.log('✅ SamplePacksPage: Setting products:', result.data.products);
          setSamplePacks(result.data.products || []);
        } else {
          console.error('❌ SamplePacksPage: API error:', result.error);
          setError(result.error || 'Failed to load products');
        }
      } catch (err) {
        console.error('❌ SamplePacksPage: Exception:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = samplePacks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.genre && product.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Genre filter
    if (filters.genre.length > 0) {
      filtered = filtered.filter(product =>
        filters.genre.includes(product.genre)
      );
    }

    // BPM filter
    if (filters.bpm.length > 0) {
      filtered = filtered.filter(product => {
        const productBpm = product.bpm.split('-')[0];
        return filters.bpm.some(range => {
          const [min, max] = range.split('-').map(Number);
          return productBpm >= min && productBpm <= max;
        });
      });
    }

    // Price filter
    if (filters.price.length > 0) {
      filtered = filtered.filter(product => {
        return filters.price.some(range => {
          if (range === 'under-20') return product.price < 20;
          if (range === '20-30') return product.price >= 20 && product.price <= 30;
          if (range === 'over-30') return product.price > 30;
          return true;
        });
      });
    }

    return filtered;
  }, [samplePacks, searchTerm, filters]);

  const handlePlay = (product) => {
    if (currentlyPlaying === product.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(product.id);
      // Audio preview functionality would be implemented here
    }
  };

  const handleAddToCart = (product) => {
    console.log('Product added to cart:', product);
    // Redirect to cart page
    navigate('/cart');
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const filterOptions = {
    genre: ['Progressive Psytrance', 'Full-On Psytrance', 'Forest Psytrance', 'Dark Psytrance'],
    bpm: ['130-135', '136-140', '141-145', '146-150'],
    price: ['under-20', '20-30', 'over-30']
  };

  const filterLabels = {
    'under-20': 'Under $20',
    '20-30': '$20 - $30',
    'over-30': 'Over $30'
  };

  return (
    <PageContainer>
      <SEOHead 
        title="Progressive Psytrance Sample Packs"
        description="Professional progressive psytrance sample packs for electronic music producers. High-quality WAV files, construction kits, and loops. Instant download."
        keywords="progressive psytrance sample packs, psytrance loops, electronic music samples, WAV files, construction kits, psytrance production"
        type="website"
      />
      <Container>
        <Header>
          <Title>Sample Packs</Title>
          <Subtitle>
            Professional sample packs crafted for progressive psytrance producers. 
            High-quality loops, one-shots, and construction kits ready for your DAW.
          </Subtitle>
        </Header>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            Loading sample packs...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <Controls>
          <SearchAndFilter>
            <SearchContainer>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search sample packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            
            <FilterButton
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={16} />
              Filters
            </FilterButton>
          </SearchAndFilter>

          <ViewToggle>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewButton>
          </ViewToggle>
        </Controls>

        {showFilters && (
          <FilterSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FilterGrid>
              {Object.entries(filterOptions).map(([category, options]) => (
                <FilterGroup key={category}>
                  <FilterTitle>{category.charAt(0).toUpperCase() + category.slice(1)}</FilterTitle>
                  <FilterOptions>
                    {options.map(option => (
                      <FilterOption key={option}>
                        <Checkbox
                          type="checkbox"
                          checked={filters[category].includes(option)}
                          onChange={() => handleFilterChange(category, option)}
                        />
                        {filterLabels[option] || option}
                      </FilterOption>
                    ))}
                  </FilterOptions>
                </FilterGroup>
              ))}
            </FilterGrid>
          </FilterSection>
        )}

        <ResultsInfo>
          <div>{filteredProducts.length} sample packs found</div>
          <div>Sorted by: Featured</div>
        </ResultsInfo>

        <ProductGrid view={viewMode}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPlay={handlePlay}
              isPlaying={currentlyPlaying === product.id}
              onAuthClick={onAuthClick}
              onAddToCart={handleAddToCart}
            />
          ))}
        </ProductGrid>

            {filteredProducts.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: theme.spacing[12],
                color: theme.colors.dark[400]
              }}>
                No sample packs found matching your criteria. Try adjusting your filters.
              </div>
            )}
          </>
        )}

        {!loading && !error && samplePacks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: theme.spacing[12],
            color: theme.colors.dark[400]
          }}>
            No sample packs available at the moment.
          </div>
        )}
      </Container>
    </PageContainer>
  );
};

export default SamplePacksPage;
