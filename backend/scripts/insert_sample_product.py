#!/usr/bin/env python3
"""
Script to insert a sample product into MongoDB.
Uses the first product from mock data and converts it to match validation rules.
"""

import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

async def insert_sample_product():
    """Insert the first sample pack from mock data into MongoDB"""
    
    # Sample product data (converted from mock data to match validation rules)
    sample_product = {
        "sku": "SP001",
        "title": "Psychedelic Horizons",
        "description": "A journey through progressive psytrance with deep basslines, ethereal pads, and hypnotic arpeggios. Perfect for creating atmospheric progressive tracks.",
        "type": "sample-pack",
        "price": 24.99,
        "original_price": 34.99,
        "discount_percentage": 29,
        "bpm": "132-138",
        "key": "Various",
        "genre": "Progressive Psytrance",
        "tags": ["Progressive", "Atmospheric", "Deep", "Psychedelic"],
        "sample_count": 45,
        "total_duration": "2:34:12",
        "formats": ["WAV", "24-bit"],
        "total_size": "1.2 GB",
        "cover_image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center",
        "preview_audio_url": "/audio/previews/psychedelic-horizons.mp3",
        "featured": True,
        "bestseller": True,
        "new": False,
        "has_stems": True,
        "contents": [
            "Full Construction Kits",
            "Individual Stems", 
            "One-Shot Samples",
            "MIDI Files",
            "Bonus Loops"
        ],
        "slug": "psychedelic-horizons",
        "view_count": 0,
        "like_count": 0,
        "purchase_count": 0,
        "is_free": False,
        "status": "published",
        "created_at": datetime.utcnow(),
        "release_date": datetime(2024, 1, 15)
    }
    
    try:
        print("🔄 Connecting to MongoDB...")
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
        # Insert the product
        print("🔄 Inserting sample product...")
        result = await db.products.insert_one(sample_product)
        
        if result.inserted_id:
            print(f"✅ Successfully inserted product with ID: {result.inserted_id}")
            print(f"📦 Product: {sample_product['title']}")
            print(f"💰 Price: ${sample_product['price']}")
            print(f"🎵 Genre: {sample_product['genre']}")
            print(f"📊 Samples: {sample_product['sample_count']}")
        else:
            print("❌ Failed to insert product")
            
    except Exception as e:
        print(f"❌ Error inserting product: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("🔌 MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(insert_sample_product())
