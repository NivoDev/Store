#!/usr/bin/env python3
"""
Simple FastAPI server that works with the new MongoDB validation rules.
No Beanie ODM - just direct MongoDB queries with proper data conversion.
"""
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import hashlib
import secrets
from jose import jwt
from passlib.context import CryptContext
import boto3
from botocore.exceptions import ClientError
import time

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-this-in-production-32-characters-minimum")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Download Configuration
MAX_DOWNLOADS_PER_USER = 3  # Total downloads allowed per user

# R2 Configuration
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "atomic-rose-tools-bucket")
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "https://pub-9c5bbe78ba1841d88724531ea527bb7d.r2.dev")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# R2 Client
r2_client = None
if R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY and R2_ACCOUNT_ID:
    try:
        r2_client = boto3.client(
            's3',
            endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name='auto'
        )
        print("✅ R2 client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize R2 client: {e}")
        r2_client = None
else:
    print("⚠️  R2 credentials not found - download functionality disabled")

# Global database connection
db_client = None
db = None

app = FastAPI(
    title="Atomic Rose Tools API",
    description="Simple API for Atomic Rose Tools music store",
    version="1.0.0"
)

# Add CORS middleware - more permissive for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup"""
    global db_client, db
    try:
        print("🔄 Connecting to MongoDB...")
        db_client = AsyncIOMotorClient(MONGODB_URI)
        db = db_client.get_database()
        
        # Test connection
        await db_client.admin.command('ping')
        print("✅ Successfully connected to MongoDB")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    global db_client
    if db_client:
        db_client.close()
        print("🔌 MongoDB connection closed")

