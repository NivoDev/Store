import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiUser, FiDownload } from 'react-icons/fi';
import { theme } from '../../theme';
import Modal from './Modal';
import Button from '../common/Button';

const ModalContent = styled.div`
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[3]};
`;

const ModalMessage = styled.p`
  color: ${theme.colors.dark[300]};
  font-size: ${theme.typography.sizes.md};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
`;

const ProductInfo = styled.div`
  background: ${theme.colors.gradients.card};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[6]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.md};
  object-fit: cover;
`;

const ProductDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const ProductTitle = styled.h3`
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semiBold};
  margin: 0 0 ${theme.spacing[1]};
`;

const ProductArtist = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  margin: 0 0 ${theme.spacing[1]};
`;

const ProductPrice = styled.p`
  color: ${theme.colors.primary[400]};
  font-size: ${theme.typography.sizes.md};
  font-weight: ${theme.typography.weights.semiBold};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: center;
  margin-top: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const DuplicatePurchaseModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onRecheckout, 
  onViewProfile 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} preventClose={false}>
      <ModalContent>
        <ModalTitle>
          <FiShoppingCart />
          Already Purchased
        </ModalTitle>
        
        <ModalMessage>
          You have already purchased this product! You can either re-purchase it or access your existing downloads from your profile.
        </ModalMessage>
        
        {product && (
          <ProductInfo>
            <ProductImage 
              src={product.cover_image_url || '/images/placeholder-product.jpg'} 
              alt={product.title}
              onError={(e) => {
                e.target.src = '/images/placeholder-product.jpg';
              }}
            />
            <ProductDetails>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductArtist>by {product.artist}</ProductArtist>
              <ProductPrice>${product.price}</ProductPrice>
            </ProductDetails>
          </ProductInfo>
        )}
        
        <ButtonGroup>
          <Button
            variant="primary"
            size="md"
            onClick={onRecheckout}
          >
            <FiShoppingCart size={16} />
            Re-purchase Product
          </Button>
          
          <Button
            variant="secondary"
            size="md"
            onClick={onViewProfile}
          >
            <FiDownload size={16} />
            Go to Downloads
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default DuplicatePurchaseModal;
