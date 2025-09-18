#!/usr/bin/env python3
"""
Test the _normalize_r2_key function
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the function directly
def _normalize_r2_key(raw_key: str) -> str:
    """
    Normalize bucket key so the signed key exactly matches the object:
    - decode percent-encoding
    - strip bucket prefix if a full URL/path was saved
    - remove leading slash
    - convert single leading 'products:File.zip' → 'products/File.zip'
    """
    from urllib.parse import unquote, urlparse
    
    if not raw_key:
        return raw_key

    key = unquote(raw_key.strip())

    # If a URL got saved in DB, reduce to just the key
    if key.startswith("http://") or key.startswith("https://"):
        parsed = urlparse(key)
        path = parsed.path.lstrip("/")
        if path.startswith("atomic-rose-tools-bucket/"):
            path = path[len("atomic-rose-tools-bucket") + 1 :]
        key = path

    key = key.lstrip("/")

    # For R2, keep colons as they are since files are stored with colons
    # Don't convert colons to slashes for R2 compatibility
    # if ":" in key and "/" not in key.split(":")[0]:
    #     key = key.replace(":", "/", 1)

    return key

def test_normalization():
    """Test the _normalize_r2_key function with various inputs"""
    
    test_cases = [
        "products:Psychedelic_Horizons_Sample_Pack.zip",
        "products/Psychedelic_Horizons_Sample_Pack.zip",
        "/products/Psychedelic_Horizons_Sample_Pack.zip",
        "products:File.zip",
        "products/File.zip",
        "folder:subfolder:file.zip",
        "folder/subfolder/file.zip"
    ]
    
    print("🧪 Testing _normalize_r2_key function:")
    print("=" * 60)
    
    for test_input in test_cases:
        result = _normalize_r2_key(test_input)
        print(f"Input:  '{test_input}'")
        print(f"Output: '{result}'")
        print()

if __name__ == "__main__":
    test_normalization()
