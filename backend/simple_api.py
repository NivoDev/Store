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
from botocore.config import Config
from urllib.parse import urlparse, unquote
import time

# Load environment variables
load_dotenv()

# Database connection status (defined early)
mongodb_connected = False

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not found in environment variables")

# Database connection check function
async def check_mongodb_connection():
    """Check if MongoDB is connected"""
    global mongodb_connected
    try:
        # Try to ping the database
        await db.admin.command('ping')
        mongodb_connected = True
        print("✅ MongoDB connection successful")
        return True
    except Exception as e:
        mongodb_connected = False
        print(f"❌ MongoDB connection failed: {e}")
        return False

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
            "s3",
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY_ID,
            aws_secret_access_key=R2_SECRET_ACCESS_KEY,
            region_name="auto",
            config=Config(
                signature_version="s3v4",
                s3={"addressing_style": "path"},
                retries={"max_attempts": 3, "mode": "standard"},
            ),
        )
        print("✅ R2 client initialized successfully (s3v4, path-style)")
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
    global db_client, db, mongodb_connected
    try:
        print("🔄 Connecting to MongoDB...")
        db_client = AsyncIOMotorClient(MONGODB_URI)
        db = db_client.get_database()
        
        # Test connection
        await db_client.admin.command('ping')
        mongodb_connected = True
        print("✅ Successfully connected to MongoDB")
        
    except Exception as e:
        mongodb_connected = False
        print(f"❌ Failed to connect to MongoDB: {e}")
        # Don't raise - let the app start without database

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
    # Convert ObjectId to string for liked_products
    liked_products = user_doc.get("liked_products", [])
    liked_products_str = [str(product_id) for product_id in liked_products]
    
    return {
        "id": str(user_doc.get("_id")),
        "name": user_doc.get("name"),
        "email": user_doc.get("email"),
        "avatar_url": user_doc.get("avatar_url"),
        "bio": user_doc.get("bio"),
        "mfa_enabled": user_doc.get("mfa_enabled", False),
        "status": user_doc.get("status", "active"),
        "created_at": user_doc.get("created_at").isoformat() if user_doc.get("created_at") else None,
        "last_login": user_doc.get("last_login").isoformat() if user_doc.get("last_login") else None,
        "liked_products": liked_products_str,
        "liked_products_count": len(liked_products),
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

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Atomic Rose Tools API", "status": "running", "timestamp": datetime.utcnow().isoformat()}

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/v1/test-email")
async def test_email(test_data: dict):
    """Test email sending endpoint"""
    try:
        email = test_data.get("email", "nivroz93@gmail.com")
        
        # Test Resend API
        from services.email_service import email_service
        
        # Send a simple test email
        test_sent = email_service.send_guest_verification_email(
            email=email,
            order_number="TEST-123456",
            verification_token="test-token",
            otp_code="123456",
            items=[{"title": "Test Product", "price": 9.99}],
            total_amount=9.99
        )
        
        return {
            "message": "Test email sent",
            "email": email,
            "sent": test_sent,
            "resend_api_key_set": bool(os.getenv("RESEND_API_KEY")),
            "from_email": os.getenv("FROM_EMAIL")
        }
        
    except Exception as e:
        print(f"❌ Test email error: {e}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        return {
            "message": "Test email failed",
            "error": str(e),
            "resend_api_key_set": bool(os.getenv("RESEND_API_KEY")),
            "from_email": os.getenv("FROM_EMAIL")
        }

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
        if "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        if len(password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        if len(name) < 2:
            raise HTTPException(status_code=400, detail="Name must be at least 2 characters")

        # Existing user?
        existing_user = await db.users.find_one({"email": email})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        # Hash password
        password_hash = pwd_context.hash(password)

        # Generate verification materials
        verification_token = secrets.token_urlsafe(32)
        otp_code = ''.join(secrets.choice('0123456789') for _ in range(6))

        # Insert user — keep status valid for schema; gate access with email_verified
        user_doc = {
            "email": email,
            "password_hash": password_hash,
            "mfa_enabled": False,
            "status": "active",                  # ✅ stays valid per enum
            "email_verified": False,             # ⛔ blocks login until verified
            "verification_token": verification_token,
            "verification_expires": datetime.utcnow() + timedelta(hours=24),
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

        result = await db.users.insert_one(user_doc)

        # Send verification email (best-effort)
        try:
            from services.email_service import email_service
            email_sent = email_service.send_user_verification_email(
                email=email,
                name=name,
                verification_token=verification_token,
                otp_code=otp_code
            )
            print(f"📧 User verification email sent: {email_sent}")
        except Exception as e:
            print(f"⚠️ Warning: Error sending user verification email to {email}: {e}")
            import traceback; traceback.print_exc()
            email_sent = False

        return {
            "message": "Registration successful! Please check your email to verify your account.",
            "email": email,
            "verification_required": True,
            "email_sent": email_sent
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail="Registration failed")

@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    """Login user (Option A: gate by email_verified, status can remain 'active')."""
    try:
        email = credentials.get("email", "").lower().strip()
        password = credentials.get("password", "")

        # Basic validation
        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")

        # Find user
        user = await db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Block if account not usable
        status_val = user.get("status", "active")
        if status_val == "suspended":
            raise HTTPException(status_code=403, detail="Your account is suspended")
        if status_val == "deleted":
            raise HTTPException(status_code=403, detail="This account has been deleted")

        # Require verified email (core of Option A)
        if not user.get("email_verified", False):
            raise HTTPException(
                status_code=403,
                detail="Please verify your email before logging in. Check your inbox for a verification code."
            )

        # Verify password
        password_hash = user.get("password_hash")
        if not password_hash or not pwd_context.verify(password, password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )

        # Issue token
        access_token = create_access_token(data={"sub": str(user["_id"])})

        # Prepare user payload
        user_response = format_user_for_frontend(user)
        user_response["id"] = str(user["_id"])
        user_response["email"] = user.get("email", email)
        user_response["email_verified"] = True
        user_response["status"] = status_val

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

@app.get("/api/v1/auth/verify-email-token/{verification_token}")
async def verify_user_email_token(verification_token: str):
    """Verify user email with token from email link"""
    try:
        if not verification_token:
            raise HTTPException(status_code=400, detail="Verification token is required")
        
        # Find user with this verification token
        user = await db.users.find_one({
            "verification_token": verification_token,
            "email_verified": False,
            "status": "active"
        })
        
        if not user:
            # Check if user is already verified
            already_verified = await db.users.find_one({
                "verification_token": verification_token,
                "email_verified": True
            })
            
            if already_verified:
                return {
                    "message": "Email already verified! You can now log in to your account.",
                    "already_verified": True,
                    "user": format_user_for_frontend(already_verified)
                }
            else:
                raise HTTPException(status_code=400, detail="Invalid or expired verification token")
        
        # Check if verification token has expired
        if user.get("verification_expires") and user["verification_expires"] < datetime.utcnow():
            # Token has expired, delete the user record to allow re-registration
            await db.users.delete_one({"_id": user["_id"]})
            raise HTTPException(
                status_code=410, 
                detail="Verification token has expired. Please register again with the same email address."
            )
        
        # Mark user as verified
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "email_verified": True,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "verification_token": "",
                    "verification_expires": ""
                }
            }
        )
        
        # Issue token
        access_token = create_access_token(data={"sub": str(user["_id"])})
        user_response = format_user_for_frontend(user)
        user_response.update({
            "id": str(user["_id"]),
            "email": user.get("email"),
            "status": "active",
            "email_verified": True
        })
        
        return {
            "message": "Email verified successfully! You can now log in to your account.",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response,
            "verified": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying user email token: {e}")
        raise HTTPException(status_code=500, detail="Email verification failed")

@app.post("/api/v1/auth/verify-email")
async def verify_user_email(verification_data: dict):
    """Verify user email with OTP code"""
    try:
        otp_code = verification_data.get("otp_code", "").strip()
        email = verification_data.get("email", "").strip()

        if not otp_code or not email:
            raise HTTPException(status_code=400, detail="OTP code and email are required")
        if len(otp_code) != 6 or not otp_code.isdigit():
            raise HTTPException(status_code=400, detail="Invalid OTP format")

        # Find unverified user (check both valid and expired tokens)
        user = await db.users.find_one({
            "email": email.lower(),
            "email_verified": False,
            "status": "active"
        })
        if not user:
            raise HTTPException(status_code=400, detail="No pending verification found for this email")
        
        # Check if verification token has expired
        if user.get("verification_expires") and user["verification_expires"] < datetime.utcnow():
            # Token has expired, delete the user record to allow re-registration
            await db.users.delete_one({"_id": user["_id"]})
            raise HTTPException(
                status_code=410, 
                detail="Verification token has expired. Please register again with the same email address."
            )

        # Mark verified
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "email_verified": True,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "verification_token": "",
                    "verification_expires": ""
                }
            }
        )

        # Issue token
        access_token = create_access_token(data={"sub": str(user["_id"])})
        user_response = format_user_for_frontend(user)
        user_response.update({
            "id": str(user["_id"]),
            "email": user.get("email"),
            "status": "active",
            "email_verified": True
        })

        return {
            "message": "Email verified successfully! You can now log in.",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response,
            "verified": True
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying user email: {e}")
        raise HTTPException(status_code=500, detail="Email verification failed")

@app.post("/api/v1/auth/resend-verification")
async def resend_user_verification(resend_data: dict):
    """Resend verification email for user"""
    try:
        email = resend_data.get("email", "").strip()
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")

        user = await db.users.find_one({
            "email": email.lower(),
            "status": "active",
            "email_verified": False
        })
        if not user:
            raise HTTPException(status_code=404, detail="No pending verification found for this email")

        verification_token = secrets.token_urlsafe(32)
        otp_code = ''.join(secrets.choice('0123456789') for _ in range(6))

        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "verification_token": verification_token,
                    "verification_expires": datetime.utcnow() + timedelta(hours=24),
                    "updated_at": datetime.utcnow()
                }
            }
        )

        try:
            from services.email_service import email_service
            email_sent = email_service.send_user_verification_email(
                email=email,
                name=user.get("name", ""),
                verification_token=verification_token,
                otp_code=otp_code
            )
            print(f"📧 User verification email resent: {email_sent}")
        except Exception as e:
            print(f"⚠️ Warning: Error resending user verification email to {email}: {e}")
            email_sent = False

        return {
            "message": "Verification email sent successfully",
            "email": email,
            "email_sent": email_sent,
            "otp_code": otp_code  # (testing only)
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error resending user verification: {e}")
        raise HTTPException(status_code=500, detail="Failed to resend verification email")

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
    global mongodb_connected
    try:
        # Check if database is connected
        if not mongodb_connected:
            print("❌ Database not connected, returning empty products")
            return {
                "products": [],
                "total": 0,
                "skip": skip,
                "limit": limit,
                "message": "Database temporarily unavailable"
            }
        
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
        print(f"❌ Error type: {type(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to get products: {str(e)}")

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

# ---------- R2 PRESIGN HELPERS ----------

def _normalize_r2_key(raw_key: str) -> str:
    """
    Normalize bucket key so the signed key exactly matches the object:
    - decode percent-encoding
    - strip bucket prefix if a full URL/path was saved
    - remove leading slash
    - convert single leading 'products:File.zip' → 'products/File.zip'
    """
    if not raw_key:
        return raw_key

    key = unquote(raw_key.strip())

    # If a URL got saved in DB, reduce to just the key
    if key.startswith("http://") or key.startswith("https://"):
        parsed = urlparse(key)
        path = parsed.path.lstrip("/")
        if path.startswith(f"{R2_BUCKET_NAME}/"):
            path = path[len(R2_BUCKET_NAME) + 1 :]
        key = path

    key = key.lstrip("/")

    # For R2, keep colons as they are since files are stored with colons
    # Don't convert colons to slashes for R2 compatibility
    # if ":" in key and "/" not in key.split(":")[0]:
    #     key = key.replace(":", "/", 1)

    return key


def _expires_info(seconds: int):
    now = datetime.utcnow()
    return {
        "now": now.isoformat() + "Z",
        "expires_in": seconds,
        "expires_at": (now + timedelta(seconds=seconds)).isoformat() + "Z",
    }


def generate_download_url(object_key: str, expiration: int = 3600) -> str:
    """Generate a presigned URL for R2 download (path-style, s3v4)."""
    if not r2_client:
        raise HTTPException(status_code=500, detail="R2 not configured")

    key = _normalize_r2_key(object_key)

    info = _expires_info(expiration)
    print(
        f"🔐 Presign R2 URL | bucket={R2_BUCKET_NAME} key='{key}' "
        f"now={info['now']} expires_in={info['expires_in']}s expires_at={info['expires_at']}"
    )

    try:
        url = r2_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": R2_BUCKET_NAME, "Key": key},
            ExpiresIn=expiration,
        )
        return url
    except ClientError as e:
        code = getattr(e, "response", {}).get("Error", {}).get("Code")
        msg = getattr(e, "response", {}).get("Error", {}).get("Message")
        print(f"❌ Error generating download URL: code={code} msg={msg} key='{key}'")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")

