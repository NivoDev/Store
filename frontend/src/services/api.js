// No mock data imports - using real database only

/**
 * API service for communicating with the backend.
 * Handles authentication, requests, and error handling with database connection.
 */

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://store-6ryk.onrender.com/api/v1'  // Your Render backend URL
    : 'http://127.0.0.1:8000/api/v1'
  );

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
    
    // Debug logging
    console.log('🔧 API Service initialized with baseURL:', this.baseURL);
    console.log('🔧 Environment REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
  }

  // Token management
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  // HTTP request wrapper with error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    console.log('🌐 API: Making request to:', url);
    console.log('🌐 API: Request config:', config);

    try {
      const response = await fetch(url, config);
      console.log('🌐 API: Response status:', response.status);
      console.log('🌐 API: Response ok:', response.ok);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.setToken(null);
        // Optionally redirect to login or dispatch logout action
        console.warn('Authentication failed, token cleared');
      }

      // Handle database connection errors
      if (response.status === 503) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🌐 API: Database unavailable:', errorData);
        throw new Error('Database temporarily unavailable. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🌐 API: Error response:', errorData);
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('🌐 API: Response data:', data);
      return data;
    } catch (error) {
      console.error(`🌐 API: Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.access_token) {
        this.setToken(response.access_token);
      }
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.access_token) {
        this.setToken(response.access_token);
      }
      
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async verifyToken() {
    try {
      const response = await this.request('/auth/verify');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Product endpoints - database only
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/products${queryParams ? `?${queryParams}` : ''}`;
      
      console.log('🔄 API: Fetching products from:', this.baseURL + endpoint);
      const response = await this.request(endpoint);
      console.log('✅ API: Products response:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Database connection failed:', error);
      
      // Return empty products with "no products available" message
      return { 
        success: true, 
        data: {
          products: [],
          total: 0,
          message: "No products available - database connection error"
        }
      };
    }
  }

  async getProduct(productId) {
    try {
      const response = await this.request(`/products/${productId}`);
      return { success: true, data: response };
    } catch (error) {
      console.error('Database connection failed:', error);
      
      return { 
        success: false, 
        error: "Product not available - database connection error" 
      };
    }
  }

  async getFeaturedProducts() {
    try {
      const response = await this.request('/products/featured');
      return { success: true, data: response };
    } catch (error) {
      console.error('Database connection failed:', error);
      
      return { 
        success: true, 
        data: {
          products: [],
          message: "No featured products available - database connection error"
        }
      };
    }
  }

  async getBestsellerProducts() {
    try {
      const response = await this.request('/products/bestsellers');
      return { success: true, data: response };
    } catch (error) {
      console.error('Database connection failed:', error);
      
      return { 
        success: true, 
        data: {
          products: [],
          message: "No bestseller products available - database connection error"
        }
      };
    }
  }

  async getNewProducts() {
    try {
      const response = await this.request('/products/new');
      return { success: true, data: response };
    } catch (error) {
      console.error('Database connection failed:', error);
      
      return { 
        success: true, 
        data: {
          products: [],
          message: "No new products available - database connection error"
        }
      };
    }
  }

  async toggleProductLike(productId) {
    try {
      const response = await this.request(`/products/${productId}/like`, {
        method: 'POST',
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Order endpoints
  async getUserOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const endpoint = `/orders${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await this.request(endpoint);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrderDetails(orderId) {
    try {
      const response = await this.request(`/orders/${orderId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPurchasedProducts() {
    try {
      const response = await this.request('/user/purchased-products');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async generateDownloadToken(orderId, productId) {
    try {
      const response = await this.request(`/orders/${orderId}/download-token?product_id=${productId}`, {
        method: 'POST',
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  // Account endpoints
  async getLikedProducts() {
    try {
      const response = await this.request('/user/liked-products');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Purchase endpoints (mock mode)
  async mockPurchase(productId, idempotencyKey = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (idempotencyKey) {
        headers['Idempotency-Key'] = idempotencyKey;
      }
      
      const response = await this.request('/orders/purchase', {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId }),
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Guest purchase endpoint (no authentication required)
  async guestPurchase(productId, customerEmail, customerName, idempotencyKey = null) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (idempotencyKey) {
        headers['Idempotency-Key'] = idempotencyKey;
      }
      
      // Make direct fetch call without authentication
      const url = `${this.baseURL}/orders/guest-purchase`;
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          productId, 
          customerEmail, 
          customerName 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/v1', '')}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // User Profile Methods

  async likeProduct(productId) {
    try {
      const response = await this.request(`/user/like-product/${productId}`, {
        method: 'POST'
      });
      return { 
        success: true, 
        data: response,
        liked: response.liked // Include the liked status from backend
      };
    } catch (error) {
      console.error('❌ API: Failed to like product:', error);
      return { success: false, error: error.message };
    }
  }

  async unlikeProduct(productId) {
    try {
      const response = await this.request(`/user/like-product/${productId}`, {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to unlike product:', error);
      return { success: false, error: error.message };
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await this.request('/user/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to change password:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteAccount() {
    try {
      const response = await this.request('/user/delete-account', {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to delete account:', error);
      return { success: false, error: error.message };
    }
  }

  async getDownloadUrl(productId) {
    try {
      const response = await this.request(`/download/${productId}`);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to get download URL:', error);
      
      // Re-throw rate limiting errors so they can be handled specifically
      if (error.status === 429) {
        throw error;
      }
      
      return { success: false, error: error.message };
    }
  }

  async getDownloadInfo() {
    try {
      const response = await this.request('/user/download-info');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to get download info:', error);
      return { success: false, error: error.message };
    }
  }

  async getDownloadHistory() {
    try {
      const response = await this.request('/user/download-history');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to get download history:', error);
      return { success: false, error: error.message };
    }
  }

  async purchaseProduct(productId) {
    try {
      const response = await this.request('/orders/purchase', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId
        })
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to purchase product:', error);
      return { success: false, error: error.message };
    }
  }

  // Guest checkout methods
  async guestCheckout(email, items) {
    try {
      const response = await this.request('/guest/checkout', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          items: items
        })
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to process guest checkout:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyGuestOrder(verificationToken) {
    try {
      const response = await this.request('/guest/verify', {
        method: 'POST',
        body: JSON.stringify({
          verification_token: verificationToken
        })
      });
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to verify guest order:', error);
      return { success: false, error: error.message };
    }
  }

  async getGuestDownload(orderId, verificationToken) {
    try {
      const response = await this.request(`/guest/download/${orderId}?verification_token=${verificationToken}`);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ API: Failed to get guest download:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;
