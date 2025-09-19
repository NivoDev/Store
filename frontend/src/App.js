import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { theme } from './theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import keepAliveService from './services/keepAlive';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Auth components
import AuthModal from './components/auth/AuthModal';

// Page components
import HomePage from './pages/HomePage';
import SamplePacksPage from './pages/SamplePacksPage';
import MidiPacksPage from './pages/MidiPacksPage';
import AcapellasPage from './pages/AcapellasPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import GuestDownloadPage from './pages/GuestDownloadPage';
import GuestEmailVerificationPage from './pages/GuestEmailVerificationPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Start keep-alive service when app loads
  useEffect(() => {
    console.log('🚀 Starting keep-alive service for Render backend');
    keepAliveService.start();

    // Cleanup on unmount
    return () => {
      console.log('🛑 Stopping keep-alive service');
      keepAliveService.stop();
    };
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <CartProvider>
            <Router>
            <ScrollToTop />
            <div className="App">
              <Header onAuthClick={() => setAuthModalOpen(true)} />
              
              <main style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
                <Routes>
                  <Route path="/" element={<HomePage onAuthClick={() => setAuthModalOpen(true)} />} />
                  <Route path="/sample-packs" element={<SamplePacksPage onAuthClick={() => setAuthModalOpen(true)} />} />
                  <Route path="/midi-packs" element={<MidiPacksPage onAuthClick={() => setAuthModalOpen(true)} />} />
                  <Route path="/acapellas" element={<AcapellasPage onAuthClick={() => setAuthModalOpen(true)} />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/cookies" element={<CookiePolicyPage />} />
                  <Route path="/guest-downloads" element={<GuestDownloadPage />} />
                  <Route path="/verify-guest-email" element={<GuestEmailVerificationPage />} />
                  <Route path="/verify-email" element={<EmailVerificationPage />} />
                  <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
                </Routes>
              </main>

              <Footer />
              
              <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
              />
            </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