# ---------- END R2 HELPERS ----------

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
        print(f"📁 File path (raw): {product.get('file_path')}")

        # Generate download URL
        raw_key = product.get("file_path", f"products/{product_id}.zip")
        print(f"📁 Raw file path from DB: '{raw_key}'")
        object_key = _normalize_r2_key(raw_key)
        print(f"🔗 Normalized key: '{object_key}'")
        
        expiration_seconds = 3600
        download_url = generate_download_url(object_key, expiration=expiration_seconds)
        print(f"✅ Download URL generated: {download_url}")
        
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
            "expires_in": expiration_seconds,
            "expires_at": (datetime.utcnow() + timedelta(seconds=expiration_seconds)).isoformat() + "Z",
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

@app.get("/api/v1/profile/download-info")
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

@app.get("/api/v1/profile/download-history")
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

@app.get("/api/v1/profile/liked-products")
async def get_liked_products(current_user: dict = Depends(get_current_user)):
    """Get user's liked products"""
    try:
        user_id = current_user["id"]
        
        # Get user's liked products
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        liked_product_ids = user.get("liked_products", [])
        
        # Get product details for liked products
        liked_products = []
        for product_id in liked_product_ids:
            product = await db.products.find_one({"_id": product_id})
            if product:
                liked_products.append({
                    "id": str(product["_id"]),
                    "title": product.get("title", "Unknown Product"),
                    "artist": product.get("artist", "Unknown Artist"),
                    "price": product.get("price", 0),
                    "description": product.get("description", ""),
                    "cover_image_url": product.get("cover_image_url", "/images/placeholder-product.jpg"),
                    "type": product.get("type", "sample-pack"),
                    "created_at": product.get("created_at", datetime.utcnow()).isoformat()
                })
        
        return {
            "products": liked_products,
            "total": len(liked_products)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting liked products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get liked products")

@app.get("/api/v1/profile/purchased-products")
async def get_purchased_products(current_user: dict = Depends(get_current_user)):
    """Get user's purchased products"""
    try:
        user_id = current_user["id"]
        
        # Get user's purchased products
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        purchased_product_ids = user.get("purchased_products", [])
        
        # Get product details for purchased products
        purchased_products = []
        for product_id in purchased_product_ids:
            product = await db.products.find_one({"_id": product_id})
            if product:
                # Get download info for this product
                download_info = await check_user_downloads(user_id)
                
                purchased_products.append({
                    "id": str(product["_id"]),
                    "title": product.get("title", "Unknown Product"),
                    "artist": product.get("artist", "Unknown Artist"),
                    "price": product.get("price", 0),
                    "description": product.get("description", ""),
                    "cover_image_url": product.get("cover_image_url", "/images/placeholder-product.jpg"),
                    "type": product.get("type", "sample-pack"),
                    "created_at": product.get("created_at", datetime.utcnow()).isoformat(),
                    "can_download": download_info["can_download"],
                    "downloads_remaining": download_info["downloads_remaining"]
                })
        
        return {
            "products": purchased_products,
            "total": len(purchased_products)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting purchased products: {e}")
        raise HTTPException(status_code=500, detail="Failed to get purchased products")

@app.put("/api/v1/user/change-password")
async def change_password(password_data: dict, current_user: dict = Depends(get_current_user)):
    """Change user password"""
    try:
        old_password = password_data.get("old_password")
        new_password = password_data.get("new_password")
        
        if not old_password or not new_password:
            raise HTTPException(status_code=400, detail="Old password and new password are required")
        
        if len(new_password) < 8:
            raise HTTPException(status_code=400, detail="New password must be at least 8 characters long")
        
        # Get user from database
        user_id = current_user["id"]
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify old password
        if not pwd_context.verify(old_password, user.get("password_hash")):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password
        new_password_hash = pwd_context.hash(new_password)
        
        # Update password
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "password_hash": new_password_hash,
                    "password_changed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {
            "message": "Password changed successfully",
            "password_changed_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error changing password: {e}")
        raise HTTPException(status_code=500, detail="Failed to change password")

@app.post("/api/v1/auth/forgot-password")
async def forgot_password(request_data: dict):
    """Send password reset email"""
    try:
        email = request_data.get("email", "").strip().lower()
        
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        
        # Check if user exists
        user = await db.users.find_one({"email": email, "email_verified": True})
        if not user:
            # Don't reveal if user exists or not for security
            return {
                "message": "If an account with that email exists, a password reset link has been sent.",
                "email_sent": True
            }
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_expires = datetime.utcnow() + timedelta(hours=1)  # 1 hour expiry
        
        # Store reset token
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_reset_token": reset_token,
                    "password_reset_expires": reset_expires,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Send reset email
        try:
            from services.email_service import email_service
            reset_url = f"{os.getenv('FRONTEND_URL', 'https://atomic-rose-tools.netlify.app')}/reset-password?token={reset_token}"
            
            email_sent = email_service.send_password_reset_email(
                email=email,
                name=user.get("name", "User"),
                reset_url=reset_url
            )
            
            if email_sent:
                print(f"✅ Password reset email sent to {email}")
            else:
                print(f"❌ Failed to send password reset email to {email}")
        except Exception as e:
            print(f"❌ Error sending password reset email: {e}")
        
        return {
            "message": "If an account with that email exists, a password reset link has been sent.",
            "email_sent": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in forgot password: {e}")
        raise HTTPException(status_code=500, detail="Failed to process password reset request")

@app.post("/api/v1/auth/reset-password")
async def reset_password(reset_data: dict):
    """Reset password with token"""
    try:
        token = reset_data.get("token")
        new_password = reset_data.get("new_password")
        
        if not token or not new_password:
            raise HTTPException(status_code=400, detail="Token and new password are required")
        
        if len(new_password) < 8:
            raise HTTPException(status_code=400, detail="New password must be at least 8 characters long")
        
        # Find user with valid reset token
        user = await db.users.find_one({
            "password_reset_token": token,
            "password_reset_expires": {"$gt": datetime.utcnow()},
            "email_verified": True
        })
        
        if not user:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        # Hash new password
        new_password_hash = pwd_context.hash(new_password)
        
        # Update password and clear reset token
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_hash": new_password_hash,
                    "password_changed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "password_reset_token": "",
                    "password_reset_expires": ""
                }
            }
        )
        
        return {
            "message": "Password reset successfully. You can now log in with your new password.",
            "password_changed_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error resetting password: {e}")
        raise HTTPException(status_code=500, detail="Failed to reset password")

