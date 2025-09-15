#!/usr/bin/env python3
"""
Update product with file_path for R2 download
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

async def update_product_file_path():
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.atomic_rose
    
    try:
        # Find the product by ID
        product = await db.products.find_one({"_id": ObjectId("68c814e1164976cc8581230d")})
        
        if not product:
            print("❌ No sample pack product found")
            return
        
        product_id = product["_id"]
        print(f"📦 Found product: {product['title']} (ID: {product_id})")
        
        # Update with file_path (using the exact R2 key with colons)
        file_path = "products:Psychedelic_Horizons_Sample_Pack.zip"
        
        result = await db.products.update_one(
            {"_id": product_id},
            {"$set": {"file_path": file_path}}
        )
        
        if result.modified_count > 0:
            print(f"✅ Updated product with file_path: {file_path}")
        else:
            print("❌ No changes made")
            
        # Verify the update
        updated_product = await db.products.find_one({"_id": product_id})
        print(f"📋 Updated product file_path: {updated_product.get('file_path', 'NOT SET')}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_product_file_path())
