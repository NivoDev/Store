/**
 * Keep-alive service to prevent Render backend from sleeping
 * Pings the backend every 10 minutes to keep it awake
 */

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
    this.pingInterval = 10 * 60 * 1000; // 10 minutes
    this.backendUrl = process.env.REACT_APP_API_BASE_URL || 'https://store-6ryk.onrender.com/api/v1';
  }

  start() {
    if (this.isActive) {
      console.log('🔄 Keep-alive service already running');
      return;
    }

    console.log('🔄 Starting keep-alive service');
    this.isActive = true;
    
    // Ping immediately
    this.pingBackend();
    
    // Set up interval
    this.intervalId = setInterval(() => {
      this.pingBackend();
    }, this.pingInterval);
  }

  stop() {
    if (!this.isActive) {
      console.log('🔄 Keep-alive service not running');
      return;
    }

    console.log('🛑 Stopping keep-alive service');
    this.isActive = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async pingBackend() {
    try {
      const response = await fetch(`${this.backendUrl.replace('/api/v1', '')}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Keep-alive: Backend is awake (${new Date().toLocaleTimeString()})`);
        return true;
      } else {
        console.warn(`⚠️ Keep-alive: Backend responded with status ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Keep-alive: Failed to ping backend:`, error);
      return false;
    }
  }

  // Method to manually wake up the backend
  async wakeUpBackend() {
    console.log('🔄 Manually waking up backend...');
    const success = await this.pingBackend();
    
    if (success) {
      console.log('✅ Backend is now awake');
    } else {
      console.log('❌ Failed to wake up backend');
    }
    
    return success;
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;

