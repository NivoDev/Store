import React, { createContext, useContext, useReducer, useEffect } from 'react';
import secureStorage from '../utils/secureStorage';
import apiService from '../services/api';

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Initial auth state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from secure storage on mount
  useEffect(() => {
    const savedUser = secureStorage.getItem('user');
    if (savedUser) {
      // Validate user data structure
      if (savedUser.id && savedUser.email) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: savedUser
        });
      } else {
        // Invalid user data, clear it
        secureStorage.removeItem('user');
      }
    }
  }, []);

  // Function to refresh user data
  const refreshUserData = async () => {
    if (state.isAuthenticated && state.user) {
      try {
        const result = await apiService.getCurrentUser();
        if (result.success) {
          const updatedUser = result.data;
          secureStorage.setItem('user', updatedUser);
          dispatch({
            type: AUTH_ACTIONS.UPDATE_PROFILE,
            payload: updatedUser
          });
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  // Listen for user data update events
  useEffect(() => {
    const handleUserDataUpdate = () => {
      refreshUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, [state.isAuthenticated, state.user]);

  // Login function with API integration
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Call API service
      const result = await apiService.login(email, password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      const user = result.data.user;
      
      // Store user data securely
      secureStorage.setItem('user', user);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: user
      });
      
      // Transfer any guest orders to user account
      try {
        const transferResult = await apiService.transferGuestOrders();
        if (transferResult.success && transferResult.data.transferred_products > 0) {
          console.log(`✅ Transferred ${transferResult.data.transferred_products} products from guest orders`);
          // Refresh user data to include transferred products
          refreshUserData();
        }
      } catch (error) {
        console.warn('⚠️ Failed to transfer guest orders:', error);
        // Don't fail login if transfer fails
      }
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Login failed'
      });
      return { success: false, error: error.message };
    }
  };

  // Register function with API integration
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      // Input validation
      if (!userData.email || !userData.name || !userData.password) {
        throw new Error('Email, name, and password are required');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Invalid email format');
      }
      
      if (userData.name.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Call API service
      const result = await apiService.register(userData);
      
      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }
      
      const user = result.data.user;
      
      // Store user data securely
      secureStorage.setItem('user', user);
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: user
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message || 'Registration failed'
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    
    secureStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update profile function
  const updateProfile = (updates) => {
    const updatedUser = { ...state.user, ...updates };
    secureStorage.setItem('user', updatedUser);
    dispatch({
      type: AUTH_ACTIONS.UPDATE_PROFILE,
      payload: updates
    });
  };

  // OAuth login function for Google, Facebook, etc.
  const loginWithOAuth = async (user, accessToken) => {
    try {
      // Store user data and token securely
      secureStorage.setItem('user', user);
      secureStorage.setItem('token', accessToken);
      
      // Update auth state
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: user
      });
      
      // Transfer any guest orders to user account
      try {
        const transferResult = await apiService.transferGuestOrders();
        if (transferResult.success && transferResult.data.transferred_products > 0) {
          console.log(`✅ Transferred ${transferResult.data.transferred_products} products from guest orders`);
          // Refresh user data to include transferred products
          refreshUserData();
        }
      } catch (error) {
        console.warn('⚠️ Failed to transfer guest orders:', error);
        // Don't fail login if transfer fails
      }
      
      return { success: true };
    } catch (error) {
      console.error('OAuth login error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'OAuth login failed'
      });
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    loginWithOAuth,
    register,
    logout,
    clearError,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
