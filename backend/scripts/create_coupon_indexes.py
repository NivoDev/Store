#!/usr/bin/env python3
"""
MongoDB Index Creation Script for Coupon Management System
Run this script to create all necessary indexes for the coupon system.
"""

import os
import sys
from pymongo import MongoClient
from datetime import datetime

def create_coupon_indexes():
    """Create all indexes for the coupon management system."""
    
    # MongoDB connection
    MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    DB_NAME = os.getenv('MONGODB_DB_NAME', 'atomic_rose')
    
    print('🔗 Connecting to MongoDB...')
    print(f'   URI: {MONGO_URI}')
    print(f'   Database: {DB_NAME}')
    
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Test connection
        client.admin.command('ping')
        print('✅ Connected to MongoDB successfully!')
        
    except Exception as e:
        print(f'❌ Failed to connect to MongoDB: {e}')
        print('')
        print('💡 Make sure to set your MongoDB connection string:')
        print('   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"')
        print('   export MONGODB_DB_NAME="your_database_name"')
        return False
    
    print('')
    print('📊 Creating indexes for coupon management system...')
    
    try:
        # 1. Coupons Collection Indexes
        print('1. Creating indexes for coupons collection...')
        
        db.coupons.create_index(
            [("code", 1)], 
            unique=True, 
            name="coupon_code_unique"
        )
        print('   ✅ coupon_code_unique')
        
        db.coupons.create_index(
            [("is_active", 1)], 
            name="coupon_active"
        )
        print('   ✅ coupon_active')
        
        db.coupons.create_index(
            [("valid_until", 1)], 
            name="coupon_expiry"
        )
        print('   ✅ coupon_expiry')
        
        db.coupons.create_index(
            [("is_active", 1), ("valid_until", 1)], 
            name="coupon_active_expiry"
        )
        print('   ✅ coupon_active_expiry')
        
        db.coupons.create_index(
            [("created_by", 1)], 
            name="coupon_created_by"
        )
        print('   ✅ coupon_created_by')
        
        db.coupons.create_index(
            [("metadata.tags", 1)], 
            name="coupon_tags"
        )
        print('   ✅ coupon_tags')
        
        # 2. Coupon Usage Collection Indexes
        print('')
        print('2. Creating indexes for coupon_usage collection...')
        
        db.coupon_usage.create_index(
            [("coupon_id", 1), ("user_email", 1)], 
            name="coupon_user_email"
        )
        print('   ✅ coupon_user_email (prevents duplicate usage by email)')
        
        db.coupon_usage.create_index(
            [("coupon_id", 1), ("user_id", 1)], 
            name="coupon_user_id"
        )
        print('   ✅ coupon_user_id (prevents duplicate usage by user ID)')
        
        db.coupon_usage.create_index(
            [("coupon_id", 1)], 
            name="coupon_usage_coupon_id"
        )
        print('   ✅ coupon_usage_coupon_id')
        
        db.coupon_usage.create_index(
            [("user_email", 1)], 
            name="coupon_usage_user_email"
        )
        print('   ✅ coupon_usage_user_email')
        
        db.coupon_usage.create_index(
            [("user_id", 1)], 
            name="coupon_usage_user_id"
        )
        print('   ✅ coupon_usage_user_id')
        
        db.coupon_usage.create_index(
            [("order_id", 1)], 
            name="coupon_usage_order_id"
        )
        print('   ✅ coupon_usage_order_id')
        
        db.coupon_usage.create_index(
            [("used_at", 1)], 
            name="coupon_usage_date"
        )
        print('   ✅ coupon_usage_date')
        
        db.coupon_usage.create_index(
            [("status", 1)], 
            name="coupon_usage_status"
        )
        print('   ✅ coupon_usage_status')
        
        # 3. Coupon Categories Collection Indexes
        print('')
        print('3. Creating indexes for coupon_categories collection...')
        
        db.coupon_categories.create_index(
            [("name", 1)], 
            unique=True, 
            name="category_name_unique"
        )
        print('   ✅ category_name_unique')
        
        db.coupon_categories.create_index(
            [("is_active", 1)], 
            name="category_active"
        )
        print('   ✅ category_active')
        
        db.coupon_categories.create_index(
            [("sort_order", 1)], 
            name="category_sort_order"
        )
        print('   ✅ category_sort_order')
        
        print('')
        print('✅ All indexes created successfully!')
        
        # Display index summary
        print('')
        print('📋 Index Summary:')
        print('Coupons Collection:')
        print('  - code (unique) - Ensures coupon codes are unique')
        print('  - is_active - Fast filtering of active coupons')
        print('  - valid_until - Fast filtering by expiration')
        print('  - is_active + valid_until (compound) - Fast active + non-expired queries')
        print('  - created_by - Filter coupons by creator')
        print('  - metadata.tags - Filter by coupon tags')
        print('')
        print('Coupon Usage Collection:')
        print('  - coupon_id + user_email (compound) - Prevents duplicate usage by email')
        print('  - coupon_id + user_id (compound) - Prevents duplicate usage by user ID')
        print('  - coupon_id - Fast lookups by coupon')
        print('  - user_email - Fast lookups by user email')
        print('  - user_id - Fast lookups by user ID')
        print('  - order_id - Link usage to orders')
        print('  - used_at - Sort by usage date')
        print('  - status - Filter by usage status')
        print('')
        print('Coupon Categories Collection:')
        print('  - name (unique) - Ensures category names are unique')
        print('  - is_active - Filter active categories')
        print('  - sort_order - Sort categories for display')
        print('')
        print('🎯 Key Performance Benefits:')
        print('  - Compound indexes prevent duplicate coupon usage efficiently')
        print('  - Single-field indexes speed up common queries')
        print('  - Unique indexes ensure data integrity')
        print('  - All coupon validation queries will be fast')
        
        client.close()
        return True
        
    except Exception as e:
        print(f'❌ Error creating indexes: {e}')
        client.close()
        return False

if __name__ == "__main__":
    print("🚀 MongoDB Coupon Index Creation Script")
    print("=" * 50)
    
    success = create_coupon_indexes()
    
    if success:
        print("")
        print("🎉 Index creation completed successfully!")
        print("You can now proceed with implementing the coupon system.")
    else:
        print("")
        print("❌ Index creation failed. Please check your MongoDB connection.")
        sys.exit(1)
