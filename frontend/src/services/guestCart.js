/**
 * Guest cart service using cookies for persistent storage
 */

const GUEST_CART_KEY = 'atomic_rose_guest_cart';
const CART_EXPIRY_DAYS = 7;

class GuestCartService {
  constructor() {
    console.log(`🏗️ Initializing GuestCartService`);
    this.cart = this.loadCart();
    console.log(`🏗️ GuestCartService initialized with cart:`, this.cart);
  }

  // Load cart from cookies
  loadCart() {
    let cartData;
    try {
      cartData = this.getCookie(GUEST_CART_KEY);
      console.log(`📥 Loading cart from cookies:`, cartData);
      console.log(`📥 All cookies:`, document.cookie);
      
      if (cartData) {
        const parsed = JSON.parse(cartData);
        console.log(`📥 Parsed cart data:`, parsed);
        
        // Check if cart has expired
        if (parsed.expiresAt && new Date() > new Date(parsed.expiresAt)) {
          console.log(`📥 Cart expired, clearing it`);
          console.log(`📥 Expiration date:`, parsed.expiresAt);
          console.log(`📥 Current date:`, new Date().toISOString());
          this.clearCart();
          return { items: [], total: 0, count: 0 };
        }
        
        // Set the cart data
        this.cart = { items: parsed.items || [], total: parsed.total || 0, count: parsed.count || 0 };
        console.log(`📥 Cart loaded successfully:`, this.cart);
        return this.cart;
      } else {
        console.log(`📥 No cart data found in cookies`);
      }
    } catch (error) {
      console.warn('Error loading guest cart:', error);
      console.warn('Error details:', error.message);
      console.warn('Cart data that failed to parse:', cartData);
      this.clearCart();
    }
    return { items: [], total: 0, count: 0 };
  }

