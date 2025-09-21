"""
Security middleware for input sanitization and validation
"""
import re
import html
from typing import Any, Dict, List
from fastapi import HTTPException

def sanitize_input(data: Any) -> Any:
    """Sanitize user input to prevent XSS and injection attacks"""
    if isinstance(data, dict):
        return {key: sanitize_input(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    elif isinstance(data, str):
        # Remove HTML tags and encode special characters
        cleaned = re.sub(r'<[^>]+>', '', data)  # Remove HTML tags
        return html.escape(cleaned)
    return data

def validate_input(data: Dict[str, Any], field_rules: Dict[str, Dict]) -> None:
    """Validate input against field-specific rules"""
    for field, rules in field_rules.items():
        if field in data:
            value = data[field]
            if value is None or value == '' or not isinstance(value, str):
                continue
                
            # Check max length
            if 'max_length' in rules and len(value) > rules['max_length']:
                raise HTTPException(
                    status_code=400, 
                    detail=f"{field} exceeds maximum length of {rules['max_length']} characters"
                )
            
            # Check pattern
            if 'pattern' in rules and not re.match(rules['pattern'], value):
                raise HTTPException(
                    status_code=400, 
                    detail=f"{field} format is invalid"
                )
            
            # Check required characters (regex pattern)
            if 'required_chars' in rules:
                if not re.search(rules['required_chars'], value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"{field} must contain at least one letter"
                    )

def get_validation_rules() -> Dict[str, Dict]:
    """Get validation rules for different fields"""
    return {
        'name': {
            'max_length': 100,
            'pattern': r'^[a-zA-Z0-9\s\-\.]+$',
            'required_chars': r'[a-zA-Z]'
        },
        'company_name': {
            'max_length': 100,
            'pattern': r'^[a-zA-Z0-9\s\-\.&]+$'
        },
        'phone_number': {
            'max_length': 20,
            'pattern': r'^[\+]?[0-9][\d\s\-\(\)]{0,18}$'
        },
        'vat_number': {
            'max_length': 50,
            'pattern': r'^[A-Z0-9\-]+$'
        },
        'email': {
            'max_length': 255,
            'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        'password': {
            'max_length': 128,
            'pattern': r'^.{8,}$'  # At least 8 characters
        }
    }

def sanitize_billing_address(address: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitize billing address data specifically"""
    if not address:
        return {}
    
    sanitized = {}
    for key, value in address.items():
        if isinstance(value, str):
            # Remove HTML tags and escape special characters
            cleaned = re.sub(r'<[^>]+>', '', value)
            sanitized[key] = html.escape(cleaned)
        else:
            sanitized[key] = value
    
    return sanitized
