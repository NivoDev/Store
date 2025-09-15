#!/usr/bin/env python3
"""
Test the actual download URL generation
"""
import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# R2 Configuration
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "atomic-rose-tools-bucket")
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")

try:
    # Initialize R2 client
    r2_client = boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )
    
    # Test with the exact file key from R2
    file_key = "products:Psychedelic_Horizons_Sample_Pack.zip"
    
    print(f"🔗 Generating presigned URL for: {file_key}")
    
    presigned_url = r2_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': R2_BUCKET_NAME, 'Key': file_key},
        ExpiresIn=3600
    )
    
    print(f"✅ Presigned URL generated successfully!")
    print(f"URL: {presigned_url}")
    
    # Test the URL with a simple request
    import requests
    print(f"\n🌐 Testing the presigned URL...")
    
    response = requests.head(presigned_url, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    
    if response.status_code == 200:
        print("✅ URL is accessible!")
    else:
        print(f"❌ URL returned status {response.status_code}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
