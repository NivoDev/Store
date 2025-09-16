// API service for communicating with the backend.
// Handles authentication, requests, and error handling with database connection.

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://store-6ryk.onrender.com/api/v1';

class APIService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
    
    // Debug logging
    console.log('🔧 API Service initialized with baseURL:', this.baseURL);
    console.log('🔧 Environment REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
  }

  // Token management
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // HTTP request wrapper with error handling
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData: Record<string, unknown>) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      // Registration now requires email verification
      // Don't set token until email is verified
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.access_token) {
        this.setToken(response.access_token);
      }
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyUserEmail(otpCode: string, email: string) {
    try {
      const response = await this.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ otp_code: otpCode, email: email }),
      });
      
      if (response.access_token) {
        this.setToken(response.access_token);
      }
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async resendUserVerification(email: string) {
    try {
      const response = await this.request('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email: email }),
      });
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
      this.setToken(null);
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Products endpoints
  async getProducts(params: Record<string, unknown> = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';
      
      const response = await this.request(endpoint);
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getProduct(id: string) {
    try {
      const response = await this.request(`/products/${id}`);
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Guest checkout
  async guestCheckout(checkoutData: Record<string, unknown>) {
    try {
      const response = await this.request('/guest/checkout', {
        method: 'POST',
        body: JSON.stringify(checkoutData),
      });
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyGuestOtp(otpCode: string, email: string) {
    try {
      const response = await this.request('/guest/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ otp_code: otpCode, email: email }),
      });
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async verifyGuestOrder(orderData: Record<string, unknown>) {
    try {
      const response = await this.request('/guest/verify', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // User endpoints
  async getUserProfile() {
    try {
      const response = await this.request('/auth/me');
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserOrders() {
    try {
      const response = await this.request('/user/orders');
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserLikedProducts() {
    try {
      const response = await this.request('/user/liked-products');
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserPurchasedProducts() {
    try {
      const response = await this.request('/user/purchased-products');
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health');
      return { success: true, data: response };
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Create and export singleton instance
export const apiService = new APIService();
export default apiService;
