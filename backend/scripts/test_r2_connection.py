#!/usr/bin/env python3
"""
Test R2 connection and credentials
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

print("🔍 Testing R2 Configuration...")
print(f"R2_ACCESS_KEY_ID: {'✅ Set' if R2_ACCESS_KEY_ID else '❌ Missing'}")
print(f"R2_SECRET_ACCESS_KEY: {'✅ Set' if R2_SECRET_ACCESS_KEY else '❌ Missing'}")
print(f"R2_BUCKET_NAME: {R2_BUCKET_NAME}")
print(f"R2_ACCOUNT_ID: {'✅ Set' if R2_ACCOUNT_ID else '❌ Missing'}")

if not all([R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID]):
    print("❌ Missing R2 credentials. Please check your .env file.")
    exit(1)

try:
    # Initialize R2 client
    r2_client = boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )
    
    print("\n🔄 Testing R2 connection...")
    
    # Test 1: List objects in bucket
    print("📦 Listing objects in bucket...")
    response = r2_client.list_objects_v2(Bucket=R2_BUCKET_NAME, MaxKeys=10)
    
    if 'Contents' in response:
        print(f"✅ Found {len(response['Contents'])} objects:")
        for obj in response['Contents']:
            print(f"  - {obj['Key']} ({obj['Size']} bytes)")
    else:
        print("⚠️  No objects found in bucket")
    
    # Test 2: Generate presigned URL for test file
    test_file = "products/Psychedelic_Horizons_Sample_Pack.zip"
    print(f"\n🔗 Testing presigned URL for: {test_file}")
    
    try:
        presigned_url = r2_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': R2_BUCKET_NAME, 'Key': test_file},
            ExpiresIn=3600
        )
        print(f"✅ Presigned URL generated successfully!")
        print(f"URL: {presigned_url[:100]}...")
    except ClientError as e:
        print(f"❌ Failed to generate presigned URL: {e}")
        print(f"Error Code: {e.response['Error']['Code']}")
        print(f"Error Message: {e.response['Error']['Message']}")
    
    # Test 3: Check if file exists
    print(f"\n🔍 Checking if file exists: {test_file}")
    try:
        response = r2_client.head_object(Bucket=R2_BUCKET_NAME, Key=test_file)
        print(f"✅ File exists! Size: {response['ContentLength']} bytes")
        print(f"Last Modified: {response['LastModified']}")
    except ClientError as e:
        print(f"❌ File not found: {e}")
        print("Available files:")
        response = r2_client.list_objects_v2(Bucket=R2_BUCKET_NAME)
        if 'Contents' in response:
            for obj in response['Contents']:
                print(f"  - {obj['Key']}")
    
except Exception as e:
    print(f"❌ R2 connection failed: {e}")
    print(f"Error type: {type(e).__name__}")
