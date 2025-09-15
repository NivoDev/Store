import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiMail, FiUser, FiShoppingCart } from 'react-icons/fi';

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
  padding: 40px;
  max-width: 520px;
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled.h2`
  background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  margin: 0;
  font-weight: 400;
`;

const ProductInfo = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
`;

const ProductArtist = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const ProductPrice = styled.div`
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px 16px 52px;
  border: 2px solid ${({ $hasError }) => 
    $hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => 
      $hasError ? '#ef4444' : '#06b6d4'};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 0 0 3px ${({ $hasError }) => 
        $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)'},
      0 8px 32px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 400;
  }

  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.07);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 18px;
  color: ${({ $hasError }) => 
    $hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.5)'};
  pointer-events: none;
  z-index: 1;
  transition: color 0.2s ease;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
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
  background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
  color: white;
  font-weight: 700;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0891b2 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(6, 182, 212, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const SecurityNote = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  font-size: 13px;
  color: rgba(34, 197, 94, 0.9);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  backdrop-filter: blur(10px);
`;

const GuestPurchaseModal = ({ 
  isOpen, 
  onClose, 
  onPurchase, 
  product, 
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerName: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email address is required';
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onPurchase(formData.customerEmail, formData.customerName);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose} type="button">
          <FiX size={20} />
        </CloseButton>

        <Header>
          <Title>Complete Your Purchase</Title>
          <Subtitle>Just a few quick details to get your download</Subtitle>
        </Header>

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

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="customerEmail">
              <FiMail size={16} />
              Email Address
            </Label>
            <InputWrapper>
              <InputIcon $hasError={errors.customerEmail}>
                <FiMail size={16} />
              </InputIcon>
              <Input
                id="customerEmail"
                type="email"
                placeholder="your.email@example.com"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                $hasError={errors.customerEmail}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.customerEmail && (
              <ErrorMessage>{errors.customerEmail}</ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="customerName">
              <FiUser size={16} />
              Full Name
            </Label>
            <InputWrapper>
              <InputIcon $hasError={errors.customerName}>
                <FiUser size={16} />
              </InputIcon>
              <Input
                id="customerName"
                type="text"
                placeholder="Your full name"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                $hasError={errors.customerName}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.customerName && (
              <ErrorMessage>{errors.customerName}</ErrorMessage>
            )}
          </FormGroup>

          <ButtonGroup>
            <SecondaryButton 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton 
              type="submit"
              disabled={isLoading}
            >
              <FiShoppingCart size={16} />
              {isLoading ? 'Processing...' : `Purchase $${product?.price}`}
            </PrimaryButton>
          </ButtonGroup>
        </Form>

        <SecurityNote>
          🔒 Your information is secure and will only be used for this purchase. 
          No account will be created.
        </SecurityNote>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GuestPurchaseModal;