  // Save cart to cookies
  saveCart() {
    try {
      const cartData = {
        ...this.cart,
        expiresAt: new Date(Date.now() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log(`💾 Saving cart to cookies:`, cartData);
      this.setCookie(GUEST_CART_KEY, JSON.stringify(cartData), CART_EXPIRY_DAYS);
      console.log(`💾 Cart saved successfully`);
      console.log(`💾 All cookies after save:`, document.cookie);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  // Add item to cart
  addItem(product) {
    console.log(`🛒 GuestCart.addItem called with product:`, product);
    console.log(`🛒 Current cart before add:`, this.cart);
    
    // Ensure cart is initialized
    if (!this.cart) {
      console.log(`🛒 Cart not initialized, initializing...`);
      this.cart = { items: [], total: 0, count: 0 };
    }
    
    const existingItemIndex = this.cart.items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Item already exists, increase quantity
      this.cart.items[existingItemIndex].quantity += 1;
      console.log(`🛒 Item exists, increasing quantity to:`, this.cart.items[existingItemIndex].quantity);
    } else {
      // Add new item
      const newItem = {
        id: product.id,
        title: product.title,
        artist: product.made_by || product.artist || 'Unknown Artist',
        price: product.price,
        cover_image_url: product.cover_image_url,
        quantity: 1,
        addedAt: new Date().toISOString()
      };
      this.cart.items.push(newItem);
      console.log(`🛒 New item added:`, newItem);
    }

    this.updateTotals();
    console.log(`🛒 Cart after update totals:`, this.cart);
    this.saveCart();
    console.log(`🛒 Cart saved to cookies`);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('guestCartChanged', { 
      detail: { cart: this.cart, action: 'add', productId: product.id }
    }));
    
    return this.cart;
  }

  // Remove item from cart
  removeItem(productId) {
    console.log(`🗑️ GuestCart.removeItem called with productId:`, productId);
    console.log(`🗑️ Current cart before remove:`, this.cart);
    
    this.cart.items = this.cart.items.filter(item => item.id !== productId);
    this.updateTotals();
    console.log(`🗑️ Cart after remove:`, this.cart);
    this.saveCart();
    console.log(`🗑️ Cart saved to cookies`);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('guestCartChanged', { 
      detail: { cart: this.cart, action: 'remove', productId: productId }
    }));
    
    return this.cart;
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const itemIndex = this.cart.items.findIndex(item => item.id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
      
      this.cart.items[itemIndex].quantity = quantity;
      this.updateTotals();
      this.saveCart();
    }
    
    return this.cart;
  }

  // Get cart contents
  getCart() {
    return this.cart;
  }

  // Check if item is in cart
  isInCart(productId) {
    const inCart = this.cart.items.some(item => item.id === productId);
    console.log(`🔍 isInCart check for ${productId}: ${inCart}`);
    console.log(`🔍 Current cart items:`, this.cart.items.map(item => item.id));
    return inCart;
  }

  // Get item quantity
  getItemQuantity(productId) {
    const item = this.cart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  // Clear entire cart
  clearCart() {
    console.log(`🧹 Clearing guest cart`);
    this.cart = { items: [], total: 0, count: 0 };
    this.deleteCookie(GUEST_CART_KEY);
    console.log(`🧹 Cart cleared successfully`);
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('guestCartChanged', { 
      detail: { cart: this.cart, action: 'clear', productId: null }
    }));
    
    return this.cart;
  }

  // Clean invalid items from cart
  cleanInvalidItems() {
    console.log(`🧹 GuestCart.cleanInvalidItems called`);
    console.log(`🧹 Current cart before cleaning:`, this.cart);
    
    if (!this.cart) {
      console.log(`🧹 Cart not initialized, initializing...`);
      this.cart = { items: [], total: 0, count: 0 };
    }
    
    const originalCount = this.cart.items.length;
    console.log(`🧹 Original item count:`, originalCount);
    
    const validItems = this.cart.items.filter(item => {
      const isValidId = /^[0-9a-fA-F]{24}$/.test(item.id);
      if (!isValidId) {
        console.warn(`⚠️ Removing invalid item: ${item.id} (${item.title})`);
      }
      return isValidId;
    });
    
    console.log(`🧹 Valid items after filtering:`, validItems.length);
    
    if (validItems.length !== originalCount) {
      console.log(`🧹 Cleaned ${originalCount - validItems.length} invalid items from cart`);
      this.cart.items = validItems;
      this.updateTotals();
      this.saveCart();
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('guestCartChanged', { 
        detail: { cart: this.cart, action: 'clean' }
      }));
    } else {
      console.log(`🧹 No invalid items found, cart unchanged`);
    }
    
    console.log(`🧹 Final cart after cleaning:`, this.cart);
    return this.cart;
  }

  // Update cart totals
  updateTotals() {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cart.count = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Cookie helper methods
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    console.log(`🍪 Setting cookie:`, cookieString);
    document.cookie = cookieString;
    console.log(`🍪 Cookie set, all cookies now:`, document.cookie);
  }

  getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    console.log(`🍪 Looking for cookie "${name}" in:`, document.cookie);
    console.log(`🍪 Split cookies:`, ca);
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = c.substring(nameEQ.length, c.length);
        console.log(`🍪 Found cookie "${name}":`, value);
        return value;
      }
    }
    console.log(`🍪 Cookie "${name}" not found`);
    return null;
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  // Get cart summary for display
  getCartSummary() {
    return {
      itemCount: this.cart.count,
      totalPrice: this.cart.total,
      isEmpty: this.cart.items.length === 0,
      items: this.cart.items
    };
  }

  // Debug function to log cart state
  debugCart() {
    console.log('🔍 Guest Cart Debug:');
    console.log('  Items:', this.cart.items);
    console.log('  Count:', this.cart.count);
    console.log('  Total:', this.cart.total);
    console.log('  Is Empty:', this.cart.items.length === 0);
  }


  // Prepare cart for checkout
  prepareCheckout() {
    if (this.cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    return {
      items: this.cart.items.map(item => ({
        productId: item.id,
        title: item.title,
        artist: item.made_by || item.artist || 'Unknown Artist',
        price: item.price,
        quantity: item.quantity
      })),
      total: this.cart.total,
      count: this.cart.count
    };
  }
}

// Create singleton instance
const guestCartService = new GuestCartService();

export default guestCartService;
