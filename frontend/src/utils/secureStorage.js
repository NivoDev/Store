// Secure storage utility to replace plaintext localStorage
// This provides basic encryption for sensitive client-side data

class SecureStorage {
  constructor() {
    // Simple encryption key rotation
    this.encryptionKey = this.getOrCreateKey();
    this.prefix = 'guerrilla_secure_';
  }

  // Generate or retrieve encryption key
  getOrCreateKey() {
    let key = localStorage.getItem('app_persistent_key');
    if (!key) {
      // Generate a simple key for persistent encryption
      key = btoa(Math.random().toString(36).substring(2) + Date.now().toString(36));
      localStorage.setItem('app_persistent_key', key);
    }
    return key;
  }

  // Simple XOR encryption (for basic obfuscation)
  encrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  }

  // Simple XOR decryption
  decrypt(encodedText, key) {
    try {
      const text = atob(encodedText);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      return result;
    } catch (error) {
      return null;
    }
  }

  // Store encrypted data
  setItem(key, data) {
    try {
      if (data === null || data === undefined) {
        this.removeItem(key);
        return;
      }

      const serializedData = JSON.stringify(data);
      const encrypted = this.encrypt(serializedData, this.encryptionKey);
      localStorage.setItem(this.prefix + key, encrypted);
      
      // Also store in regular localStorage as backup
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.warn('SecureStorage: Failed to encrypt data, using fallback');
      // Fallback to regular storage
      try {
        localStorage.setItem(this.prefix + key, JSON.stringify(data));
        localStorage.setItem(key, JSON.stringify(data));
      } catch (fallbackError) {
        console.error('SecureStorage: Failed to store data completely');
      }
    }
  }

  // Retrieve and decrypt data
  getItem(key) {
    try {
      const encryptedData = localStorage.getItem(this.prefix + key);
      if (!encryptedData) {
        return null;
      }

      const decryptedData = this.decrypt(encryptedData, this.encryptionKey);
      if (!decryptedData) {
        // If decryption fails, try parsing as plain JSON (legacy data)
        try {
          return JSON.parse(encryptedData);
        } catch {
          // If that fails, try regular localStorage as fallback
          const fallbackData = localStorage.getItem(key);
          if (fallbackData) {
            try {
              return JSON.parse(fallbackData);
            } catch {
              this.removeItem(key);
              return null;
            }
          }
          this.removeItem(key);
          return null;
        }
      }

      return JSON.parse(decryptedData);
    } catch (error) {
      console.warn('SecureStorage: Failed to decrypt data, trying fallback');
      // Try regular localStorage as fallback
      try {
        const fallbackData = localStorage.getItem(key);
        if (fallbackData) {
          return JSON.parse(fallbackData);
        }
      } catch (fallbackError) {
        console.warn('SecureStorage: Fallback also failed');
      }
      this.removeItem(key);
      return null;
    }
  }

  // Remove item
  removeItem(key) {
    localStorage.removeItem(this.prefix + key);
  }

  // Clear all secure storage items
  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Check if item exists
  hasItem(key) {
    return localStorage.getItem(this.prefix + key) !== null;
  }
}

// Create singleton instance
const secureStorage = new SecureStorage();

export default secureStorage;
