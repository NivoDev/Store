import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCreditCard, FiUser, FiMapPin, FiMail, FiPhone, FiBuilding, FiFileText, FiLock, FiArrowLeft, FiCheck, FiTag, FiX } from 'react-icons/fi';
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

// Coupon components
const CouponSection = styled.div`
  margin: ${theme.spacing[4]} 0;
  padding: ${theme.spacing[3]};
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: ${theme.borderRadius.lg};
`;

const CouponTitle = styled.h4`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
  margin: 0 0 ${theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const CouponInputGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
`;

const CouponInput = styled(Input)`
  flex: 1;
  text-transform: uppercase;
`;

const CouponButton = styled(Button)`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.typography.sizes.sm};
  min-width: auto;
`;

const CouponError = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing[2]};
`;

const AppliedCoupons = styled.div`
  margin-top: ${theme.spacing[2]};
`;

const AppliedCoupon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing[2]};
`;

const CouponInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const CouponCode = styled.span`
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.dark[50]};
`;

const CouponDiscount = styled.span`
  color: ${theme.colors.success[500]};
  font-size: ${theme.typography.sizes.sm};
`;

const RemoveCouponButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.dark[400]};
  cursor: pointer;
  padding: ${theme.spacing[1]};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.error};
    background: rgba(239, 68, 68, 0.1);
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
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  
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

  // Handle guest order from email verification
  useEffect(() => {
    const isFromEmailVerification = location.state?.fromEmailVerification;
    const guestOrder = location.state?.guestOrder;
    
    if (isFromEmailVerification && guestOrder) {
      // Pre-fill email from guest order
      setFormData(prev => ({
        ...prev,
        email: guestOrder.guest_email || '',
      }));
      
      console.log('📧 Guest order from email verification:', guestOrder);
    }
  }, [location.state]);

  // Redirect if no items in cart (unless coming from email verification)
  useEffect(() => {
    const isFromEmailVerification = location.state?.fromEmailVerification;
    const guestOrder = location.state?.guestOrder;
    const effectiveItems = getEffectiveItems();
    
    if (effectiveItems.length === 0 && !isFromEmailVerification && !guestOrder) {
      navigate('/cart');
    }
  }, [items, navigate, location.state]);

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

  // Get effective items (cart items or guest order items)
  const getEffectiveItems = () => {
    const guestOrder = location.state?.guestOrder;
    if (guestOrder && guestOrder.items) {
      console.log('🛒 Using guest order items:', guestOrder.items);
      // Transform guest order items to match cart item structure
      const transformedItems = guestOrder.items.map(item => ({
        ...item,
        id: item.product_id || item.id, // Ensure id field exists
        artist: item.made_by || item.artist || 'Unknown Artist', // Add missing fields with fallback
        cover_image_url: item.cover_image_url || '/images/placeholder-product.jpg'
      }));
      console.log('🛒 Transformed items:', transformedItems);
      return transformedItems;
    }
    console.log('🛒 Using cart items:', items);
    return items;
  };

  const calculateTotal = () => {
    const effectiveItems = getEffectiveItems();
    return effectiveItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalWithDiscount = () => {
    const subtotal = calculateTotal();
    const discount = couponDiscount;
    return subtotal - discount; // No tax
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      // Get email from multiple sources for guest orders
      const guestOrder = location.state?.guestOrder;
      const verifiedOrder = sessionStorage.getItem('verifiedGuestOrder');
      let email = formData.email || user?.email || '';
      
      // For guest orders, try to get email from guest order data
      if (!isAuthenticated) {
        if (guestOrder?.guest_email) {
          email = guestOrder.guest_email;
        } else if (verifiedOrder) {
          try {
            const orderData = JSON.parse(verifiedOrder);
            email = orderData.email || email;
          } catch (e) {
            console.warn('Failed to parse verified order:', e);
          }
        }
      }

      const couponData = {
        coupon_code: couponCode.trim().toUpperCase(),
        user_email: email,
        user_id: user?.id || null,
        cart_items: getEffectiveItems(),
        cart_total: calculateTotal()
      };

      const result = await apiService.applyCoupon(couponData);
      
      if (result.success && result.data.success) {
        setAppliedCoupons(prev => [...prev, result.data.applied_coupons[0]]);
        setCouponDiscount(prev => prev + result.data.discount_amount);
        setCouponCode('');
        setCouponError('');
        console.log('✅ Coupon applied successfully');
      } else {
        setCouponError(result.data?.message || 'Failed to apply coupon');
      }
    } catch (error) {
      console.error('❌ Error applying coupon:', error);
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async (couponCode) => {
    try {
      // Get email from multiple sources for guest orders
      const guestOrder = location.state?.guestOrder;
      const verifiedOrder = sessionStorage.getItem('verifiedGuestOrder');
      let email = formData.email || user?.email || '';
      
      // For guest orders, try to get email from guest order data
      if (!isAuthenticated) {
        if (guestOrder?.guest_email) {
          email = guestOrder.guest_email;
        } else if (verifiedOrder) {
          try {
            const orderData = JSON.parse(verifiedOrder);
            email = orderData.email || email;
          } catch (e) {
            console.warn('Failed to parse verified order:', e);
          }
        }
      }

      const couponData = {
        coupon_code: couponCode,
        user_email: email,
        user_id: user?.id || null
      };

      const result = await apiService.removeCoupon(couponData);
      
      if (result.success && result.data.success) {
        setAppliedCoupons(prev => prev.filter(c => c.code !== couponCode));
        // Recalculate discount
        const remainingDiscount = appliedCoupons
          .filter(c => c.code !== couponCode)
          .reduce((total, c) => total + c.discount_amount, 0);
        setCouponDiscount(remainingDiscount);
        console.log('✅ Coupon removed successfully');
      } else {
        console.error('❌ Failed to remove coupon:', result.data?.message);
      }
    } catch (error) {
      console.error('❌ Error removing coupon:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if user is authenticated first - authenticated users always use user checkout
      if (isAuthenticated) {
        // Handle authenticated user checkout (even if they came from guest email verification)
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
          items: getEffectiveItems().map(item => ({
            product_id: item.product_id || item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            cover_image_url: item.cover_image_url
          })),
          subtotal: calculateTotal(),
          tax: 0, // No tax
          total: calculateTotal(),
          requestInvoice: formData.requestInvoice
        };
        
        console.log('🛒 Creating authenticated user order:', orderData);
        
        const result = await apiService.createUserOrder(orderData);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to create order');
        }
        
        console.log('✅ User order created successfully:', result.data);
        
        // Handle newsletter subscription if requested
        if (formData.acceptMarketing) {
          try {
            const newsletterResult = await apiService.subscribeNewsletter(
              `${formData.firstName} ${formData.lastName}`.trim(),
              formData.email,
              'Atomic-Rose-Checkout'
            );
            if (newsletterResult.success) {
              console.log('✅ Newsletter subscription successful');
            } else {
              console.warn('⚠️ Newsletter subscription failed:', newsletterResult.error);
            }
          } catch (err) {
            console.warn('⚠️ Newsletter subscription error:', err);
          }
        }
        
        // Clear cart and redirect to profile with success message
        clearCart();
        navigate('/profile', { 
          state: { 
            message: 'Order completed successfully! Your downloads are now available.',
            tab: 'purchases'
          }
        });
        
      } else {
        // Check if this is a verified guest order (from session or email verification)
        const verifiedOrder = sessionStorage.getItem('verifiedGuestOrder');
        const guestOrderFromEmail = location.state?.guestOrder;
        
        if (verifiedOrder || guestOrderFromEmail) {
        // Handle verified guest order completion
        const orderData = guestOrderFromEmail || JSON.parse(verifiedOrder);
        const orderNumber = guestOrderFromEmail?.order_number || orderData.orderNumber;
        console.log('🛒 Completing verified guest order:', orderNumber);
        
        // Complete the verified order with customer info
        const completeOrderData = {
          order_number: orderNumber,
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
        
        // Handle newsletter subscription if requested
        if (formData.acceptMarketing) {
          try {
            const newsletterResult = await apiService.subscribeNewsletter(
              `${formData.firstName} ${formData.lastName}`.trim(),
              formData.email,
              'Atomic-Rose-Checkout'
            );
            if (newsletterResult.success) {
              console.log('✅ Newsletter subscription successful');
            } else {
              console.warn('⚠️ Newsletter subscription failed:', newsletterResult.error);
            }
          } catch (err) {
            console.warn('⚠️ Newsletter subscription error:', err);
          }
        }
        
        // Clear the verified order from session storage
        sessionStorage.removeItem('verifiedGuestOrder');
        
        // Redirect to beautiful thank you page
        navigate('/guest-checkout-success', { 
          state: { 
            orderNumber: orderNumber,
            orderData: result.data
          }
        });
        
        } else {
          // No verified guest order and not authenticated - this shouldn't happen
          throw new Error('No items to checkout');
        }
      }
      
    } catch (err) {
      console.error('❌ Checkout error:', err);
      setError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check effective items (cart or guest order items) instead of just cart items
  const effectiveItems = getEffectiveItems();
  if (effectiveItems.length === 0) {
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

        {/* Coupon Section */}
        <CouponSection>
          <CouponTitle>
            <FiTag />
            Have a coupon code?
          </CouponTitle>
          
          <CouponInputGroup>
            <CouponInput
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
            />
            <CouponButton
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
            >
              {couponLoading ? <LoadingSpinner /> : 'Apply'}
            </CouponButton>
          </CouponInputGroup>
          
          {couponError && (
            <CouponError>{couponError}</CouponError>
          )}
          
          {appliedCoupons.length > 0 && (
            <AppliedCoupons>
              {appliedCoupons.map((coupon, index) => (
                <AppliedCoupon key={index}>
                  <CouponInfo>
                    <CouponCode>{coupon.code}</CouponCode>
                    <CouponDiscount>-${(coupon.discount_amount || 0).toFixed(2)}</CouponDiscount>
                  </CouponInfo>
                  <RemoveCouponButton
                    onClick={() => handleRemoveCoupon(coupon.code)}
                    title="Remove coupon"
                  >
                    <FiX />
                  </RemoveCouponButton>
                </AppliedCoupon>
              ))}
            </AppliedCoupons>
          )}
        </CouponSection>

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
          
          {getEffectiveItems().map((item, index) => (
            <ProductItem key={index}>
              <ProductImage src={item.cover_image_url} alt={item.title} />
              <ProductInfo>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductArtist>{item.artist}</ProductArtist>
              </ProductInfo>
              <ProductPrice>
                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </ProductPrice>
            </ProductItem>
          ))}
          
          <SummaryRow>
            <SummaryLabel>Subtotal</SummaryLabel>
            <SummaryValue>${(calculateTotal() || 0).toFixed(2)}</SummaryValue>
          </SummaryRow>
          
          {couponDiscount > 0 && (
            <SummaryRow>
              <SummaryLabel>Discount</SummaryLabel>
              <SummaryValue style={{ color: theme.colors.success[500] }}>
                -${(couponDiscount || 0).toFixed(2)}
              </SummaryValue>
            </SummaryRow>
          )}
          
          <SummaryRow className="total">
            <SummaryLabel>Total</SummaryLabel>
            <TotalValue>${(calculateTotalWithDiscount() || 0).toFixed(2)}</TotalValue>
          </SummaryRow>
        </OrderSummary>
      </Content>
      </Container>
  );
};

export default CheckoutPage;