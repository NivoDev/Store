import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { theme } from './theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

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

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <CartProvider>
            <Router>
            <div className="App">
              <Header onAuthClick={() => setAuthModalOpen(true)} />
              
              <main style={{ minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column' }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/sample-packs" element={<SamplePacksPage />} />
                  <Route path="/midi-packs" element={<MidiPacksPage />} />
                  <Route path="/acapellas" element={<AcapellasPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
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
