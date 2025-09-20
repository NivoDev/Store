import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCreditCard, FiUser, FiMapPin, FiMail, FiPhone, FiBuilding, FiFileText, FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { theme } from '../theme';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.gradients.background};
  padding: ${theme.spacing[6]} 0;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${theme.spacing[8]};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const CheckoutForm = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.shadows['2xl']};
`;

const OrderSummary = styled(motion.div)`
  background: ${theme.colors.gradients.card};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius['2xl']};
  padding: ${theme.spacing[6]};
  box-shadow: ${theme.shadows['2xl']};
  height: fit-content;
  position: sticky;
  top: ${theme.spacing[6]};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[8]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[4]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[200]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const Required = styled.span`
  color: ${theme.colors.error};
  font-weight: ${theme.typography.weights.bold};
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
  
  &:invalid {
    border-color: ${theme.colors.error};
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
  }
  
  option {
    background: ${theme.colors.dark[800]};
    color: ${theme.colors.dark[50]};
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[3]};
  cursor: pointer;
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[200]};
  line-height: 1.5;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: ${theme.colors.primary[500]};
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.lg};
  object-fit: cover;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h4`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[50]};
  margin: 0 0 ${theme.spacing[1]} 0;
`;

const ProductArtist = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.dark[400]};
  margin: 0;
`;

const ProductPrice = styled.div`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.primary[400]};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing[2]} 0;
  
  &.total {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: ${theme.spacing[3]};
    padding-top: ${theme.spacing[4]};
    font-size: ${theme.typography.sizes.lg};
    font-weight: ${theme.typography.weights.semibold};
    color: ${theme.colors.dark[50]};
  }
`;

const SummaryLabel = styled.span`
  color: ${theme.colors.dark[300]};
`;

const SummaryValue = styled.span`
  color: ${theme.colors.dark[50]};
  font-weight: ${theme.typography.weights.medium};
`;

