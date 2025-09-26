#!/usr/bin/env node

/**
 * Test script for NoCodeAPI Google Sheets endpoint
 * Tests the "Add new Rows" functionality
 */

const API_ENDPOINT = 'https://v1.nocodeapi.com/nivos2/google_sheets/VNZpQxTFGbnudpde?tabId=Sheet1';

async function testNoCodeAPIEndpoint() {
  console.log('🧪 Testing NoCodeAPI Google Sheets Endpoint...');
  console.log('📍 Endpoint:', API_ENDPOINT);
  console.log('');
  
  // Test data matching your sheet structure
  const testData = [
    ['Test User', 'test@example.com', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }), 'Atomic-Rose']
  ];
  
  console.log('📤 Sending data:', testData);
  console.log('');
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    console.log('');
    
    const responseText = await response.text();
    console.log('📊 Response Text:', responseText);
    console.log('');
    
    if (response.ok) {
      console.log('✅ SUCCESS! NoCodeAPI endpoint is working correctly!');
      console.log('📝 Test data should now appear in your Google Sheets');
    } else {
      console.log('❌ FAILED! NoCodeAPI endpoint returned an error');
      console.log('🔍 Check the response text above for details');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('🔍 This could be a network issue or endpoint configuration problem');
  }
}

// Run the test
testNoCodeAPIEndpoint();
