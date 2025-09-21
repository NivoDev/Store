import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiTrash2, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import guestCartService from '../../services/guestCart';
import GuestPurchaseModal from './GuestPurchaseModal';
import PurchaseSuccessModal from './PurchaseSuccessModal';
import apiService from '../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
`;

const CartItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const ItemArtist = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0 0 8px 0;
`;

const ItemPrice = styled.div`
  color: #06b6d4;
  font-size: 16px;
  font-weight: 700;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  color: #ffffff;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
  }
`;

const CartSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SummaryLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
`;

const SummaryValue = styled.span`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;

  &.total {
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0891b2 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyCartIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const GuestCartModal = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCart(guestCartService.getCart());
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    guestCartService.updateQuantity(productId, newQuantity);
    setCart(guestCartService.getCart());
  };

  const handleRemoveItem = (productId) => {
    guestCartService.removeItem(productId);
    setCart(guestCartService.getCart());
  };

  const handleCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handlePurchase = async (customerEmail, customerName) => {
    setIsProcessing(true);
    
    try {
      // For now, we'll just purchase the first item as a demo
      // In a real implementation, you'd want to handle multiple items
      const firstItem = cart.items[0];
      const idempotencyKey = `guest-cart-${customerEmail}-${Date.now()}`;
      
      const result = await apiService.guestPurchase(
        firstItem.id, 
        customerEmail, 
        customerName, 
        idempotencyKey
      );
      
      if (result.success) {
        // Clear cart after successful purchase
        guestCartService.clearCart();
        setCart({ items: [], total: 0, count: 0 });
        
        // Show success modal
        setPurchaseData(result.data);
        setShowSuccessModal(true);
        setShowCheckoutModal(false);
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContent>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>

          <Header>
            <Title>Your Cart</Title>
          </Header>

          {cart.items.length === 0 ? (
            <EmptyCart>
              <EmptyCartIcon>🛒</EmptyCartIcon>
              <p>Your cart is empty</p>
              <p>Add some amazing tracks to get started!</p>
            </EmptyCart>
          ) : (
            <>
              <CartItems>
                {cart.items.map((item) => (
                  <CartItem key={item.id}>
                    <ItemImage 
                      src={item.cover_image_url || '/images/placeholder-product.jpg'} 
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = '/images/missing-product.jpg';
                      }}
                    />
                    <ItemDetails>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemArtist>by {item.made_by || item.artist || 'Unknown Artist'}</ItemArtist>
                      <ItemPrice>${item.price}</ItemPrice>
                    </ItemDetails>
                    <QuantityControls>
                      <QuantityButton
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </QuantityButton>
                      <Quantity>{item.quantity}</Quantity>
                      <QuantityButton
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <FiPlus size={14} />
                      </QuantityButton>
                    </QuantityControls>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                      <FiTrash2 size={16} />
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartItems>

              <CartSummary>
                <SummaryRow>
                  <SummaryLabel>Items ({cart.count})</SummaryLabel>
                  <SummaryValue>${cart.total.toFixed(2)}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Total</SummaryLabel>
                  <SummaryValue className="total">${cart.total.toFixed(2)}</SummaryValue>
                </SummaryRow>
              </CartSummary>

              <CheckoutButton 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                <FiShoppingCart size={20} />
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </CheckoutButton>
            </>
          )}
        </ModalContent>
      </ModalOverlay>

      {/* Checkout Modal */}
      <GuestPurchaseModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onPurchase={handlePurchase}
        product={cart.items[0]} // For demo, use first item
        isLoading={isProcessing}
      />

      {/* Success Modal */}
      <PurchaseSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setPurchaseData(null);
          onClose(); // Close cart modal too
        }}
        onDownload={(url) => {
          window.open(url, '_blank');
          setShowSuccessModal(false);
          setPurchaseData(null);
          onClose(); // Close cart modal too
        }}
        product={cart.items[0]} // For demo, use first item
        purchaseData={purchaseData}
      />
    </>
  );
};

export default GuestCartModal;
