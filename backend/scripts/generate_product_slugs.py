#!/usr/bin/env python3
"""
Script to generate slugs for existing products in MongoDB.
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

async def generate_product_slugs():
    """Generate slugs for all products in MongoDB."""
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Get all products
        products = await db.products.find({}).to_list(length=None)
        
        print(f"📦 Found {len(products)} products to process")
        
        updated_count = 0
        
        for product in products:
            product_id = product.get("_id")
            title = product.get("title", "")
            existing_slug = product.get("slug")
            
            if not title:
                print(f"⚠️ Skipping product {product_id} - no title")
                continue
            
            # Generate new slug
            new_slug = generate_slug(title)
            
            if not new_slug:
                print(f"⚠️ Skipping product {product_id} - could not generate slug from title: '{title}'")
                continue
            
            # Check if slug already exists and is different
            if existing_slug == new_slug:
                print(f"✅ Product '{title}' already has correct slug: {new_slug}")
                continue
            
            # Check if slug is already used by another product
            existing_product = await db.products.find_one({"slug": new_slug, "_id": {"$ne": product_id}})
            if existing_product:
                # Add product ID to make it unique
                new_slug = f"{new_slug}-{str(product_id)[-6:]}"
                print(f"🔄 Slug conflict for '{title}', using unique slug: {new_slug}")
            
            # Update the product with the new slug
            result = await db.products.update_one(
                {"_id": product_id},
                {"$set": {"slug": new_slug, "updated_at": datetime.utcnow()}}
            )
            
            if result.modified_count > 0:
                updated_count += 1
                print(f"✅ Updated product '{title}' with slug: {new_slug}")
            else:
                print(f"⚠️ No changes made for product '{title}'")
        
        print(f"\n🎉 Successfully updated {updated_count} products with slugs")
        
    except Exception as e:
        print(f"❌ Error generating product slugs: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(generate_product_slugs())