@app.post("/api/v1/profile/toggle-like")
async def toggle_like_product(product_data: dict, current_user: dict = Depends(get_current_user)):
    """Toggle like status for a product"""
    try:
        user_id = current_user["id"]
        product_id = product_data.get("product_id")
        
        if not product_id:
            raise HTTPException(status_code=400, detail="Product ID is required")
        
        # Validate product ID
        try:
            product_oid = ObjectId(product_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid product ID format")
        
        # Check if product exists
        product = await db.products.find_one({"_id": product_oid})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get current user to check if product is already liked
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        liked_products = user.get("liked_products", [])
        is_liked = product_oid in liked_products
        
        if is_liked:
            # Remove from liked products
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$pull": {"liked_products": product_oid}}
            )
            liked = False
            message = "Product unliked successfully"
        else:
            # Add to liked products
            await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$addToSet": {"liked_products": product_oid}}
            )
            liked = True
            message = "Product liked successfully"
        
        return {
            "message": message,
            "product_id": product_id,
            "liked": liked
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error toggling like: {e}")
        raise HTTPException(status_code=500, detail="Failed to toggle like")


# Purchase endpoint
@app.post("/api/v1/orders/purchase")
async def purchase_product(order_data: dict, current_user: dict = Depends(get_current_user)):
    """Purchase a product and return an immediate download link."""
    try:
        user_id = current_user["id"]
        product_id = order_data.get("product_id")

        if not product_id:
            raise HTTPException(status_code=400, detail="Product ID is required")

        # Validate + fetch product
        try:
            product_oid = ObjectId(product_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid product ID format")

        product = await db.products.find_one({"_id": product_oid})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # Add to purchased products
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"purchased_products": product_oid}}
        )

        # Create order record
        order = {
            "user_id": ObjectId(user_id),
            "order_number": f"ORD-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "items": [{
                "product_id": product_oid,
                "quantity": 1,
                "price": product.get("price", 0),
            }],
            "total_amount": product.get("price", 0),
            "status": "completed",
            "payment_method": "mock",
            "payment_id": f"mock_{datetime.utcnow().timestamp()}",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_fulfilled": True,
            "fulfillment_date": datetime.utcnow(),
        }
        await db.orders.insert_one(order)

        # Generate a presigned download url (1h)
        file_path = product.get("file_path", f"products/{product_id}.zip")
        download_url = generate_download_url(file_path, expiration=3600)

        # Log download event (first download right away is optional)
        await db.download_events.insert_one({
            "user_id": ObjectId(user_id),
            "product_id": product_oid,
            "download_url": download_url,
            "ip_address": "127.0.0.1",
            "user_agent": "Atomic Rose Tools App",
            "created_at": datetime.utcnow(),
        })

        # Send thank you email with download link
        try:
            from services.email_service import email_service
            print(f"📧 Sending user thank you email to {current_user['email']}")
            
            # Get user details
            user = await db.users.find_one({"_id": ObjectId(user_id)})
            user_name = user.get("name", "User") if user else "User"
            
            # Create download link object
            download_links = [{
                "product_id": str(product_oid),
                "title": product.get("title", "Unknown Product"),
                "artist": product.get("artist", "Unknown Artist"),
                "price": f"${product.get('price', 0):.2f}",
                "download_url": download_url,
                "cover_image_url": product.get("cover_image_url", "/images/placeholder-product.jpg")
            }]
            
            thank_you_sent = email_service.send_user_thank_you_email(
                email=current_user["email"],
                name=user_name,
                order_number=order["order_number"],
                download_links=download_links
            )
            if thank_you_sent:
                print(f"✅ User thank you email sent successfully to {current_user['email']}")
            else:
                print(f"❌ Failed to send user thank you email to {current_user['email']}")
        except Exception as e:
            print(f"❌ Error sending user thank you email to {current_user['email']}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")

        return {
            "success": True,
            "message": "Purchase successful",
            "order_number": order["order_number"],
            "product_title": product.get("title", "Unknown Product"),
            "download_url": download_url,
            "expires_in": 3600,
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
            print(f"📧 Attempting to send OTP email to {email}")
            
            email_sent = email_service.send_guest_verification_email(
                email=email,
                order_number=order["order_number"],
                verification_token=verification_token,
                otp_code=otp_code,
                items=items,
                total_amount=order["total_amount"]
            )
            if email_sent:
                print(f"✅ Guest verification email sent successfully to {email}")
            else:
                print(f"❌ Failed to send guest verification email to {email}")
        except Exception as e:
            print(f"❌ Error sending guest verification email to {email}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
        
        print(f"📧 Guest checkout created: {order['order_number']}")
        print(f"🔗 Verification token: {verification_token}")
        print(f"📧 Email: {email}")
        
        return {
            "order_id": str(order_id),
            "order_number": order["order_number"],
            "verification_token": verification_token,
            "message": "Please check your email to verify your email address before completing checkout",
            "email_sent": email_sent if 'email_sent' in locals() else False
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
        
        # Complete the purchase and generate download links
        download_links = []
        
        # Generate download links for each item
        for item in order["items"]:
            try:
                product_id = item["product_id"]
                product = await db.products.find_one({"_id": ObjectId(product_id)})
                
                if product:
                    # Generate R2 download URL
                    raw_key = product.get("file_path", f"products/{product_id}.zip")
                    print(f"📁 Guest - Raw file path from DB: '{raw_key}'")
                    object_key = _normalize_r2_key(raw_key)
                    print(f"🔗 Guest - Normalized key: '{object_key}'")
                    expiration_seconds = 3600  # 1 hour
                    download_url = generate_download_url(object_key, expiration=expiration_seconds)
                    print(f"✅ Guest - Download URL generated: {download_url}")
                    
                    download_links.append({
                        "product_id": product_id,
                        "title": item["title"],
                        "artist": product.get("artist", "Unknown Artist"),
                        "price": f"${item['price']:.2f}",
                        "download_url": download_url,
                        "cover_image_url": product.get("cover_image_url", "/images/placeholder-product.jpg")
                    })
                    
                    print(f"✅ Generated download link for {item['title']}")
                else:
                    print(f"❌ Product not found: {product_id}")
                    
            except Exception as e:
                print(f"❌ Error generating download link for {item['title']}: {e}")
        
        # Update order status to completed
        await db.guest_orders.update_one(
            {"_id": order["_id"]},
            {
                "$set": {
                    "status": "completed",
                    "email_verified": True,
                    "download_links": download_links,
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Send thank you email with download links
        try:
            from services.email_service import email_service
            print(f"📧 Sending thank you email to {order['guest_email']}")
            thank_you_sent = email_service.send_guest_thank_you_email(
                email=order['guest_email'],
                order_number=order['order_number'],
                download_links=download_links
            )
            if thank_you_sent:
                print(f"✅ Thank you email sent successfully to {order['guest_email']}")
            else:
                print(f"❌ Failed to send thank you email to {order['guest_email']}")
        except Exception as e:
            print(f"❌ Error sending thank you email to {order['guest_email']}: {e}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
        
        print(f"✅ Guest purchase completed for order: {order['order_number']}")
        return {
            "success": True,
            "message": "Purchase completed successfully",
            "order_id": str(order["_id"]),
            "order_number": order["order_number"],
            "download_links": download_links,
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
        
        # Generate one-time download links for immediate download (short window)
        immediate_download_links = []
        for item in order["items"]:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                raw_key = product.get("file_path", f"products/{item['product_id']}.zip")
                object_key = _normalize_r2_key(raw_key)
                download_url = generate_download_url(object_key, expiration=900)  # 15 minutes
                immediate_download_links.append({
                    "product_title": product.get("title", "Unknown Product"),
                    "download_url": download_url,
                    "expires_in": 900,
                    "type": "immediate"
                })
        
        # Prepare email download links (longer window)
        email_download_links = []
        for item in order["items"]:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                raw_key = product.get("file_path", f"products/{item['product_id']}.zip")
                print(f"📁 Email - Raw file path from DB: '{raw_key}'")
                object_key = _normalize_r2_key(raw_key)
                print(f"🔗 Email - Normalized key: '{object_key}'")
                download_url = generate_download_url(object_key, expiration=86400)  # 24 hours
                print(f"✅ Email - Download URL generated: {download_url}")
                email_download_links.append({
                    "product_title": product.get("title", "Unknown Product"),
                    "download_url": download_url,
                    "expires_in": 86400,
                    "type": "email"
                })
        
        # Email with download links is sent via the email service
        print(f"✅ Guest order verified: {order['order_number']}")
        print(f"📧 Would send {len(email_download_links)} download link(s) to: {order['guest_email']}")
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
        raw_key = product.get("file_path", f"products/{product_id}.zip")
        object_key = _normalize_r2_key(raw_key)
        expiration_seconds = 3600
        download_url = generate_download_url(object_key, expiration=expiration_seconds)
        
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
            "expires_in": expiration_seconds,
            "expires_at": (datetime.utcnow() + timedelta(seconds=expiration_seconds)).isoformat() + "Z",
            "product_title": product.get("title", "Unknown Product"),
            "downloads_remaining": order["downloads_remaining"] - 1
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting guest download: {e}")
        raise HTTPException(status_code=500, detail="Failed to get download")

@app.get("/api/v1/guest-downloads/{order_number}")
async def get_guest_download_links(order_number: str):
    """Get all download links for a guest order with validation"""
    try:
        # Get order details
        order = await db.guest_orders.find_one({"order_number": order_number})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Check if order is verified
        if order.get("status") != "verified":
            raise HTTPException(status_code=400, detail="Order not verified yet")
        
        # Check download limit
        if order["downloads_remaining"] <= 0:
            raise HTTPException(status_code=429, detail="Download limit reached for this order")
        
        download_links = []
        
        for item in order["items"]:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if product:
                raw_key = product.get("file_path", f"products/{item['product_id']}.zip")
                object_key = _normalize_r2_key(raw_key)
                expiration_seconds = 3600  # 1 hour
                download_url = generate_download_url(object_key, expiration=expiration_seconds)
                
                download_links.append({
                    "product_id": item["product_id"],
                    "title": item["title"],
                    "artist": product.get("artist", "Unknown Artist"),
                    "price": f"${item['price']:.2f}",
                    "download_url": download_url,
                    "cover_image_url": product.get("cover_image_url", "/images/placeholder-product.jpg"),
                    "expires_in": expiration_seconds,
                    "expires_at": (datetime.utcnow() + timedelta(seconds=expiration_seconds)).isoformat() + "Z"
                })
        
        return {
            "order_number": order["order_number"],
            "download_links": download_links,
            "downloads_remaining": order["downloads_remaining"],
            "total_items": len(order["items"])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error getting guest download links: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
