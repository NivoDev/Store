#!/usr/bin/env python3
"""
Script to add slug to existing product and update R2 file path structure.
"""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

def generate_slug(title: str) -> str:
    """
    Generate a URL-friendly slug from a product title.
    """
    if not title:
        return ""
    
    # Convert to lowercase
    slug = title.lower()
    
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    
    return slug

async def update_product_with_slug():
    """Update the existing product with slug and new R2 path structure."""
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Find the existing product
        product_id = "68c814e1164976cc8581230d"
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        
        if not product:
            print(f"❌ Product {product_id} not found")
            return
        
        title = product.get("title", "")
        print(f"📦 Found product: {title}")
        
        # Generate slug
        slug = generate_slug(title)
        print(f"🔗 Generated slug: {slug}")
        
        # Update R2 file path structure
        # Old: products:Psychedelic_Horizons_Sample_Pack.zip
        # New: products/Psychedelic_Horizons_Sample_Pack.zip
        old_r2_path = "products:Psychedelic_Horizons_Sample_Pack.zip"
        new_r2_path = "products/Psychedelic_Horizons_Sample_Pack.zip"
        
        print(f"📁 R2 Path Update:")
        print(f"   Old: {old_r2_path}")
        print(f"   New: {new_r2_path}")
        
        # Update the product with slug and new R2 path
        update_data = {
            "slug": slug,
            "updated_at": datetime.utcnow()
        }
        
        # Update R2 path if it exists in the product
        if "r2_file_path" in product:
            update_data["r2_file_path"] = new_r2_path
            print(f"✅ Updated R2 file path in product")
        
        result = await db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            print(f"✅ Successfully updated product with slug: {slug}")
            print(f"✅ Product now accessible at: /product/{slug}")
        else:
            print("⚠️ No changes made to product")
        
        # Verify the update
        updated_product = await db.products.find_one({"_id": ObjectId(product_id)})
        print(f"\n📋 Updated product data:")
        print(f"   Title: {updated_product.get('title')}")
        print(f"   Slug: {updated_product.get('slug')}")
        print(f"   R2 Path: {updated_product.get('r2_file_path', 'Not set')}")
        
    except Exception as e:
        print(f"❌ Error updating product: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_product_with_slug())
