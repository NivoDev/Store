#!/usr/bin/env python3
"""
Keep-alive script for Render free tier backend
This script pings the backend every 10 minutes to keep it awake
"""
import requests
import time
import os
from datetime import datetime

# Backend URL
BACKEND_URL = "https://store-6ryk.onrender.com"

def ping_backend():
    """Ping the backend to keep it awake"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=30)
        if response.status_code == 200:
            print(f"✅ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Backend is awake")
            return True
        else:
            print(f"⚠️ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Backend responded with status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Failed to ping backend: {e}")
        return False

def main():
    """Main keep-alive loop"""
    print(f"🔄 Starting keep-alive service for {BACKEND_URL}")
    print("Press Ctrl+C to stop")
    
    while True:
        ping_backend()
        # Wait 10 minutes (600 seconds) before next ping
        time.sleep(600)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Keep-alive service stopped")

