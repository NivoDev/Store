#!/usr/bin/env python3
"""
Update existing product with made_by field
"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

async def update_product_made_by():
    """Update existing product with made_by field"""
    try:
        # Connect to MongoDB
        import certifi
        client = AsyncIOMotorClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=False,
            tlsAllowInvalidHostnames=False,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        db = client.get_database()
        
        # Find the existing product (assuming it's the Psychedelic Horizons product)
        product = await db.products.find_one({"title": "Psychedelic Horizons"})
        
        if not product:
            print("❌ Product not found")
            return
        
        print(f"📦 Found product: {product['title']}")
        
        # Update the product with made_by field
        result = await db.products.update_one(
            {"_id": product["_id"]},
            {
                "$set": {
                    "made_by": "Guerrilla"
                }
            }
        )
        
        if result.modified_count > 0:
            print("✅ Product updated with made_by field: Guerrilla")
        else:
            print("⚠️ No changes made to product")
        
        # Verify the update
        updated_product = await db.products.find_one({"_id": product["_id"]})
        print(f"📋 Updated product made_by: {updated_product.get('made_by', 'Not set')}")
        
    except Exception as e:
        print(f"❌ Error updating product: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_product_made_by())

