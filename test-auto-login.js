#!/usr/bin/env node

/**
 * Test script to debug auto-login response
 * This will help us see what the backend is actually returning
 */

const API_BASE_URL = 'https://store-6ryk.onrender.com/api/v1';

async function testAutoLogin() {
  console.log('🧪 Testing Auto-Login Response...');
  console.log('');
  
  // Use a sample token (this will fail but we can see the response structure)
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGNkYjQzZjhmNWE0MWI5MDBlNTc1NDgiLCJleHAiOjE3NTg5MTYzMTR9.6F6vnhYTVo1dSA-3e6boneGkkdnel4KZ7Epushv0Drw';
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/auto-login?token=${encodeURIComponent(sampleToken)}&redirect=/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    console.log('');
    
    const responseText = await response.text();
    console.log('📊 Response Text:', responseText);
    console.log('');
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('📊 Parsed Response:');
      console.log('  - message:', data.message);
      console.log('  - access_token:', data.access_token ? 'Present' : 'Missing');
      console.log('  - user:', data.user ? 'Present' : 'Missing');
      if (data.user) {
        console.log('    - user.id:', data.user.id);
        console.log('    - user.name:', data.user.name);
        console.log('    - user.email:', data.user.email);
        console.log('    - user.email_verified:', data.user.email_verified);
      }
      console.log('  - redirect_url:', data.redirect_url);
    } else {
      console.log('❌ Auto-login failed');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

// Run the test
testAutoLogin();
