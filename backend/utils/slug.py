import re
from typing import Optional

def generate_slug(title: str) -> str:
    """
    Generate a URL-friendly slug from a product title.
    
    Args:
        title: The product title
        
    Returns:
        A URL-friendly slug
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

def extract_id_from_slug(slug: str) -> Optional[str]:
    """
    Extract MongoDB ObjectId from slug if it exists.
    This is for backward compatibility with existing URLs.
    
    Args:
        slug: The URL slug
        
    Returns:
        ObjectId string if found, None otherwise
    """
    # Check if slug is a valid ObjectId (24 hex characters)
    if len(slug) == 24 and re.match(r'^[0-9a-fA-F]+$', slug):
        return slug
    
    return None