def format_product_for_frontend(product_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB product document to frontend format.
    Matches the new validation rules structure.
    """
    return {
        "id": str(product_doc.get("_id")),
        "sku": product_doc.get("sku", ""),
        "title": product_doc.get("title", ""),
        "description": product_doc.get("description", ""),
        "price": product_doc.get("price", 0),
        "original_price": product_doc.get("original_price"),
        "discount_percentage": product_doc.get("discount_percentage", 0),
        "bpm": product_doc.get("bpm"),
        "key": product_doc.get("key"),
        "genre": product_doc.get("genre", ""),
        "tags": product_doc.get("tags", []),
        "sample_count": product_doc.get("sample_count", 0),
        "total_duration": product_doc.get("total_duration"),
        "formats": product_doc.get("formats", []),
        "total_size": product_doc.get("total_size"),
        "cover_image_url": product_doc.get("cover_image_url"),
        "preview_audio_url": product_doc.get("preview_audio_url"),
        "featured": product_doc.get("featured", False),
        "bestseller": product_doc.get("bestseller", False),
        "new": product_doc.get("new", False),
        "has_stems": product_doc.get("has_stems", False),
        "contents": product_doc.get("contents", []),
        "slug": product_doc.get("slug"),
        "view_count": product_doc.get("view_count", 0),
        "like_count": product_doc.get("like_count", 0),
        "purchase_count": product_doc.get("purchase_count", 0),
        "is_free": product_doc.get("is_free", False),
        "created_at": product_doc.get("created_at").isoformat() if product_doc.get("created_at") else None,
        "release_date": product_doc.get("release_date").isoformat() if product_doc.get("release_date") else None,
        "savings": product_doc.get("original_price", 0) - product_doc.get("price", 0) if product_doc.get("original_price") and product_doc.get("original_price") > product_doc.get("price", 0) else 0
    }

def format_user_for_frontend(user_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB user document to frontend format.
    Matches the new validation rules structure.
    """
    return {
        "id": str(user_doc.get("_id")),
        "name": user_doc.get("name"),
        "avatar_url": user_doc.get("avatar_url"),
        "bio": user_doc.get("bio"),
        "mfa_enabled": user_doc.get("mfa_enabled", False),
        "status": user_doc.get("status", "active"),
        "created_at": user_doc.get("created_at").isoformat() if user_doc.get("created_at") else None,
        "last_login": user_doc.get("last_login").isoformat() if user_doc.get("last_login") else None,
        "liked_products_count": len(user_doc.get("liked_products", [])),
        "purchased_products_count": len(user_doc.get("purchased_products", []))
    }

def format_order_for_frontend(order_doc: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert MongoDB order document to frontend format.
    Matches the new validation rules structure.
    """
    return {
        "id": str(order_doc.get("_id")),
        "order_number": order_doc.get("order_number", ""),
        "user_id": order_doc.get("user_id"),
        "guest_email": order_doc.get("guest_email"),
        "items": [
            {
                "product_id": item.get("product_id"),
                "price": item.get("price", 0),
                "quantity": item.get("quantity", 1)
            }
            for item in order_doc.get("items", [])
        ],
        "total_amount": order_doc.get("total_amount", 0),
        "discount_amount": order_doc.get("discount_amount", 0),
        "status": order_doc.get("status", "pending"),
        "payment_method": order_doc.get("payment_method"),
        "payment_id": order_doc.get("payment_id"),
        "is_fulfilled": order_doc.get("is_fulfilled", False),
        "fulfillment_date": order_doc.get("fulfillment_date").isoformat() if order_doc.get("fulfillment_date") else None,
        "download_count": order_doc.get("download_count", 0),
        "last_download_at": order_doc.get("last_download_at").isoformat() if order_doc.get("last_download_at") else None,
        "discount_code": order_doc.get("discount_code"),
        "created_at": order_doc.get("created_at").isoformat() if order_doc.get("created_at") else None,
        "updated_at": order_doc.get("updated_at").isoformat() if order_doc.get("updated_at") else None,
        "can_download": (
            order_doc.get("status") == "paid" and
            order_doc.get("is_fulfilled", False) and
            order_doc.get("payment_id") is not None
        )
    }

# Authentication helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    
    to_encode.update({"exp": expire})
    try:
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return encoded_jwt
    except Exception as e:
        print(f"❌ JWT encoding error: {e}")
        raise

def verify_token(token: str):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get user from database - convert string ID to ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return format_user_for_frontend(user)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle all OPTIONS requests for CORS preflight"""
    return {"message": "OK"}

# Authentication endpoints
@app.post("/api/v1/auth/register")
async def register(user_data: dict):
    """Register a new user"""
    try:
        print(f"🔄 Registration attempt: {user_data}")
        email = user_data.get("email", "").lower().strip()
        password = user_data.get("password", "")
        name = user_data.get("name", "").strip()
        
        print(f"📧 Email: {email}, Name: {name}")
        
        # Validation
        if not email or not password or not name:
            raise HTTPException(status_code=400, detail="Email, name, and password are required")
        
        if not email or "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        if len(name) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters")
        
        # Store email directly for development/investigation
        # Check if user already exists
        existing_user = await db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Hash password
        password_hash = pwd_context.hash(password)
        
        # Create user document
        user_doc = {
            "email": email,
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
        user_id = result.inserted_id
        
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user_id)})
        
        # Format user for response
        user_response = format_user_for_frontend(user_doc)
        user_response["id"] = str(user_id)
        user_response["email"] = email
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    """Login user"""
    try:
        email = credentials.get("email", "").lower().strip()
        password = credentials.get("password", "")
        
        # Validation
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")
        
        # Find user by email
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if user is active
        if user.get("status") != "active":
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        password_hash = user.get("password_hash")
        if not password_hash or not pwd_context.verify(password, password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create JWT token
        access_token = create_access_token(data={"sub": str(user["_id"])})
        
        # Format user for response
        user_response = format_user_for_frontend(user)
        user_response["id"] = str(user["_id"])
        user_response["email"] = user.get("email", email)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during login: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.get("/api/v1/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@app.post("/api/v1/auth/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {"message": "Logged out successfully"}

@app.post("/api/v1/auth/verify")
async def verify_token_endpoint(current_user: dict = Depends(get_current_user)):
    """Verify token validity"""
    return {"valid": True, "user": current_user}

# Products endpoints
@app.get("/api/v1/products")
async def get_products(
    skip: int = 0,
    limit: int = 20,
    type: Optional[str] = None,
    featured: Optional[bool] = None,
    bestseller: Optional[bool] = None,
    new: Optional[bool] = None,
    genre: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all products with optional filtering"""
    try:
        collection = db.products
        
        # Build filter
        filter_dict = {}
        if type:
            filter_dict["type"] = type
        if featured is not None:
            filter_dict["featured"] = featured
        if bestseller is not None:
            filter_dict["bestseller"] = bestseller
        if new is not None:
            filter_dict["new"] = new
        if genre:
            filter_dict["genre"] = {"$regex": genre, "$options": "i"}
        if search:
            filter_dict["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}},
                {"tags": {"$in": [search]}}
            ]
        
        # Get products
        cursor = collection.find(filter_dict).skip(skip).limit(limit)
        products = await cursor.to_list(length=limit)
        
        # Format for frontend
        formatted_products = [format_product_for_frontend(product) for product in products]
        
        return {
            "products": formatted_products,
            "total": len(formatted_products),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get products")

@app.get("/api/v1/products/{product_id}")
async def get_product(product_id: str):
    """Get a specific product by ID"""
    try:
        from bson import ObjectId
        
        collection = db.products
        product = await collection.find_one({"_id": ObjectId(product_id)})
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return format_product_for_frontend(product)
        
    except Exception as e:
        print(f"❌ Error getting product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get product")

@app.get("/api/v1/products/featured")
async def get_featured_products():
    """Get featured products"""
    return await get_products(featured=True, limit=10)

@app.get("/api/v1/products/bestsellers")
async def get_bestseller_products():
    """Get bestseller products"""
    return await get_products(bestseller=True, limit=10)

@app.get("/api/v1/products/new")
async def get_new_products():
    """Get new products"""
    return await get_products(new=True, limit=10)

# Users endpoints
@app.get("/api/v1/users")
async def get_users(skip: int = 0, limit: int = 20):
    """Get all users (admin only)"""
    try:
        collection = db.users
        cursor = collection.find({}).skip(skip).limit(limit)
        users = await cursor.to_list(length=limit)
        
        formatted_users = [format_user_for_frontend(user) for user in users]
        
        return {
            "users": formatted_users,
            "total": len(formatted_users),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting users: {e}")
        raise HTTPException(status_code=500, detail="Failed to get users")

@app.get("/api/v1/users/{user_id}")
async def get_user(user_id: str):
    """Get a specific user by ID"""
    try:
        from bson import ObjectId
        
        collection = db.users
        user = await collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return format_user_for_frontend(user)
        
    except Exception as e:
        print(f"❌ Error getting user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user")

# Orders endpoints
@app.get("/api/v1/orders")
async def get_orders(skip: int = 0, limit: int = 20):
    """Get all orders (admin only)"""
    try:
        collection = db.orders
        cursor = collection.find({}).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        
        formatted_orders = [format_order_for_frontend(order) for order in orders]
        
        return {
            "orders": formatted_orders,
            "total": len(formatted_orders),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting orders: {e}")
        raise HTTPException(status_code=500, detail="Failed to get orders")

@app.get("/api/v1/orders/{order_id}")
async def get_order(order_id: str):
    """Get a specific order by ID"""
    try:
        from bson import ObjectId
        
        collection = db.orders
        order = await collection.find_one({"_id": ObjectId(order_id)})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return format_order_for_frontend(order)
        
    except Exception as e:
        print(f"❌ Error getting order {order_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get order")

# New collections endpoints
@app.get("/api/v1/entitlements")
async def get_entitlements(skip: int = 0, limit: int = 20):
    """Get all entitlements"""
    try:
        collection = db.entitlements
        cursor = collection.find({}).skip(skip).limit(limit)
        entitlements = await cursor.to_list(length=limit)
        
        return {
            "entitlements": entitlements,
            "total": len(entitlements),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting entitlements: {e}")
        raise HTTPException(status_code=500, detail="Failed to get entitlements")

@app.get("/api/v1/download-tokens")
async def get_download_tokens(skip: int = 0, limit: int = 20):
    """Get all download tokens"""
    try:
        collection = db.download_tokens
        cursor = collection.find({}).skip(skip).limit(limit)
        tokens = await cursor.to_list(length=limit)
        
        return {
            "tokens": tokens,
            "total": len(tokens),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting download tokens: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download tokens")

@app.get("/api/v1/download-logs")
async def get_download_logs(skip: int = 0, limit: int = 20):
    """Get all download logs"""
    try:
        collection = db.download_logs
        cursor = collection.find({}).skip(skip).limit(limit)
        logs = await cursor.to_list(length=limit)
        
        return {
            "logs": logs,
            "total": len(logs),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting download logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download logs")

@app.get("/api/v1/sessions")
async def get_sessions(skip: int = 0, limit: int = 20):
    """Get all sessions"""
    try:
        collection = db.sessions
        cursor = collection.find({}).skip(skip).limit(limit)
        sessions = await cursor.to_list(length=limit)
        
        return {
            "sessions": sessions,
            "total": len(sessions),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        print(f"❌ Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to get sessions")

# User Profile Endpoints
@app.get("/api/v1/user/liked-products")
async def get_user_liked_products(current_user: dict = Depends(get_current_user)):
    """Get user's liked products"""
    try:
        user_id = current_user["id"]
        
        # Get user's liked product IDs
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        liked_product_ids = user.get("liked_products", [])
        
        if not liked_product_ids:
            return {
                "products": [],
                "total": 0
            }
        
        # liked_product_ids are already ObjectIds, no conversion needed
        object_ids = liked_product_ids
        
        # Get products
        cursor = db.products.find({"_id": {"$in": object_ids}})
        products = await cursor.to_list(length=None)
        
        # Convert to frontend format
        formatted_products = []
        for product in products:
            formatted_product = {
                "id": str(product["_id"]),
                "sku": product.get("sku", ""),
                "title": product.get("title", ""),
                "description": product.get("description", ""),
                "price": product.get("price", 0),
                "original_price": product.get("original_price", 0),
                "discount_percentage": product.get("discount_percentage", 0),
                "bpm": product.get("bpm", ""),
                "key": product.get("key", ""),
                "genre": product.get("genre", ""),
                "tags": product.get("tags", []),
                "sample_count": product.get("sample_count", 0),
                "total_duration": product.get("total_duration", ""),
                "formats": product.get("formats", []),
                "total_size": product.get("total_size", ""),
                "cover_image_url": product.get("cover_image_url", ""),
                "preview_audio_url": product.get("preview_audio_url", ""),
                "featured": product.get("featured", False),
                "bestseller": product.get("bestseller", False),
                "new": product.get("new", False),
                "has_stems": product.get("has_stems", False),
                "contents": product.get("contents", []),
                "slug": product.get("slug", ""),
                "view_count": product.get("view_count", 0),
                "like_count": product.get("like_count", 0),
                "purchase_count": product.get("purchase_count", 0),
                "is_free": product.get("is_free", False),
                "created_at": product.get("created_at", ""),
                "release_date": product.get("release_date", ""),
                "savings": product.get("savings", 0),
                "status": product.get("status", ""),
                "type": product.get("type", "")
            }
            formatted_products.append(formatted_product)
        
        return {
            "products": formatted_products,
            "total": len(formatted_products)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting liked products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get liked products")

@app.get("/api/v1/user/purchased-products")
async def get_user_purchased_products(current_user: dict = Depends(get_current_user)):
    """Get user's purchased products"""
    try:
        user_id = current_user["id"]
        
        # Get user's purchased product IDs
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        purchased_product_ids = user.get("purchased_products", [])
        
        if not purchased_product_ids:
            return {
                "products": [],
                "total": 0
            }
        
        # Convert string IDs to ObjectIds
        object_ids = [ObjectId(pid) for pid in purchased_product_ids]
        
        # Get products
        cursor = db.products.find({"_id": {"$in": object_ids}})
        products = await cursor.to_list(length=None)
        
        # Convert to frontend format
        formatted_products = []
        for product in products:
            formatted_product = {
                "id": str(product["_id"]),
                "sku": product.get("sku", ""),
                "title": product.get("title", ""),
                "description": product.get("description", ""),
                "price": product.get("price", 0),
                "original_price": product.get("original_price", 0),
                "discount_percentage": product.get("discount_percentage", 0),
                "bpm": product.get("bpm", ""),
                "key": product.get("key", ""),
                "genre": product.get("genre", ""),
                "tags": product.get("tags", []),
                "sample_count": product.get("sample_count", 0),
                "total_duration": product.get("total_duration", ""),
                "formats": product.get("formats", []),
                "total_size": product.get("total_size", ""),
                "cover_image_url": product.get("cover_image_url", ""),
                "preview_audio_url": product.get("preview_audio_url", ""),
                "featured": product.get("featured", False),
                "bestseller": product.get("bestseller", False),
                "new": product.get("new", False),
                "has_stems": product.get("has_stems", False),
                "contents": product.get("contents", []),
                "slug": product.get("slug", ""),
                "view_count": product.get("view_count", 0),
                "like_count": product.get("like_count", 0),
                "purchase_count": product.get("purchase_count", 0),
                "is_free": product.get("is_free", False),
                "created_at": product.get("created_at", ""),
                "release_date": product.get("release_date", ""),
                "savings": product.get("savings", 0),
                "status": product.get("status", ""),
                "type": product.get("type", "")
            }
            formatted_products.append(formatted_product)
        
        return {
            "products": formatted_products,
            "total": len(formatted_products)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting purchased products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get purchased products")

@app.post("/api/v1/user/like-product/{product_id}")
async def like_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """Like or unlike a product (toggle)"""
    try:
        user_id = current_user["id"]
        
        # Validate product exists
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if product is already liked
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        liked_products = user.get("liked_products", [])
        product_object_id = ObjectId(product_id)
        
        if product_object_id in liked_products:
            # Unlike the product
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"liked_products": product_object_id}}
            )
            
            # Decrement product like count
            await db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$inc": {"like_count": -1}}
            )
            
            return {"message": "Product unliked successfully", "liked": False}
        else:
            # Like the product
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"liked_products": product_object_id}}
            )
            
            # Increment product like count
            await db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$inc": {"like_count": 1}}
            )
            
            return {"message": "Product liked successfully", "liked": True}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error toggling like: {e}")
        raise HTTPException(status_code=500, detail="Failed to toggle like")