const TotalValue = styled.span`
  color: ${theme.colors.primary[400]};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.xl};
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[4]};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Billing, 2: Payment, 3: Confirmation
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Billing Address
    company: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    
    // Tax Information
    taxId: '',
    vatNumber: '',
    businessType: 'individual',
    
    
    // Terms and Conditions
    acceptTerms: false,
    acceptMarketing: false,
    requestInvoice: false
  });

  // Check for verified guest order
  useEffect(() => {
    const verifiedOrder = sessionStorage.getItem('verifiedGuestOrder');
    if (verifiedOrder) {
      try {
        const orderData = JSON.parse(verifiedOrder);
        console.log('📋 Found verified guest order:', orderData);
        
        // Pre-fill email from verified order
        setFormData(prev => ({
          ...prev,
          email: orderData.email || '',
        }));
      } catch (error) {
        console.error('❌ Error parsing verified guest order:', error);
        sessionStorage.removeItem('verifiedGuestOrder');
      }
    }
  }, []);

  // Initialize form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Redirect if no items in cart
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // For digital products, only require basic contact info
    const required = ['firstName', 'lastName', 'email'];
    
    for (const field of required) {
      if (!formData[field]) {
        setError(`Please fill in all required fields: ${field}`);
        return false;
      }
    }
    
    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions to proceed');
      return false;
    }
    
    return true;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    // Simple tax calculation (8.5% for US)
    return calculateTotal() * 0.085;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if this is a verified guest order
      const verifiedOrder = sessionStorage.getItem('verifiedGuestOrder');
      
      if (verifiedOrder) {
        // Handle verified guest order completion
        const orderData = JSON.parse(verifiedOrder);
        console.log('🛒 Completing verified guest order:', orderData.orderNumber);
        
        // Complete the verified order with customer info
        const completeOrderData = {
          order_number: orderData.orderNumber,
          customer_info: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
            company_name: formData.company,
            business_type: formData.businessType,
            tax_id: formData.taxId,
            vat_number: formData.vatNumber,
          },
          request_invoice: formData.requestInvoice
        };
        
        // Complete the guest order
        const result = await apiService.completeGuestOrder(completeOrderData);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to complete order');
        }
        
        console.log('✅ Guest order completed successfully:', result.data);
        
        // Clear the verified order from session storage
        sessionStorage.removeItem('verifiedGuestOrder');
        
        // Redirect to guest download page
        navigate('/guest-download', { 
          state: { 
            orderNumber: orderData.orderNumber,
            message: 'Payment successful! Your download links are ready.'
          }
        });
        
      } else {
        // Handle regular authenticated user checkout
        const orderData = {
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            companyName: formData.company,
            businessType: formData.businessType,
            taxId: formData.taxId,
            vatNumber: formData.vatNumber,
          },
          items: items.map(item => ({
            product_id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            cover_image_url: item.cover_image_url
          })),
          subtotal: calculateTotal(),
          tax: calculateTax(),
          total: calculateTotal() + calculateTax(),
          requestInvoice: formData.requestInvoice
        };
        
        console.log('🛒 Submitting authenticated user order:', orderData);
        
        // Create authenticated user order
        const result = await apiService.createUserOrder(orderData);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to create order');
        }
        
        console.log('✅ Authenticated user order created successfully:', result.data);
        
        // Clear cart and redirect to profile page
        clearCart();
        navigate('/profile', { 
          state: { 
            message: 'Purchase successful! Check your email for download links.',
            tab: 'purchased'
          }
        });
      }
      
    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
      <Container>
      <Content>
        <CheckoutForm
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>
            <FiCreditCard />
            Checkout
          </Title>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Section>
              <SectionTitle>
                <FiUser />
                Personal Information
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>
                    First Name <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Last Name <Required>*</Required>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Email Address <Required>*</Required>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                  />
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Billing Address */}
            <Section>
              <SectionTitle>
                <FiMapPin />
                Billing Address
              </SectionTitle>
              <FormGrid>
                <FormGroup className="full-width">
                  <Label>
                    Street Address (Optional)
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your street address (optional for digital products)"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    City (Optional)
                  </Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    State/Province (Optional)
                  </Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter your state"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Postal Code (Optional)
                  </Label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter your postal code"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    Country (Optional)
                  </Label>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </Section>

            {/* Tax Information */}
            <Section>
              <SectionTitle>
                <FiFileText />
                Tax Information
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>
                    Business Type
                  </Label>
                  <Select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                  >
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                    <option value="nonprofit">Non-Profit</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>
                    Tax ID / SSN
                  </Label>
                  <Input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="Enter your tax ID"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>
                    VAT Number (EU)
                  </Label>
                  <Input
                    type="text"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your VAT number"
                  />
                </FormGroup>
              </FormGrid>
            </Section>


            {/* Terms and Conditions */}
            <Section>
              <SectionTitle>
                <FiLock />
                Terms and Conditions
              </SectionTitle>
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <span>
                    I agree to the <a href="/terms" target="_blank" style={{ color: theme.colors.primary[400] }}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{ color: theme.colors.primary[400] }}>Privacy Policy</a> <Required>*</Required>
                  </span>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="requestInvoice"
                    checked={formData.requestInvoice}
                    onChange={handleInputChange}
                  />
                  <span>
                    I need a tax invoice for this purchase
                  </span>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    type="checkbox"
                    name="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onChange={handleInputChange}
                  />
                  <span>
                    I would like to receive marketing emails about new products and updates
                  </span>
                </CheckboxItem>
              </CheckboxGroup>
            </Section>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: theme.spacing[4], marginTop: theme.spacing[8] }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/cart')}
                style={{ flex: 1 }}
              >
                <FiArrowLeft />
                Back to Cart
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck />
                    Complete Purchase
                  </>
                )}
              </Button>
            </div>
          </form>
        </CheckoutForm>

        {/* Order Summary */}
        <OrderSummary
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 style={{ 
            fontSize: theme.typography.sizes.xl, 
            fontWeight: theme.typography.weights.semibold, 
            color: theme.colors.dark[50], 
            margin: `0 0 ${theme.spacing[6]} 0` 
          }}>
            Order Summary
          </h3>
          
          {items.map((item, index) => (
            <ProductItem key={index}>
              <ProductImage src={item.cover_image_url} alt={item.title} />
              <ProductInfo>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductArtist>{item.artist}</ProductArtist>
              </ProductInfo>
              <ProductPrice>
                ${(item.price * item.quantity).toFixed(2)}
              </ProductPrice>
            </ProductItem>
          ))}
          
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${calculateTotal().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>Tax (8.5%)</SummaryLabel>
            <SummaryValue>${calculateTax().toFixed(2)}</SummaryValue>
          </SummaryRow>
          <SummaryRow className="total">
            <SummaryLabel>Total</SummaryLabel>
            <TotalValue>${(calculateTotal() + calculateTax()).toFixed(2)}</TotalValue>
          </SummaryRow>
        </OrderSummary>
      </Content>
      </Container>
  );
};

export default CheckoutPage;