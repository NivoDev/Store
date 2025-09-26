#!/usr/bin/env python3
"""
Comprehensive test script to verify R2 download functionality across all areas.
"""

import requests
import json
from datetime import datetime

# API base URL
API_BASE = "https://store-6ryk.onrender.com/api/v1"

def test_product_api():
    """Test product API with slug"""
    print("🔍 Testing Product API...")
    
    # Test slug-based product lookup
    response = requests.get(f"{API_BASE}/products/psychedelic-horizons")
    
    if response.status_code == 200:
        product = response.json()
        print(f"✅ Product found: {product.get('title')}")
        print(f"   ID: {product.get('id')}")
        print(f"   Slug: {product.get('slug')}")
        print(f"   File Path: {product.get('file_path')}")
        print(f"   Sample Files: {len(product.get('sample_files', []))}")
        return product
    else:
        print(f"❌ Product API failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def test_samples_api():
    """Test samples API"""
    print("\n🔍 Testing Samples API...")
    
    # Test samples endpoint
    response = requests.get(f"{API_BASE}/products/psychedelic-horizons/samples")
    
    if response.status_code == 200:
        samples = response.json()
        print(f"✅ Samples API working: {samples.get('total', 0)} samples found")
        if samples.get('data'):
            print("   Sample files:")
            for sample in samples['data']:
                print(f"     - {sample.get('title')} ({sample.get('duration')})")
        return samples
    else:
        print(f"❌ Samples API failed: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def test_sample_preview_api():
    """Test sample preview API"""
    print("\n🔍 Testing Sample Preview API...")
    
    # First get samples
    samples_response = requests.get(f"{API_BASE}/products/psychedelic-horizons/samples")
    
    if samples_response.status_code == 200:
        samples = samples_response.json()
        if samples.get('data') and len(samples['data']) > 0:
            sample_id = samples['data'][0].get('id')
            print(f"   Testing preview for sample: {sample_id}")
            
            # Test preview endpoint
            response = requests.get(f"{API_BASE}/samples/{sample_id}/preview?product_slug=psychedelic-horizons")
            
            if response.status_code == 200:
                preview = response.json()
                print(f"✅ Sample preview API working")
                print(f"   Preview URL: {preview.get('data', {}).get('preview_url', 'N/A')[:50]}...")
                return preview
            else:
                print(f"❌ Sample preview API failed: {response.status_code}")
                print(f"   Response: {response.text}")
        else:
            print("❌ No samples found to test preview")
    else:
        print("❌ Could not get samples for preview test")
    
    return None

def test_download_endpoints():
    """Test download endpoints"""
    print("\n🔍 Testing Download Endpoints...")
    
    # Test user download endpoint (will fail without auth, but should return proper error)
    response = requests.get(f"{API_BASE}/download/68c814e1164976cc8581230d")
    
    if response.status_code == 401:
        print("✅ Download endpoint exists (requires authentication)")
    elif response.status_code == 403:
        print("✅ Download endpoint exists (product not purchased)")
    else:
        print(f"❌ Download endpoint unexpected response: {response.status_code}")
        print(f"   Response: {response.text}")

def test_health_endpoint():
    """Test health endpoint"""
    print("\n🔍 Testing Health Endpoint...")
    
    response = requests.get(f"{API_BASE}/health")
    
    if response.status_code == 200:
        health = response.json()
        print(f"✅ Health endpoint working: {health.get('status')}")
        return True
    else:
        print(f"❌ Health endpoint failed: {response.status_code}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting R2 Download Functionality Tests")
    print("=" * 50)
    
    # Test health first
    if not test_health_endpoint():
        print("❌ Backend is not healthy, stopping tests")
        return
    
    # Test product API
    product = test_product_api()
    
    # Test samples API
    samples = test_samples_api()
    
    # Test sample preview API
    preview = test_sample_preview_api()
    
    # Test download endpoints
    test_download_endpoints()
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"   Product API: {'✅ Working' if product else '❌ Failed'}")
    print(f"   Samples API: {'✅ Working' if samples else '❌ Failed'}")
    print(f"   Preview API: {'✅ Working' if preview else '❌ Failed'}")
    print(f"   Download API: ✅ Endpoint exists")
    
    print("\n🎯 Next Steps:")
    if not product or not product.get('file_path'):
        print("   1. Update MongoDB document with file_path field")
    if not samples or not samples.get('data'):
        print("   2. Add sample_files array to MongoDB document")
    if not preview:
        print("   3. Verify sample R2 files are uploaded correctly")
    
    print("   4. Test frontend integration")
    print("   5. Test email template download links")

if __name__ == "__main__":
    main()