@app.delete("/api/v1/user/like-product/{product_id}")
async def unlike_product(product_id: str, current_user: dict = Depends(get_current_user)):
    """Unlike a product"""
    try:
        user_id = current_user["id"]
        
        # Remove from user's liked products (remove as ObjectId)
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"liked_products": ObjectId(product_id)}}
        )
        
        if result.modified_count == 0:
            return {"message": "Product was not liked"}
        
        # Decrement product like count
        await db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$inc": {"like_count": -1}}
        )
        
        return {"message": "Product unliked successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error unliking product: {e}")
        raise HTTPException(status_code=500, detail="Failed to unlike product")

@app.put("/api/v1/user/change-password")
async def change_password(password_data: dict, current_user: dict = Depends(get_current_user)):
    """Change user password"""
    try:
        user_id = current_user["id"]
        old_password = password_data.get("old_password")
        new_password = password_data.get("new_password")
        
        if not old_password or not new_password:
            raise HTTPException(status_code=400, detail="Old password and new password are required")
        
        if len(new_password) < 6:
            raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
        
        # Get user and verify old password
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify old password
        if not pwd_context.verify(old_password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Invalid old password")
        
        # Hash new password
        new_password_hash = pwd_context.hash(new_password)
        
        # Update password
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "password_hash": new_password_hash,
                    "password_changed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error changing password: {e}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@app.delete("/api/v1/user/delete-account")
async def delete_account(current_user: dict = Depends(get_current_user)):
    """Delete (deactivate) user account"""
    try:
        user_id = current_user["id"]
        
        # Update user status to "deleted" instead of actually deleting
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "status": "deleted",
                    "updated_at": datetime.utcnow(),
                    "deleted_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Account deactivated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting account: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete account")

