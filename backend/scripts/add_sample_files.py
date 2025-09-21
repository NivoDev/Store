#!/usr/bin/env python3
"""
Script to add sample files to existing product in MongoDB.
"""

import asyncio
from datetime import datetime
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

async def add_sample_files():
    """Add sample files to the existing product"""
    
    # Sample files data based on your R2 uploads
    sample_files = [
        {
            "id": "sample-1",
            "title": "Cat",
            "duration": "0:15",
            "r2_key": "samples/68c814e1164976cc8581230d/cat.mp3",
            "file_size": 28256,  # 27.59 KB in bytes
            "format": "mp3",
            "order": 1
        },
        {
            "id": "sample-2",
            "title": "Ding",
            "duration": "0:12",
            "r2_key": "samples/68c814e1164976cc8581230d/ding.mp3",
            "file_size": 89920,  # 87.77 KB in bytes
            "format": "mp3",
            "order": 2
        },
        {
            "id": "sample-3",
            "title": "Drum Loops",
            "duration": "0:18",
            "r2_key": "samples/68c814e1164976cc8581230d/drumloops.mp3",
            "file_size": 371498,  # 362.79 KB in bytes
            "format": "mp3",
            "order": 3
        },
        {
            "id": "sample-4",
            "title": "Santur",
            "duration": "0:25",
            "r2_key": "samples/68c814e1164976cc8581230d/santur.mp3",
            "file_size": 4291584,  # 4.19 MB in bytes
            "format": "mp3",
            "order": 4
        }
    ]
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Find the product
        product_id = "68c814e1164976cc8581230d"
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        
        if not product:
            print(f"❌ Product {product_id} not found")
            return
        
        print(f"✅ Found product: {product.get('title')}")
        
        # Update the product with sample files
        result = await db.products.update_one(
            {"_id": ObjectId(product_id)},
            {
                "$set": {
                    "sample_files": sample_files,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully added {len(sample_files)} sample files to product")
            print("📁 Sample files added:")
            for sample in sample_files:
                print(f"   - {sample['title']} ({sample['duration']}) - {sample['r2_key']}")
        else:
            print("❌ Failed to update product")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_sample_files())
