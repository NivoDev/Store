#!/usr/bin/env python3
"""
Create ATOMIC-ROSE newsletter coupon for newsletter subscribers
"""

import os
import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId

def create_newsletter_coupon():
    """Create ATOMIC-ROSE coupon for newsletter subscribers"""
    
    # MongoDB connection
    mongodb_uri = os.getenv('MONGODB_URI')
    db_name = os.getenv('MONGODB_DB_NAME', 'atomic_rose')
    
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        return False
    
    try:
        client = MongoClient(mongodb_uri)
        db = client[db_name]
        
        # Test connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
        # Newsletter coupon data
        newsletter_coupon = {
            "code": "ATOMIC-ROSE",
            "name": "Newsletter Welcome Discount",
            "description": "10% off for newsletter subscribers - Welcome to Atomic Rose Tools!",
            "type": "percentage",
            "value": 10,
            "min_order_amount": 0,
            "max_discount": 50,
            "usage_limit": 0,  # Unlimited uses
            "usage_count": 0,
            "user_limit": 1,   # Each user once
            "valid_from": datetime.utcnow(),
            "valid_until": datetime(2025, 12, 31),  # 1 year validity
            "is_active": True,
            "applicable_products": [],
            "excluded_products": [],
            "applicable_categories": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "created_by": ObjectId(),  # System created - use empty ObjectId
            "metadata": {
                "tags": ["newsletter", "welcome", "10-percent", "atomic-rose"],
                "priority": 5,
                "stackable": False,
                "auto_apply": False,
                "source": "newsletter"
            }
        }
        
        # Check if coupon already exists
        existing = db.coupons.find_one({"code": "ATOMIC-ROSE"})
        if existing:
            print("ℹ️ Newsletter coupon ATOMIC-ROSE already exists")
            print(f"   Created: {existing['created_at']}")
            print(f"   Active: {existing['is_active']}")
            print(f"   Usage Count: {existing['usage_count']}")
        else:
            # Insert new coupon
            result = db.coupons.insert_one(newsletter_coupon)
            print(f"✅ Newsletter coupon ATOMIC-ROSE created with ID: {result.inserted_id}")
            print(f"   Code: {newsletter_coupon['code']}")
            print(f"   Discount: {newsletter_coupon['value']}%")
            print(f"   Max Discount: ${newsletter_coupon['max_discount']}")
            print(f"   Valid Until: {newsletter_coupon['valid_until']}")
        
        # Create coupon category if it doesn't exist
        category = db.coupon_categories.find_one({"name": "Newsletter"})
        if not category:
            newsletter_category = {
                "name": "Newsletter",
                "description": "Newsletter subscriber coupons",
                "color": "#0ea5e9",
                "is_active": True,
                "sort_order": 1,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "created_by": ObjectId()
            }
            db.coupon_categories.insert_one(newsletter_category)
            print("✅ Newsletter category created")
        else:
            print("ℹ️ Newsletter category already exists")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating newsletter coupon: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    print("🎫 Creating ATOMIC-ROSE newsletter coupon...")
    success = create_newsletter_coupon()
    if success:
        print("✅ Newsletter coupon setup completed successfully!")
    else:
        print("❌ Failed to create newsletter coupon")
        sys.exit(1)
