'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/theme';
import ProductCard from '@/components/product/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { apiService } from '@/services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: ${theme.spacing[8]} 0;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: ${theme.spacing[16]} 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  margin-bottom: ${theme.spacing[16]};
`;

const HeroTitle = styled.h1`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[6]};
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.dark[300]};
  max-width: 600px;
  margin: 0 auto ${theme.spacing[8]};
  line-height: 1.6;
`;

const ProductsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[16]};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.error};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing[8]} 0;
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

interface HomePageProps {
  initialProducts: Product[];
}

export default function HomePage({ initialProducts }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no initial products, fetch them
    if (initialProducts.length === 0) {
      fetchProducts();
    }
  }, [initialProducts.length]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.getProducts({ limit: 8, featured: true });
      if (result.success) {
        setProducts(result.data.products || []);
      } else {
        setError(result.error || 'Failed to load products');
      }
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Main>
        <HeroSection>
          <HeroTitle>Atomic Rose Tools</HeroTitle>
          <HeroSubtitle>
            Premium Psytrance Sample Packs, MIDI Files & Acapellas
          </HeroSubtitle>
        </HeroSection>

        <ProductsSection>
          <SectionTitle>Featured Products</SectionTitle>
          
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading products...
            </div>
          ) : (
            <ProductsGrid>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductsGrid>
          )}

          {products.length === 0 && !loading && !error && (
            <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.dark[400] }}>
              No products available at the moment.
            </div>
          )}
        </ProductsSection>
      </Main>
      <Footer />
    </Container>
  );
}
