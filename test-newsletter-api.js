#!/usr/bin/env node

/**
 * Test script for newsletter API endpoint
 * Tests the newsletter subscription functionality
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://store-6ryk.onrender.com/api/v1';

async function testNewsletterAPI() {
  console.log('🧪 Testing Newsletter API...');
  console.log('📍 API Base URL:', API_BASE_URL);
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com'
  };
  
  console.log('📤 Sending data:', testData);
  console.log('📤 Expected format: {tabId: "0", data: [["Name", "Email", "Date", "Source"]]}');
  
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    const data = await response.json();
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ Newsletter API test successful!');
    } else {
      console.log('❌ Newsletter API test failed:', data.detail || data.message);
    }
    
  } catch (error) {
    console.error('❌ Newsletter API test error:', error.message);
  }
}

// Run the test
testNewsletterAPI();