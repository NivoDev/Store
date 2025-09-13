import React, { createContext, useContext, useReducer, useEffect } from 'react';
import secureStorage from '../utils/secureStorage';

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

  // Login function - SECURITY: This is mock implementation for development
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
      
      // TODO: Replace with actual secure API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API response
      const user = {
        id: `user_${Date.now()}`, // More unique ID
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          newsletter: true,
          notifications: true
        }
      };
      
      // Store user data securely
      secureStorage.setItem('user', user);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: user
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message || 'Login failed'
      });
      return { success: false, error: error.message };
    }
  };

  // Register function - SECURITY: This is mock implementation for development
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
      
      // TODO: Replace with actual secure API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation - replace with actual API response
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        email: userData.email.toLowerCase().trim(),
        name: userData.name.trim(),
        avatar: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          newsletter: userData.newsletter || false,
          notifications: true
        }
      };
      
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
  const logout = () => {
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

  const value = {
    ...state,
    login,
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
