import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPlay, 
  FiArrowRight, 
  FiTrendingUp, 
  FiStar,
  FiMusic,
  FiDisc,
  FiMic
} from 'react-icons/fi';
import { theme } from '../theme';
import { getFeaturedProducts, getBestsellers, getNewProducts } from '../data/mockProducts';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import SEOHead from '../components/common/SEOHead';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gradients.primary};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/hero-bg.jpg') center/cover;
    opacity: 0.1;
    z-index: 0;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  text-align: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
`;

const HeroTitle = styled(motion.h1)`
  font-family: ${theme.typography.fonts.heading};
  font-size: clamp(${theme.typography.sizes['4xl']}, 8vw, ${theme.typography.sizes['7xl']});
  font-weight: ${theme.typography.weights.extrabold};
  background: ${theme.colors.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[6]};
  line-height: 1.1;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.dark[200]};
  margin-bottom: ${theme.spacing[8]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const HeroActions = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
`;

const Section = styled.section`
  padding: ${theme.spacing[20]} ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[16]} ${theme.spacing[4]};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const SectionSubtitle = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.dark[300]};
  max-width: 600px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[4]};
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.primary[400]};
  text-decoration: none;
  font-weight: ${theme.typography.weights.semibold};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border: 2px solid ${theme.colors.primary[500]};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.animation.durations.fast} ${theme.animation.easings.easeInOut};
  margin: 0 auto;
  
  &:hover {
    background: ${theme.colors.primary[500]};
    color: white;
    box-shadow: ${theme.shadows.neon};
  }
`;

const StatsSection = styled.section`
  background: ${theme.colors.gradients.card};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing[16]} ${theme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[8]};
  max-width: 800px;
  margin: 0 auto;
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.extrabold};
  background: ${theme.colors.gradients.neon};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing[2]};
`;

const StatLabel = styled.div`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
`;

const CategoriesSection = styled.section`
  padding: ${theme.spacing[20]} ${theme.spacing[6]};
  background: rgba(255, 255, 255, 0.02);
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[6]};
`;

const CategoryCard = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  text-align: center;
  cursor: pointer;
  transition: all ${theme.animation.durations.normal} ${theme.animation.easings.easeInOut};
  
  &:hover {
    border-color: rgba(14, 165, 233, 0.3);
    box-shadow: ${theme.shadows.neon};
  }
`;

const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${theme.colors.gradients.button};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing[6]};
  color: white;
  box-shadow: ${theme.shadows.neon};
`;

const CategoryTitle = styled.h3`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[3]};
`;

const CategoryDescription = styled.p`
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[6]};
  line-height: 1.6;
`;

const CategoryCount = styled.div`
  color: ${theme.colors.primary[400]};
  font-weight: ${theme.typography.weights.semibold};
`;

const HomePage = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  const featuredProducts = getFeaturedProducts().slice(0, 3);
  const bestsellers = getBestsellers().slice(0, 3);
  const newProducts = getNewProducts().slice(0, 3);

  const handlePlay = (product) => {
    if (currentlyPlaying === product.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(product.id);
      // Here you would integrate with an audio player
      // Audio preview functionality would be implemented here
    }
  };

  const categories = [
    {
      title: 'Sample Packs',
      description: 'High-quality audio samples, loops, and one-shots for your productions',
      icon: FiDisc,
      count: '12 Packs',
      link: '/sample-packs'
    },
    {
      title: 'MIDI Packs',
      description: 'Professional MIDI patterns and sequences for instant inspiration',
      icon: FiMusic,
      count: '8 Packs',
      link: '/midi-packs'
    },
    {
      title: 'Acapellas',
      description: 'Stunning vocal performances and harmonies for your tracks',
      icon: FiMic,
      count: '5 Packs',
      link: '/acapellas'
    }
  ];

  return (
    <PageContainer>
      <SEOHead 
        title="Premium Psytrance Sample Packs & MIDI Packs"
        description="Discover high-quality progressive psytrance sample packs, MIDI packs, and acapellas. Professional sounds for electronic music producers. Instant download available."
        keywords="psytrance sample packs, progressive psytrance, MIDI packs, acapellas, electronic music, music production, psytrance sounds, Atomic Rose Tools"
        type="website"
      />
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Atomic Rose Tools
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium sample packs, MIDI sequences, and acapellas for progressive psytrance producers
          </HeroSubtitle>
          
          <HeroActions
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button variant="primary" size="lg">
              <FiPlay size={20} />
              Explore Catalog
            </Button>
            <Button variant="secondary" size="lg">
              Free Downloads
            </Button>
          </HeroActions>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <Container>
          <StatsGrid>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <StatNumber>25+</StatNumber>
              <StatLabel>Premium Packs</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <StatNumber>500+</StatNumber>
              <StatLabel>Audio Samples</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatNumber>1000+</StatNumber>
              <StatLabel>Happy Producers</StatLabel>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <StatNumber>24/7</StatNumber>
              <StatLabel>Instant Download</StatLabel>
            </StatItem>
          </StatsGrid>
        </Container>
      </StatsSection>

      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>Featured Products</SectionTitle>
            <SectionSubtitle>
              Handpicked premium content from our latest releases
            </SectionSubtitle>
          </SectionHeader>
          
          <ProductGrid>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPlay={handlePlay}
                isPlaying={currentlyPlaying === product.id}
              />
            ))}
          </ProductGrid>
          
          <div style={{ textAlign: 'center' }}>
            <ViewAllButton to="/sample-packs">
              View All Products
              <FiArrowRight size={16} />
            </ViewAllButton>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>
              <FiTrendingUp style={{ marginRight: theme.spacing[3] }} />
              Bestsellers
            </SectionTitle>
            <SectionSubtitle>
              Most popular packs loved by the psytrance community
            </SectionSubtitle>
          </SectionHeader>
          
          <ProductGrid>
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPlay={handlePlay}
                isPlaying={currentlyPlaying === product.id}
              />
            ))}
          </ProductGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>
              <FiStar style={{ marginRight: theme.spacing[3] }} />
              Latest Releases
            </SectionTitle>
            <SectionSubtitle>
              Fresh sounds and cutting-edge productions
            </SectionSubtitle>
          </SectionHeader>
          
          <ProductGrid>
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPlay={handlePlay}
                isPlaying={currentlyPlaying === product.id}
              />
            ))}
          </ProductGrid>
        </Container>
      </Section>

      <CategoriesSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Browse Categories</SectionTitle>
            <SectionSubtitle>
              Find exactly what you're looking for
            </SectionSubtitle>
          </SectionHeader>
          
          <CategoryGrid>
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <CategoryCard
                  key={index}
                  as={Link}
                  to={category.link}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <CategoryIcon>
                    <Icon size={32} />
                  </CategoryIcon>
                  <CategoryTitle>{category.title}</CategoryTitle>
                  <CategoryDescription>{category.description}</CategoryDescription>
                  <CategoryCount>{category.count}</CategoryCount>
                </CategoryCard>
              );
            })}
          </CategoryGrid>
        </Container>
      </CategoriesSection>
    </PageContainer>
  );
};

export default HomePage;
