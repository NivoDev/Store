#!/usr/bin/env python3
"""
Script to create a test user for signup/signin testing.
Creates a user with hashed email and password matching validation rules.
"""

import asyncio
import hashlib
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

async def create_test_user():
    """Create a test user for authentication testing"""
    
    # Test user data
    email = "test@example.com"
    password = "testpassword123"
    name = "Test User"
    
    # Hash email for privacy (matching validation rules)
    email_hash = hashlib.sha256(email.lower().encode()).hexdigest()
    
    # Hash password
    password_hash = pwd_context.hash(password)
    
    # User document matching validation rules
    user_doc = {
        "email_hash": email_hash,
        "password_hash": password_hash,
        "mfa_enabled": False,
        "status": "active",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "name": name,
        "avatar_url": None,
        "bio": None,
        "liked_products": [],
        "purchased_products": [],
        "failed_login_attempts": 0,
        "account_locked_until": None,
        "password_changed_at": datetime.utcnow(),
        "last_login": None
    }
    
    try:
        print("🔄 Connecting to MongoDB...")
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email_hash": email_hash})
        if existing_user:
            print(f"⚠️  User with email {email} already exists")
            print(f"📧 Email hash: {email_hash}")
            print(f"👤 User ID: {existing_user['_id']}")
            return
        
        # Insert the user
        print("🔄 Creating test user...")
        result = await db.users.insert_one(user_doc)
        
        if result.inserted_id:
            print(f"✅ Successfully created user with ID: {result.inserted_id}")
            print(f"📧 Email: {email}")
            print(f"📧 Email hash: {email_hash}")
            print(f"👤 Name: {name}")
            print(f"🔐 Password: {password}")
            print(f"📊 Status: {user_doc['status']}")
            print("\n🧪 Test credentials:")
            print(f"   Email: {email}")
            print(f"   Password: {password}")
        else:
            print("❌ Failed to create user")
            
    except Exception as e:
        print(f"❌ Error creating user: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("🔌 MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(create_test_user())

