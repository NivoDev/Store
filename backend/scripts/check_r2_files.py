#!/usr/bin/env python3
"""
Check what files are actually in the R2 bucket
"""
import boto3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# R2 configuration
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")

def check_r2_files():
    """List all files in the R2 bucket"""
    try:
        # Create R2 client
        r2_client = boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name='auto'
        )
        
        print(f"🔍 Checking files in R2 bucket: {R2_BUCKET_NAME}")
        print("=" * 60)
        
        # List all objects in the bucket
        response = r2_client.list_objects_v2(Bucket=R2_BUCKET_NAME)
        
        if 'Contents' not in response:
            print("❌ No files found in bucket")
            return
        
        print(f"📁 Found {len(response['Contents'])} files:")
        print()
        
        for obj in response['Contents']:
            key = obj['Key']
            size = obj['Size']
            last_modified = obj['LastModified']
            print(f"📄 {key}")
            print(f"   Size: {size:,} bytes")
            print(f"   Modified: {last_modified}")
            print()
        
        # Check specifically for product files
        print("🔍 Looking for product files:")
        product_files = [obj for obj in response['Contents'] if 'product' in obj['Key'].lower()]
        
        if product_files:
            for obj in product_files:
                print(f"📦 {obj['Key']}")
        else:
            print("❌ No product files found")
            
    except Exception as e:
        print(f"❌ Error checking R2 files: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_r2_files()
