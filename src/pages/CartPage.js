import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';

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
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[8]};
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
`;

const CartSummary = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[6]};
  height: fit-content;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${theme.spacing[12]};
  color: ${theme.colors.dark[400]};
`;

const CartPage = () => {
  const { items, total, itemCount, clearCart } = useCart();

  if (itemCount === 0) {
    return (
      <PageContainer>
        <Container>
          <Title>Shopping Cart</Title>
          <EmptyCart>
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart</p>
          </EmptyCart>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Title>Shopping Cart ({itemCount} items)</Title>
        
        <CartGrid>
          <CartItems>
            {items.map((item) => (
              <div key={item.cartId} style={{ 
                padding: theme.spacing[4], 
                borderBottom: '1px solid rgba(255,255,255,0.1)' 
              }}>
                <h4 style={{ color: theme.colors.dark[50] }}>{item.title}</h4>
                <p style={{ color: theme.colors.dark[300] }}>by {item.artist}</p>
                <p style={{ color: theme.colors.dark[50] }}>${item.price} x {item.quantity}</p>
              </div>
            ))}
          </CartItems>
          
          <CartSummary>
            <h3 style={{ color: theme.colors.dark[50], marginBottom: theme.spacing[4] }}>
              Order Summary
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: theme.spacing[4],
              color: theme.colors.dark[300]
            }}>
              <span>Total:</span>
              <span style={{ color: theme.colors.dark[50], fontWeight: 'bold' }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <Button variant="primary" size="lg" fullWidth>
              Proceed to Checkout
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              fullWidth 
              onClick={clearCart}
              style={{ marginTop: theme.spacing[3] }}
            >
              Clear Cart
            </Button>
          </CartSummary>
        </CartGrid>
      </Container>
    </PageContainer>
  );
};

export default CartPage;
