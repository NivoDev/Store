import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import secureStorage from '../utils/secureStorage';

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  REMOVE_DISCOUNT: 'REMOVE_DISCOUNT',
  SET_SHIPPING: 'SET_SHIPPING'
};

// Initial cart state
const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: null,
  discountAmount: 0,
  itemCount: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, {
          ...product,
          quantity,
          cartId: uuidv4()
        }];
      }
      
      return calculateTotals({ ...state, items: newItems });
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.cartId !== action.payload);
      return calculateTotals({ ...state, items: newItems });
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { cartId, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.cartId !== cartId);
        return calculateTotals({ ...state, items: newItems });
      }
      
      const newItems = state.items.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      );
      return calculateTotals({ ...state, items: newItems });
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return { ...initialState };
    
    case CART_ACTIONS.APPLY_DISCOUNT: {
      const discount = action.payload;
      return calculateTotals({ ...state, discount });
    }
    
    case CART_ACTIONS.REMOVE_DISCOUNT:
      return calculateTotals({ ...state, discount: null });
    
    case CART_ACTIONS.SET_SHIPPING:
      return calculateTotals({ ...state, shipping: action.payload });
    
    default:
      return state;
  }
};

// Calculate cart totals
const calculateTotals = (state) => {
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  let discountAmount = 0;
  if (state.discount) {
    if (state.discount.type === 'percentage') {
      discountAmount = subtotal * (state.discount.value / 100);
    } else if (state.discount.type === 'fixed') {
      discountAmount = Math.min(state.discount.value, subtotal);
    }
  }
  
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.18; // Israel VAT rate 2025: 18%
  const total = taxableAmount + tax + state.shipping;
  
  return {
    ...state,
    subtotal,
    discountAmount,
    tax,
    total: Math.max(0, total),
    itemCount
  };
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from secure storage on mount
  useEffect(() => {
    const savedCart = secureStorage.getItem('cart');
    if (savedCart && savedCart.items) {
      // Validate cart data structure
      if (Array.isArray(savedCart.items)) {
        // Restore each item to recalculate totals
        savedCart.items.forEach(item => {
          if (item.id && item.price && item.quantity) {
            dispatch({
              type: CART_ACTIONS.ADD_ITEM,
              payload: { product: item, quantity: item.quantity }
            });
          }
        });
        
        if (savedCart.discount && savedCart.discount.code) {
          dispatch({
            type: CART_ACTIONS.APPLY_DISCOUNT,
            payload: savedCart.discount
          });
        }
      } else {
        // Invalid cart data, clear it
        secureStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to secure storage whenever it changes
  useEffect(() => {
    // Only save if cart has items or meaningful state
    if (state.items.length > 0 || state.discount) {
      secureStorage.setItem('cart', state);
    } else {
      secureStorage.removeItem('cart');
    }
  }, [state]);

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  // Remove item from cart
  const removeItem = (cartId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: cartId
    });
  };

  // Update item quantity
  const updateQuantity = (cartId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { cartId, quantity }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Apply discount code
  const applyDiscount = (discountCode) => {
    // Mock discount codes - replace with actual API integration
    const discountCodes = {
      'WELCOME10': { type: 'percentage', value: 10, code: 'WELCOME10' },
      'SAVE20': { type: 'percentage', value: 20, code: 'SAVE20' },
      'NEWUSER': { type: 'fixed', value: 5, code: 'NEWUSER' }
    };
    
    const discount = discountCodes[discountCode.toUpperCase()];
    if (discount) {
      dispatch({
        type: CART_ACTIONS.APPLY_DISCOUNT,
        payload: discount
      });
      return { success: true, discount };
    } else {
      return { success: false, error: 'Invalid discount code' };
    }
  };

  // Remove discount
  const removeDiscount = () => {
    dispatch({ type: CART_ACTIONS.REMOVE_DISCOUNT });
  };

  // Set shipping cost
  const setShipping = (cost) => {
    dispatch({
      type: CART_ACTIONS.SET_SHIPPING,
      payload: cost
    });
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
    setShipping,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
