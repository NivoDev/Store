import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import apiService from '../services/api';
import guestCartService from '../services/guestCart';
import Modal from '../components/modals/Modal';
import AuthModal from '../components/auth/AuthModal';

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

// Guest checkout modal styles
const ModalContent = styled.div`
  background: ${theme.colors.gradients.card};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing[8]};
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const ModalTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[6]};
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[6]};
`;

const Label = styled.label`
  display: block;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.dark[200]};
  margin-bottom: ${theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.dark[50]};
  font-size: ${theme.typography.sizes.base};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    color: ${theme.colors.dark[400]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
`;

const VerificationModal = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
`;

const VerificationTitle = styled.h2`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[4]};
`;

const VerificationMessage = styled.p`
  color: ${theme.colors.dark[300]};
  margin-bottom: ${theme.spacing[6]};
  line-height: 1.6;
`;


const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid ${theme.colors.success[400]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing[4]};
  margin: ${theme.spacing[4]} 0;
  color: ${theme.colors.success[400]};
`;

const CartPage = () => {
  const navigate = useNavigate();
  const { items: regularItems, total: regularTotal, itemCount: regularItemCount, clearCart: clearRegularCart, addItem, removeItem, updateQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Guest cart state
  const [guestCart, setGuestCart] = useState({ items: [], total: 0, count: 0 });
  
  // Guest checkout states
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [otpCode, setOtpCode] = useState(''); // Separate OTP input
  const [orderData, setOrderData] = useState(null);
  const [verificationStep, setVerificationStep] = useState('email'); // 'email', 'verify', 'success'
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTransferSuccessModal, setShowTransferSuccessModal] = useState(false);
  const [showPurchaseSuccessModal, setShowPurchaseSuccessModal] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(null);

  // Load guest cart on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🛒 CartPage: Loading guest cart...');
      const cart = guestCartService.getCart();
      console.log('🛒 CartPage: Guest cart loaded:', cart);
      
      // Clean invalid items from guest cart
      const cleanedCart = guestCartService.cleanInvalidItems();
      setGuestCart(cleanedCart);
    }
  }, [isAuthenticated]);

  // Listen for guest cart changes
  useEffect(() => {
    if (!isAuthenticated) {
      const handleCartChange = (event) => {
        console.log('🛒 CartPage: Cart change event received:', event.detail);
        const cart = guestCartService.getCart();
        setGuestCart(cart);
      };

      window.addEventListener('guestCartChanged', handleCartChange);
      return () => window.removeEventListener('guestCartChanged', handleCartChange);
    }
  }, [isAuthenticated]);

  // Monitor cart changes for debugging
  useEffect(() => {
    // Check if cart was cleared unexpectedly
    if (isAuthenticated && regularItems.length === 0 && regularItemCount === 0) {
      console.warn('⚠️ Cart was cleared while user is authenticated!');
    }
  }, [regularItems, regularItemCount, regularTotal, isAuthenticated]);

  const resetAllModals = useCallback((includeTransferSuccess = true) => {
    setShowChoiceModal(false);
    setShowGuestModal(false);
    setShowVerificationModal(false);
    setShowAuthModal(false);
    setShowPurchaseSuccessModal(false);
    if (includeTransferSuccess) {
      setShowTransferSuccessModal(false);
    }
    setGuestEmail('');
    setOrderData(null);
    setVerificationStep('email');
    setAcceptTerms(false);
    setTermsError('');
    
    // Clear redirect timer if it exists
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }
  }, [redirectTimer]);

  // Reset modals when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 User authenticated, resetting all modals');
      resetAllModals(false);
    }
  }, [isAuthenticated, resetAllModals]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

  // Use appropriate cart based on authentication status
  const items = isAuthenticated ? regularItems : guestCart.items;
  const total = isAuthenticated ? regularTotal : guestCart.total;
  const itemCount = isAuthenticated ? regularItemCount : guestCart.count;
  const clearCart = isAuthenticated ? clearRegularCart : () => {
    guestCartService.clearCart();
    setGuestCart({ items: [], total: 0, count: 0 });
  };

  const handlePurchase = async () => {
    console.log('🛒 HandlePurchase called, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      // Show choice modal for guest users
      console.log('🛒 User not authenticated, showing choice modal');
      setShowChoiceModal(true);
      return;
    }
    
    console.log('🛒 User is authenticated, proceeding with purchase');

    setIsProcessing(true);
    try {
      const purchaseResults = [];
      
      // Purchase each item in the cart
      for (const item of items) {
        const result = await apiService.purchaseProduct(item.id);
        if (!result.success) {
          alert(`Failed to purchase ${item.title}: ${result.error}`);
          return;
        }
        purchaseResults.push({
          ...item,
          download_url: result.download_url,
          order_number: result.order_number
        });
      }
      
      // Clear cart after successful purchase
      clearCart();
      setShowPurchaseSuccessModal(true);
      
      // Set up automatic redirect to profile after 3 seconds
      const timer = setTimeout(() => {
        setShowPurchaseSuccessModal(false);
        navigate('/profile');
      }, 3000);
      setRedirectTimer(timer);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGuestCheckout = async () => {
    if (!guestEmail) {
      alert('Please enter your email address');
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare items for guest checkout
      const checkoutItems = items.map(item => ({
        product_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity
      }));

      const result = await apiService.guestCheckout(guestEmail, checkoutItems);
      
      if (result.success) {
        // Close guest modal and show verification modal
        setShowGuestModal(false);
        setShowVerificationModal(true);
        setVerificationStep('verify'); // Ensure we're in verify step, not success
        setOrderData(result.data);
        setOtpCode(''); // Clear any previous OTP code
      } else {
        setTermsError(`Checkout failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Guest checkout error:', error);
      setTermsError('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerification = async () => {
    if (!otpCode) {
      alert('Please enter the verification code');
      return;
    }

    if (otpCode.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    if (!acceptTerms) {
      setTermsError('You must accept the Terms and Conditions to continue');
      return;
    }
    
    // Clear any previous error
    setTermsError('');

    setIsProcessing(true);
    try {
      const result = await apiService.verifyGuestOtp(otpCode, guestEmail);
      
      if (result.success) {
        // Store the order data for the next step
        setOrderData(result.data);
        setVerificationStep('success');
        
        // Debug: Log the response data
        console.log('🎉 Guest verification successful:', result.data);
        console.log('📥 Download links:', result.data.download_links);
        
        // Store download links in localStorage as backup
        if (result.data.download_links && result.data.download_links.length > 0) {
          localStorage.setItem('guest_download_links', JSON.stringify(result.data.download_links));
          console.log('💾 Stored download links in localStorage as backup');
        }
        
        // Set up automatic redirect after 3 seconds
        const timer = setTimeout(() => {
          // Redirect to guest download page with order data
          navigate('/guest-downloads', { 
            state: { 
              downloadLinks: result.data.download_links || [],
              orderNumber: result.data.order_number,
              orderId: result.data.order_id
            }
          });
        }, 3000);
        
        setRedirectTimer(timer);
      } else {
        setTermsError(`Verification failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setTermsError('Verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModals = () => {
    setShowChoiceModal(false);
    setShowGuestModal(false);
    setShowVerificationModal(false);
    setShowAuthModal(false);
    setGuestEmail('');
    setOrderData(null);
    setVerificationStep('email');
    setAcceptTerms(false);
  };

  const handleContinueAsGuest = () => {
    setShowChoiceModal(false);
    setShowGuestModal(true);
  };

  const handleSignInToContinue = () => {
    setShowChoiceModal(false);
    setShowAuthModal(true);
  };

  const handleSuccessfulLogin = async () => {
    // Transfer guest cart to registered user's cart
    if (guestCart.items.length > 0) {
      try {
        console.log('🔄 Starting cart transfer with items:', guestCart.items);
        
        // Filter out invalid items (like test-123) before transfer
        const validItems = guestCart.items.filter(item => {
          // Check if the item has a valid MongoDB ObjectId format (24 hex characters)
          const isValidId = /^[0-9a-fA-F]{24}$/.test(item.id);
          if (!isValidId) {
            console.warn(`⚠️ Skipping invalid item ID: ${item.id} for product: ${item.title}`);
          }
          return isValidId;
        });
        
        console.log(`🔄 Filtered ${guestCart.items.length} items down to ${validItems.length} valid items`);
        
        if (validItems.length === 0) {
          console.warn('⚠️ No valid items to transfer after filtering');
          alert('No valid items found in your cart. Please add some products and try again.');
          setShowAuthModal(false);
          return;
        }
        
        // Add each valid guest cart item to the registered user's cart
        let transferSuccess = true;
        console.log(`🔄 Starting transfer of ${validItems.length} items to regular cart`);
        
        for (const item of validItems) {
          try {
            console.log(`🔄 Transferring item: ${item.title} (ID: ${item.id})`);
            console.log(`🔄 Item details:`, item);
            addItem(item, item.quantity || 1);
            console.log(`✅ Successfully called addItem for ${item.title}`);
          } catch (error) {
            console.error(`❌ Failed to add ${item.title} to cart:`, error);
            transferSuccess = false;
            // Continue with other items even if one fails
          }
        }
        
        console.log(`🔄 Transfer completed. Success: ${transferSuccess}, Items: ${validItems.length}`);
        
        // Clear guest cart after transfer attempt
        guestCartService.clearCart();
        setGuestCart({ items: [], total: 0, count: 0 });
        
        // Check if transfer was successful
        if (transferSuccess && validItems.length > 0) {
          console.log('✅ Cart transfer completed successfully');
          // Close auth modal and show success message
          setShowAuthModal(false);
          // Show success modal with a small delay to ensure state is set
          setTimeout(() => {
            setShowTransferSuccessModal(true);
          }, 100);
        } else {
          console.error('❌ Cart transfer failed during item addition');
          alert('Cart transfer failed. Please try adding items to your cart again.');
          // Only reset modals on failure
          resetAllModals();
        }
      } catch (error) {
        console.error('❌ Error transferring cart:', error);
        alert('Cart transfer failed. Please try adding items to your cart again.');
        resetAllModals();
      }
    } else {
      // No items to transfer, just reset all modals
      resetAllModals();
    }
  };

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
              <div key={item.cartId || item.id} style={{ 
                padding: theme.spacing[4], 
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: theme.colors.dark[50], marginBottom: theme.spacing[1] }}>
                    {item.title}
                  </h4>
                  <p style={{ color: theme.colors.dark[300], marginBottom: theme.spacing[1] }}>
                    by {item.artist}
                  </p>
                  <p style={{ color: theme.colors.dark[50], fontWeight: 'bold' }}>
                    ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: theme.spacing[2],
                  marginLeft: theme.spacing[4]
                }}>
                  {/* Quantity Controls */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: theme.spacing[2],
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: theme.spacing[2],
                    borderRadius: theme.borderRadius.md,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          updateQuantity(item.cartId, Math.max(1, item.quantity - 1));
                        } else {
                          // For guest cart
                          guestCartService.updateQuantity(item.id, Math.max(1, item.quantity - 1));
                          setGuestCart(guestCartService.loadCart());
                        }
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: theme.colors.dark[50],
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>
                    <span style={{ 
                      color: theme.colors.dark[50], 
                      minWidth: '20px', 
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (isAuthenticated) {
                          updateQuantity(item.cartId, item.quantity + 1);
                        } else {
                          // For guest cart
                          guestCartService.updateQuantity(item.id, item.quantity + 1);
                          setGuestCart(guestCartService.loadCart());
                        }
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: theme.colors.dark[50],
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        removeItem(item.cartId);
                      } else {
                        // For guest cart
                        guestCartService.removeItem(item.id);
                        setGuestCart(guestCartService.loadCart());
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      padding: theme.spacing[2],
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    Remove
                  </button>
                </div>
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
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={handlePurchase}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 
               isAuthenticated ? 'Purchase All Items' : 'Proceed to Checkout'}
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

      {/* Choice Modal for Guest Users */}
      <Modal isOpen={showChoiceModal && !isAuthenticated} onClose={handleCloseModals} preventClose={false}>
        <ModalContent>
          <ModalTitle>Complete Your Purchase</ModalTitle>
          <VerificationMessage style={{ marginBottom: theme.spacing[6] }}>
            You have items in your cart. Sign in to get the best experience and more download options.
          </VerificationMessage>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={handleSignInToContinue}
              style={{
                background: theme.colors.gradients.neon,
                border: 'none',
                color: 'white',
                fontWeight: theme.typography.weights.semibold,
                padding: theme.spacing[4],
                fontSize: theme.typography.sizes.lg
              }}
            >
              Sign In & Get 3 Downloads
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              fullWidth
              onClick={handleContinueAsGuest}
              style={{
                padding: theme.spacing[4],
                fontSize: theme.typography.sizes.lg,
                color: theme.colors.dark[400],
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              Continue as Guest (1 Download Only)
            </Button>
          </div>
          
          <div style={{ 
            marginTop: theme.spacing[6], 
            padding: theme.spacing[4], 
            background: 'rgba(34, 197, 94, 0.1)', 
            borderRadius: theme.borderRadius.md,
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <h4 style={{ 
              color: theme.colors.dark[50], 
              marginBottom: theme.spacing[2],
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.semibold
            }}>
              🎉 Sign In Benefits:
            </h4>
            <ul style={{ 
              color: theme.colors.dark[300], 
              margin: 0, 
              paddingLeft: theme.spacing[4],
              fontSize: theme.typography.sizes.sm,
              lineHeight: 1.6
            }}>
              <li><strong>3 downloads per purchase</strong> (vs 1 for guests)</li>
              <li>Dedicated account page with purchase history</li>
              <li>Save your favorite products</li>
              <li>Access to exclusive content and updates</li>
            </ul>
          </div>
          
          <div style={{ 
            marginTop: theme.spacing[4], 
            padding: theme.spacing[3], 
            background: 'rgba(255, 193, 7, 0.1)', 
            borderRadius: theme.borderRadius.md,
            border: '1px solid rgba(255, 193, 7, 0.2)'
          }}>
            <p style={{ 
              color: theme.colors.dark[300], 
              margin: 0,
              fontSize: theme.typography.sizes.sm,
              lineHeight: 1.5
            }}>
              <strong>Guest Checkout:</strong> Quick but limited to 1 download per purchase. 
              No account required, but you'll miss out on the full experience.
            </p>
          </div>
        </ModalContent>
      </Modal>

      {/* Guest Checkout Modal */}
      <Modal isOpen={showGuestModal} onClose={handleCloseModals} preventClose={false}>
        <ModalContent>
          <ModalTitle>Guest Checkout</ModalTitle>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </FormGroup>
          <ButtonGroup>
            <Button variant="ghost" onClick={handleCloseModals}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleGuestCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Continue Checkout'}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>

      {/* Verification Modal */}
      <Modal isOpen={showVerificationModal} onClose={verificationStep === 'verify' ? undefined : handleCloseModals} preventClose={verificationStep === 'verify'}>
        <ModalContent>
          {verificationStep === 'verify' && (
            <VerificationModal>
              <VerificationTitle>Verify Your Purchase</VerificationTitle>
              <VerificationMessage>
                We've sent a verification code to your email. Please check your inbox and enter the code below to complete your purchase.
              </VerificationMessage>
              <FormGroup>
                <Label htmlFor="verification">Verification Code</Label>
                <Input
                  id="verification"
                  type="text"
                  placeholder="Enter 6-digit code from your email"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
              </FormGroup>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: theme.spacing[3], 
                margin: `${theme.spacing[4]} 0`,
                justifyContent: 'center'
              }}>
                <input
                  type="checkbox"
                  id="guest-terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: theme.colors.primary[500]
                  }}
                />
                <label 
                  htmlFor="guest-terms"
                  style={{
                    color: theme.colors.dark[300],
                    fontSize: theme.typography.sizes.sm,
                    cursor: 'pointer'
                  }}
                >
                  I agree to the{' '}
                  <a 
                    href="/terms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: theme.colors.primary[400], 
                      textDecoration: 'underline' 
                    }}
                  >
                    Terms and Conditions
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: theme.colors.primary[400], 
                      textDecoration: 'underline' 
                    }}
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              {/* Terms Error Display */}
              {termsError && (
                <div style={{
                  color: '#ef4444',
                  fontSize: theme.typography.sizes.sm,
                  textAlign: 'center',
                  marginTop: theme.spacing[2],
                  fontWeight: theme.typography.weights.medium
                }}>
                  {termsError}
                </div>
              )}
              
              <ButtonGroup>
                <Button variant="ghost" onClick={handleCloseModals}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleVerification}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Verifying...' : 'Verify Purchase'}
                </Button>
              </ButtonGroup>
            </VerificationModal>
          )}

          {verificationStep === 'success' && orderData && (
            <VerificationModal>
              <VerificationTitle>Purchase Successful! 🎉</VerificationTitle>
              <SuccessMessage>
                Thank you for your purchase! Your order {orderData.order_number} has been verified and completed!
              </SuccessMessage>
              
              <VerificationMessage style={{ marginTop: theme.spacing[4] }}>
                Redirecting you to your downloads page in 3 seconds...
              </VerificationMessage>
              
              <ButtonGroup>
                <Button variant="primary" onClick={() => {
                  // Store download links for the download page
                  if (orderData.download_links) {
                    localStorage.setItem('guest_download_links', JSON.stringify(orderData.download_links));
                  }
                  // Redirect to download page
                  navigate('/guest-downloads', { 
                    state: { 
                      downloadLinks: orderData.download_links || [],
                      orderNumber: orderData.order_number
                    }
                  });
                }}>
                  Go to Downloads Now
                </Button>
              </ButtonGroup>
            </VerificationModal>
          )}
        </ModalContent>
      </Modal>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccessfulLogin={handleSuccessfulLogin}
      />

      {/* Transfer Success Modal */}
      <Modal isOpen={showTransferSuccessModal} onClose={() => setShowTransferSuccessModal(false)}>
        <ModalContent>
          <ModalTitle style={{ color: theme.colors.success[400], textAlign: 'center' }}>
            🎉 Thank You & Welcome!
          </ModalTitle>
          <VerificationMessage style={{ 
            textAlign: 'center', 
            marginBottom: theme.spacing[6],
            fontSize: theme.typography.sizes.lg
          }}>
            Thank you for signing up{user?.name ? `, ${user.name}` : ''}! Your cart has been transferred successfully. 
            You now have access to 3 downloads per product and a dedicated account page.
          </VerificationMessage>
          
          <VerificationMessage style={{ 
            textAlign: 'center', 
            marginBottom: theme.spacing[6],
            fontSize: theme.typography.sizes.base,
            color: theme.colors.dark[300]
          }}>
            You can now proceed with checkout to complete your purchase.
          </VerificationMessage>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                setShowTransferSuccessModal(false);
                // Refresh the page to show the updated cart
                window.location.reload();
              }}
              style={{
                background: theme.colors.gradients.neon,
                border: 'none',
                color: 'white',
                fontWeight: theme.typography.weights.semibold,
                padding: theme.spacing[4],
                fontSize: theme.typography.sizes.lg,
                minWidth: '200px'
              }}
            >
              Continue to Cart
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Purchase Success Modal */}
      <Modal isOpen={showPurchaseSuccessModal} onClose={() => setShowPurchaseSuccessModal(false)}>
        <ModalContent>
          <ModalTitle style={{ color: theme.colors.success[400], textAlign: 'center' }}>
            🎉 Purchase Successful!
          </ModalTitle>
          <VerificationMessage style={{ 
            textAlign: 'center', 
            marginBottom: theme.spacing[6],
            fontSize: theme.typography.sizes.lg
          }}>
            Thank you for your purchase! Your order has been completed successfully. Redirecting you to your profile in 3 seconds...
          </VerificationMessage>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                setShowPurchaseSuccessModal(false);
                navigate('/profile');
              }}
              style={{
                background: theme.colors.gradients.neon,
                border: 'none',
                color: 'white',
                fontWeight: theme.typography.weights.semibold,
                padding: theme.spacing[4],
                fontSize: theme.typography.sizes.lg,
                minWidth: '200px'
              }}
            >
              Go to Profile
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default CartPage;
