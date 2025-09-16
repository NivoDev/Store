import React from 'react';
import styled from 'styled-components';
import { FiX, FiDownload, FiCheck, FiClock } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  color: white;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  margin: 0 0 24px 0;
`;

const ProductInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const ProductTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const ProductArtist = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin: 0 0 4px 0;
`;

const ProductPrice = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: 700;
`;

const ExpiryInfo = styled.div`
  background: ${({ theme }) => theme.colors.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.warning}40;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 14px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${({ theme }) => `${theme.colors.primary}40`};
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const OrderInfo = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PurchaseSuccessModal = ({ 
  isOpen, 
  onClose, 
  onDownload, 
  product,
  purchaseData
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatExpiryTime = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiryDate - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) {
      return 'Expired';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  if (!isOpen || !purchaseData) return null;

  const timeRemaining = formatExpiryTime(purchaseData.expiresAt);

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose} type="button">
          <FiX size={20} />
        </CloseButton>

        <SuccessIcon>
          <FiCheck size={40} />
        </SuccessIcon>

        <Title>Purchase Complete!</Title>
        <Subtitle>Your download is ready</Subtitle>

        <ProductInfo>
          <ProductImage 
            src={product?.cover_image_url || '/images/placeholder-product.jpg'} 
            alt={product?.title}
            onError={(e) => {
              e.target.src = '/images/missing-product.jpg';
            }}
          />
          <ProductDetails>
            <ProductTitle>{product?.title}</ProductTitle>
            <ProductArtist>{product?.artist}</ProductArtist>
            <ProductPrice>${product?.price}</ProductPrice>
          </ProductDetails>
        </ProductInfo>

        <ExpiryInfo>
          <FiClock size={16} />
          Download expires in {timeRemaining}
        </ExpiryInfo>

        <ButtonGroup>
          <SecondaryButton onClick={onClose}>
            Close
          </SecondaryButton>
          <PrimaryButton onClick={() => onDownload(purchaseData.url)}>
            <FiDownload size={16} />
            Download Now
          </PrimaryButton>
        </ButtonGroup>

        <OrderInfo>
          Order #{purchaseData.orderId?.slice(-8) || 'N/A'} • {purchaseData.message}
        </OrderInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PurchaseSuccessModal;
