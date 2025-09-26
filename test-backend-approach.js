#!/usr/bin/env node

/**
 * Test script using the same approach as the backend
 * Tests with environment variable approach
 */

// Simulate the environment variable (same as backend)
let NEWSLETTER_API_ENDPOINT = process.env.NEWSLETTER_API_ENDPOINT || 'https://v1.nocodeapi.com/nivos2/google_sheets/VNZpQxTFGbnudpde';
// Ensure tabId is included in the endpoint URL (same as backend fix)
if (NEWSLETTER_API_ENDPOINT && !NEWSLETTER_API_ENDPOINT.includes('tabId=')) {
    NEWSLETTER_API_ENDPOINT += '?tabId=Sheet1';
}

async function testBackendApproach() {
  console.log('🧪 Testing Backend Approach...');
  console.log('📍 NEWSLETTER_API_ENDPOINT:', NEWSLETTER_API_ENDPOINT);
  console.log('');
  
  // Test data matching backend format
  const newsletter_data = [
    ['Backend Test', 'backend@example.com', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }), 'Atomic-Rose']
  ];
  
  console.log('📤 Newsletter data to send:', newsletter_data);
  console.log('');
  
  try {
    const response = await fetch(NEWSLETTER_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletter_data),
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    console.log('');
    
    const responseText = await response.text();
    console.log('📊 Response Text:', responseText);
    console.log('');
    
    if (response.ok) {
      console.log('✅ SUCCESS! Backend approach works!');
    } else {
      console.log('❌ FAILED! Backend approach failed');
      console.log('🔍 This explains why newsletter integration is failing');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

// Run the test
testBackendApproach();
