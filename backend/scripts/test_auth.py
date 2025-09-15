#!/usr/bin/env python3
"""
Script to test user authentication (signup/signin).
Tests the authentication flow with the created test user.
"""

import asyncio
import hashlib
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

async def test_signin(email, password):
    """Test user signin by checking credentials in database"""
    
    try:
        print(f"🔄 Testing signin for: {email}")
        
        # Hash email for lookup
        email_hash = hashlib.sha256(email.lower().encode()).hexdigest()
        
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
        # Find user by email hash
        user = await db.users.find_one({"email_hash": email_hash})
        
        if not user:
            print(f"❌ User not found for email: {email}")
            return False
        
        print(f"✅ User found: {user.get('name', 'Unknown')}")
        print(f"📊 Status: {user.get('status', 'Unknown')}")
        
        # Check if user is active
        if user.get('status') != 'active':
            print(f"❌ User account is not active: {user.get('status')}")
            return False
        
        # Verify password
        password_hash = user.get('password_hash')
        if not password_hash:
            print("❌ No password hash found")
            return False
        
        password_valid = pwd_context.verify(password, password_hash)
        
        if password_valid:
            print("✅ Password is valid - Signin successful!")
            print(f"👤 User ID: {user['_id']}")
            print(f"📧 Email hash: {email_hash}")
            return True
        else:
            print("❌ Invalid password - Signin failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error during signin test: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("🔌 MongoDB connection closed")

async def test_signup(email, password, name):
    """Test user signup by creating a new user"""
    
    try:
        print(f"🔄 Testing signup for: {email}")
        
        # Hash email for privacy
        email_hash = hashlib.sha256(email.lower().encode()).hexdigest()
        
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.atomic_rose
        
        # Test connection
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email_hash": email_hash})
        if existing_user:
            print(f"⚠️  User already exists: {email}")
            return False
        
        # Hash password
        password_hash = pwd_context.hash(password)
        
        # Create user document
        from datetime import datetime
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
        
        # Insert user
        result = await db.users.insert_one(user_doc)
        
        if result.inserted_id:
            print(f"✅ Signup successful! User ID: {result.inserted_id}")
            print(f"👤 Name: {name}")
            print(f"📧 Email: {email}")
            print(f"📧 Email hash: {email_hash}")
            return True
        else:
            print("❌ Signup failed - could not create user")
            return False
            
    except Exception as e:
        print(f"❌ Error during signup test: {e}")
        return False
    finally:
        if 'client' in locals():
            client.close()
            print("🔌 MongoDB connection closed")

async def main():
    """Run authentication tests"""
    print("🧪 Testing Authentication System")
    print("=" * 50)
    
    # Test 1: Signin with existing test user
    print("\n1️⃣ Testing Signin with existing user:")
    signin_success = await test_signin("test@example.com", "testpassword123")
    
    # Test 2: Signin with wrong password
    print("\n2️⃣ Testing Signin with wrong password:")
    wrong_password = await test_signin("test@example.com", "wrongpassword")
    
    # Test 3: Signin with non-existent user
    print("\n3️⃣ Testing Signin with non-existent user:")
    non_existent = await test_signin("nonexistent@example.com", "password")
    
    # Test 4: Signup with new user
    print("\n4️⃣ Testing Signup with new user:")
    signup_success = await test_signup("newuser@example.com", "newpassword123", "New User")
    
    # Test 5: Signin with newly created user
    if signup_success:
        print("\n5️⃣ Testing Signin with newly created user:")
        new_user_signin = await test_signin("newuser@example.com", "newpassword123")
    
    print("\n" + "=" * 50)
    print("🏁 Authentication tests completed!")

if __name__ == "__main__":
    asyncio.run(main())

