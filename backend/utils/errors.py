"""
Error handling utilities for proper HTTP status codes and error messages
"""
from fastapi import HTTPException
from bson import ObjectId
import re

def validate_object_id(id_string: str) -> ObjectId:
    """Validate and convert string to ObjectId"""
    if not ObjectId.is_valid(id_string):
        raise HTTPException(
            status_code=400, 
            detail="Invalid ID format. Must be a valid MongoDB ObjectId."
        )
    return ObjectId(id_string)

def handle_product_not_found():
    """Handle product not found error"""
    raise HTTPException(
        status_code=404,
        detail="Product not found"
    )

def handle_user_not_found():
    """Handle user not found error"""
    raise HTTPException(
        status_code=404,
        detail="User not found"
    )

def handle_validation_error(field: str, message: str):
    """Handle validation errors"""
    raise HTTPException(
        status_code=400,
        detail=f"Validation error for {field}: {message}"
    )

def handle_authentication_error():
    """Handle authentication errors"""
    raise HTTPException(
        status_code=401,
        detail="Authentication required"
    )

def handle_authorization_error():
    """Handle authorization errors"""
    raise HTTPException(
        status_code=403,
        detail="Insufficient permissions"
    )

def handle_internal_error(message: str = "Internal server error"):
    """Handle internal server errors"""
    raise HTTPException(
        status_code=500,
        detail=message
    )

def validate_email_format(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password_strength(password: str) -> bool:
    """Validate password strength"""
    if len(password) < 8:
        return False
    return True