# Download endpoints
def generate_download_url(object_key: str, expiration: int = 3600) -> str:
    """Generate a presigned URL for R2 download"""
    if not r2_client:
        raise HTTPException(status_code=500, detail="R2 not configured")
    
    try:
        response = r2_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': R2_BUCKET_NAME, 'Key': object_key},
            ExpiresIn=expiration
        )
        return response
    except ClientError as e:
        print(f"❌ Error generating download URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")

async def check_user_downloads(user_id: str) -> dict:
    """Check user's download count and remaining downloads"""
    try:
        user_object_id = ObjectId(user_id)
        
        # Count total downloads for this user
        total_downloads = await db.download_events.count_documents({
            "user_id": user_object_id
        })
        
        downloads_remaining = MAX_DOWNLOADS_PER_USER - total_downloads
        
        return {
            "total_downloads": total_downloads,
            "downloads_remaining": max(0, downloads_remaining),
            "can_download": downloads_remaining > 0
        }
        
    except Exception as e:
        print(f"❌ Error checking user downloads: {e}")
        return {
            "total_downloads": 0,
            "downloads_remaining": MAX_DOWNLOADS_PER_USER,
            "can_download": True
        }

@app.get("/api/v1/download/{product_id}")
async def get_download_url(product_id: str, current_user: dict = Depends(get_current_user)):
    """Get download URL for a purchased product"""
    try:
        print(f"🔍 Download request for product: {product_id}")
        user_id = current_user["id"]
        
        # Check if user has purchased this product
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        purchased_products = user.get("purchased_products", [])
        print(f"📦 User's purchased products: {purchased_products}")
        
        if ObjectId(product_id) not in purchased_products:
            raise HTTPException(status_code=403, detail="Product not purchased")
        
        # Check download limit
        download_info = await check_user_downloads(user_id)
        if not download_info["can_download"]:
            print(f"🚫 Download limit reached: {download_info['total_downloads']}/{MAX_DOWNLOADS_PER_USER}")
            raise HTTPException(
                status_code=429, 
                detail={
                    "message": f"You have reached the maximum download limit ({MAX_DOWNLOADS_PER_USER} downloads total)",
                    "total_downloads": download_info["total_downloads"],
                    "downloads_remaining": 0
                }
            )
        
        print(f"✅ Download check passed: {download_info['downloads_remaining']} downloads remaining")
        
        # Get product details
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        print(f"📋 Product found: {product.get('title')}")
        print(f"📁 File path: {product.get('file_path')}")
        
        # Generate download URL (assuming product has a file_path field)
        file_path = product.get("file_path", f"products/{product_id}.zip")
        print(f"🔗 Generating download URL for: {file_path}")
        
        download_url = generate_download_url(file_path)
        print(f"✅ Download URL generated successfully")
        
        # Log download event
        download_event = {
            "user_id": ObjectId(user_id),
            "product_id": ObjectId(product_id),
            "download_url": download_url,
            "ip_address": "127.0.0.1",  # In production, get from request
            "user_agent": "Atomic Rose Tools App",
            "created_at": datetime.utcnow()
        }
        
        await db.download_events.insert_one(download_event)
        print(f"📝 Download event logged")
        
        # Get updated download info after logging
        updated_download_info = await check_user_downloads(user_id)
        
        return {
            "download_url": download_url,
            "expires_in": 3600,
            "product_title": product.get("title", "Unknown Product"),
            "download_info": {
                "total_downloads": updated_download_info["total_downloads"],
                "downloads_remaining": updated_download_info["downloads_remaining"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting download URL: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to get download URL")

@app.get("/api/v1/user/download-info")
async def get_user_download_info(current_user: dict = Depends(get_current_user)):
    """Get user's download count and remaining downloads"""
    try:
        user_id = current_user["id"]
        download_info = await check_user_downloads(user_id)
        
        return {
            "total_downloads": download_info["total_downloads"],
            "downloads_remaining": download_info["downloads_remaining"],
            "max_downloads": MAX_DOWNLOADS_PER_USER,
            "can_download": download_info["can_download"]
        }
        
    except Exception as e:
        print(f"❌ Error getting download info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download info")

@app.get("/api/v1/user/download-history")
async def get_download_history(current_user: dict = Depends(get_current_user)):
    """Get user's download history"""
    try:
        user_id = current_user["id"]
        
        # Get download events
        cursor = db.download_events.find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
        events = await cursor.to_list(length=50)  # Last 50 downloads
        
        # Get product details for each download
        download_history = []
        for event in events:
            product = await db.products.find_one({"_id": event["product_id"]})
            if product:
                download_history.append({
                    "id": str(event["_id"]),
                    "product_id": str(event["product_id"]),
                    "product_title": product.get("title", "Unknown Product"),
                    "download_url": event.get("download_url"),
                    "downloaded_at": event["created_at"].isoformat(),
                    "ip_address": event.get("ip_address", "Unknown")
                })
        
        return {
            "downloads": download_history,
            "total": len(download_history)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting download history: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download history")

# Purchase endpoint
@app.post("/api/v1/orders/purchase")
async def purchase_product(order_data: dict, current_user: dict = Depends(get_current_user)):
    """Purchase a product (mock purchase for now)"""
    try:
        user_id = current_user["id"]
        product_id = order_data.get("product_id")
        
        if not product_id:
            raise HTTPException(status_code=400, detail="Product ID is required")
        
        # Get product details from database
        try:
            product = await db.products.find_one({"_id": ObjectId(product_id)})
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            product_object_id = ObjectId(product_id)
        except Exception as e:
            print(f"❌ Error processing purchase: {e}")
            raise HTTPException(status_code=400, detail="Invalid product ID format")
        
        # Add product to user's purchased products
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"purchased_products": product_object_id}}
        )
        
        # Create order record
        order = {
            "user_id": ObjectId(user_id),
            "order_number": f"ORD-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "items": [{
                "product_id": product_object_id,
                "quantity": 1,
                "price": product.get("price", 0)
            }],
            "total_amount": product.get("price", 0),
            "status": "completed",
            "payment_method": "mock",
            "payment_id": f"mock_{datetime.utcnow().timestamp()}",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.orders.insert_one(order)
        
        return {
            "message": "Purchase successful",
            "order_number": order["order_number"],
            "product_title": product.get("title", "Unknown Product")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing purchase: {e}")
        raise HTTPException(status_code=500, detail="Failed to process purchase")

# Guest checkout endpoints
@app.post("/api/v1/guest/checkout")
async def guest_checkout(checkout_data: dict):
    """Process guest checkout with email verification"""
    try:
        email = checkout_data.get("email")
        items = checkout_data.get("items", [])
        
        if not email or not items:
            raise HTTPException(status_code=400, detail="Email and items are required")
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Generate verification token and OTP code
        verification_token = secrets.token_urlsafe(32)
        otp_code = ''.join(secrets.choice('0123456789') for _ in range(6))
        
        # Create guest order
        order = {
            "order_number": f"GUEST-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "guest_email": email,
            "items": items,
            "total_amount": sum(item["price"] * item["quantity"] for item in items),
            "status": "pending_verification",
            "verification_token": verification_token,
            "otp_code": otp_code,
            "verification_expires": datetime.utcnow() + timedelta(hours=24),  # 24 hour expiry
            "downloads_remaining": 1,  # 1 download per guest order
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Save to database
        result = await db.guest_orders.insert_one(order)
        order_id = result.inserted_id
        
        # Send verification email
        try:
            from services.email_service import email_service
            email_sent = email_service.send_guest_verification_email(
                email=email,
                order_number=order["order_number"],
                verification_token=verification_token,
                otp_code=otp_code,
                items=items,
                total_amount=order["total_amount"]
            )
            if not email_sent:
                print(f"⚠️ Warning: Failed to send guest verification email to {email}")
        except Exception as e:
            print(f"⚠️ Warning: Error sending guest verification email to {email}: {e}")
        
        print(f"📧 Guest checkout created: {order['order_number']}")
        print(f"🔗 Verification token: {verification_token}")
        print(f"📧 Email: {email}")
        
        return {
            "order_id": str(order_id),
            "order_number": order["order_number"],
            "verification_token": verification_token,
            "message": "Please check your email to verify your email address before completing checkout"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing guest checkout: {e}")
        raise HTTPException(status_code=500, detail="Failed to process checkout")

@app.post("/api/v1/guest/verify-otp")
async def verify_guest_otp(verification_data: dict):
    """Verify guest OTP code"""
    try:
        otp_code = verification_data.get("otp_code", "").strip()
        email = verification_data.get("email", "").strip()
        
        if not otp_code or not email:
            raise HTTPException(status_code=400, detail="OTP code and email are required")
        
        # Find the pending order by email and OTP code
        order = await db.guest_orders.find_one({
            "guest_email": email.lower(),
            "otp_code": otp_code,
            "status": "pending_verification",
            "verification_expires": {"$gt": datetime.utcnow()}
        })
        
        if not order:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP code")
        
        # Update order status to email verified (but still pending checkout)
        await db.guest_orders.update_one(
            {"_id": order["_id"]},
            {
                "$set": {
                    "email_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        print(f"✅ Guest OTP verified for order: {order['order_number']}")
        return {
            "message": "OTP verified successfully",
            "order_id": str(order["_id"]),
            "order_number": order["order_number"],
            "verification_token": order["verification_token"],
            "verified": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying guest OTP: {e}")
        raise HTTPException(status_code=500, detail="OTP verification failed")

@app.post("/api/v1/guest/verify-email")
async def verify_guest_email(verification_data: dict):
    """Verify guest email before completing checkout"""
    try:
        verification_token = verification_data.get("verification_token")
        
        if not verification_token:
            raise HTTPException(status_code=400, detail="Verification token is required")
        
        # Find the pending order by verification token
        order = await db.guest_orders.find_one({
            "verification_token": verification_token,
            "status": "pending_verification",
            "verification_expires": {"$gt": datetime.utcnow()}
        })
        
        if not order:
            raise HTTPException(status_code=400, detail="Invalid or expired verification token")
        
        # Update order status to email verified (but still pending checkout)
        await db.guest_orders.update_one(
            {"_id": order["_id"]},
            {
                "$set": {
                    "email_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        print(f"✅ Guest email verified for order: {order['order_number']}")
        return {
            "message": "Email verified successfully",
            "order_id": str(order["_id"]),
            "order_number": order["order_number"],
            "verified": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying guest email: {e}")
        raise HTTPException(status_code=500, detail="Email verification failed")

@app.post("/api/v1/guest/verify")
async def verify_guest_order(verification_data: dict):
    """Verify guest order and complete purchase"""
    try:
        verification_token = verification_data.get("verification_token")
        
        if not verification_token:
            raise HTTPException(status_code=400, detail="Verification token is required")
        
        # Find the order by verification token
        order = await db.guest_orders.find_one({
            "verification_token": verification_token,
            "status": "pending_verification",
            "verification_expires": {"$gt": datetime.utcnow()}
        })
        
        if not order:
            raise HTTPException(status_code=400, detail="Invalid or expired verification token")
        
        # Check if email is verified first
        if not order.get("email_verified", False):
            raise HTTPException(status_code=400, detail="Please verify your email first before completing checkout")
        
        # Update order status
        await db.guest_orders.update_one(
            {"_id": order["_id"]},
            {
                "$set": {
                    "status": "completed",
                    "verified_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Generate one-time download links for immediate download
        immediate_download_links = []
        for item in order["items"]:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                file_path = product.get("file_path", f"products/{item['product_id']}.zip")
                # Generate one-time download URL (1 hour expiry)
                download_url = generate_download_url(file_path, expiration=3600)
                
                immediate_download_links.append({
                    "product_title": product.get("title", "Unknown Product"),
                    "download_url": download_url,
                    "expires_in": 3600,
                    "type": "immediate"
                })
        
        # TODO: Prepare email download links (1 total download for guests)
        # For now, we'll just log that email would be sent
        email_download_links = []
        for item in order["items"]:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                # Generate 1 download link for email (24 hour expiry)
                file_path = product.get("file_path", f"products/{item['product_id']}.zip")
                download_url = generate_download_url(file_path, expiration=86400)  # 24 hours
                
                email_download_links.append({
                    "product_title": product.get("title", "Unknown Product"),
                    "download_url": download_url,
                    "expires_in": 86400,
                    "type": "email"
                })
        
        # TODO: Send email with download links
        print(f"✅ Guest order verified: {order['order_number']}")
        print(f"📧 Would send {len(email_download_links)} download link to: {order['guest_email']}")
        print(f"🔗 Immediate download links: {len(immediate_download_links)}")
        
        return {
            "order_number": order["order_number"],
            "download_links": immediate_download_links,  # One-time immediate downloads
            "downloads_remaining": order["downloads_remaining"],
            "message": "Purchase verified! Download your file below. Sign in for 3 downloads and more benefits!"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying guest order: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify order")

@app.get("/api/v1/guest/download/{order_id}")
async def get_guest_download(order_id: str, verification_token: str):
    """Get download link for guest order (with rate limiting)"""
    try:
        # Find the order
        order = await db.guest_orders.find_one({
            "_id": ObjectId(order_id),
            "verification_token": verification_token,
            "status": "completed"
        })
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found or not verified")
        
        # Check download limit
        if order["downloads_remaining"] <= 0:
            raise HTTPException(status_code=429, detail="Download limit reached for this order")
        
        # Get product details
        product_id = order["items"][0]["product_id"]  # For now, just first item
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Generate download URL
        file_path = product.get("file_path", f"products/{product_id}.zip")
        download_url = generate_download_url(file_path)
        
        # Update download count
        await db.guest_orders.update_one(
            {"_id": order["_id"]},
            {
                "$inc": {"downloads_remaining": -1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return {
            "download_url": download_url,
            "expires_in": 3600,
            "product_title": product.get("title", "Unknown Product"),
            "downloads_remaining": order["downloads_remaining"] - 1
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting guest download: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)