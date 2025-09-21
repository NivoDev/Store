#!/usr/bin/env python3
"""
Check what products exist in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

async def check_products():
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
    db = client.atomic_rose
    
    try:
        # Get all products
        cursor = db.products.find({})
        products = await cursor.to_list(length=None)
        
        print(f"📦 Found {len(products)} products:")
        for product in products:
            print(f"  - ID: {product['_id']}")
            print(f"    Title: {product.get('title', 'No title')}")
            print(f"    Type: {product.get('type', 'No type')}")
            print(f"    File Path: {product.get('file_path', 'No file_path')}")
            print("    ---")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_products())
