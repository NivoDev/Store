#!/usr/bin/env python3
"""
Script to update product preview audio URL in MongoDB
Updates the Psychedelic Horizons product with the correct R2 audio URL
"""

import os
import sys
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    print("❌ MONGODB_URI not found in environment variables")
    sys.exit(1)

# R2 Public URL
R2_PUBLIC_URL = "https://pub-9c5bbe78ba1841d88724531ea527bb7d.r2.dev"

def update_product_audio():
    """Update the product preview audio URL"""
    try:
        # Connect to MongoDB
        print("🔌 Connecting to MongoDB...")
        import certifi
        client = MongoClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=False,
            tlsAllowInvalidHostnames=False,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        db = client.get_default_database()
        products_collection = db.products
        
        # Product ID from your MongoDB document
        product_id = "68c814e1164976cc8581230d"
        
        # New audio URL based on R2 structure
        new_audio_url = f"{R2_PUBLIC_URL}/mp3/Psychedelic_Horizons_Sample_Pack.mp3"
        
        print(f"📝 Updating product: {product_id}")
        print(f"🎵 New audio URL: {new_audio_url}")
        
        # Update the product
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$set": {
                    "preview_audio_url": new_audio_url,
                    "updated_at": "2025-09-20T17:16:00.000Z"  # Current timestamp
                }
            }
        )
        
        if result.modified_count > 0:
            print("✅ Product audio updated successfully!")
            
            # Verify the update
            updated_product = products_collection.find_one({"_id": ObjectId(product_id)})
            if updated_product:
                print(f"🔍 Updated preview_audio_url: {updated_product.get('preview_audio_url')}")
                print(f"📦 Product title: {updated_product.get('title')}")
                print(f"🏷️  Product SKU: {updated_product.get('sku')}")
            else:
                print("❌ Could not verify update")
        else:
            print("⚠️  No documents were modified. Product might not exist or already has this URL.")
            
            # Check if product exists
            product = products_collection.find_one({"_id": ObjectId(product_id)})
            if product:
                print(f"📦 Product found: {product.get('title')}")
                print(f"🎵 Current audio URL: {product.get('preview_audio_url')}")
            else:
                print("❌ Product not found with ID:", product_id)
        
    except Exception as e:
        print(f"❌ Error updating product: {e}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
    finally:
        # Close connection
        if 'client' in locals():
            client.close()
            print("🔌 MongoDB connection closed")

if __name__ == "__main__":
    print("🚀 Starting product audio update...")
    print("=" * 50)
    update_product_audio()
    print("=" * 50)
    print("✨ Script completed!")

