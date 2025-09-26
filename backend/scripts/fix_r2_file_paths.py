#!/usr/bin/env python3
"""
Script to fix R2 file paths in MongoDB to match actual R2 object structure.
Updates file_path from colon format to slash format.
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

async def fix_r2_file_paths():
    """Fix R2 file paths to match actual R2 object structure."""
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.atomic_rose

    print("🔍 Checking products for R2 file path issues...")
    
    updated_count = 0
    async for product in db.products.find({}):
        product_id = str(product["_id"])
        title = product.get("title")
        current_file_path = product.get("file_path")
        
        if not current_file_path:
            print(f"⚠️ Product '{title}' ({product_id}) has no file_path, skipping.")
            continue
            
        print(f"📦 Product: {title}")
        print(f"   Current file_path: {current_file_path}")
        
        # Fix the file path based on R2 structure
        new_file_path = None
        
        if current_file_path == "products:Psychedelic_Horizons_Sample_Pack.zip":
            # Convert to slash format to match R2 structure
            new_file_path = "products/Psychedelic_Horizons_Sample_Pack.zip"
        elif current_file_path.startswith("products:"):
            # Convert other products:file.zip to products/file.zip
            new_file_path = current_file_path.replace("products:", "products/", 1)
        
        if new_file_path and new_file_path != current_file_path:
            await db.products.update_one(
                {"_id": product["_id"]},
                {"$set": {"file_path": new_file_path}}
            )
            print(f"✅ Updated file_path: {current_file_path} → {new_file_path}")
            updated_count += 1
        else:
            print(f"✅ File path already correct: {current_file_path}")
    
    print(f"✨ Completed R2 file path fixes. {updated_count} products updated.")
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_r2_file_paths())