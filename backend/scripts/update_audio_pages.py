#!/usr/bin/env python3
"""
Script to update all page components to remove old audio props
"""

import os
import re

def update_file(file_path):
    """Update a single file to remove old audio props"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove onPlay and isPlaying props from ProductCard calls
        content = re.sub(r'\s*onPlay={handlePlay}\s*\n\s*isPlaying={currentlyPlaying === product\.id}\s*\n', '\n', content)
        
        # Remove handlePlay function definitions
        content = re.sub(r'const handlePlay = \(product\) => \{[^}]*\};\s*\n', '', content)
        
        # Remove currentlyPlaying state
        content = re.sub(r'const \[currentlyPlaying, setCurrentlyPlaying\] = useState\(null\);\s*\n', '', content)
        
        # Add useAudio import if not present
        if 'useAudio' not in content and 'AudioContext' in content:
            content = content.replace(
                "import { useCart } from '../contexts/CartContext';",
                "import { useCart } from '../contexts/CartContext';\nimport { useAudio } from '../contexts/AudioContext';"
            )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def main():
    """Update all page files"""
    pages_dir = "/Users/nivo/Projects/Store/frontend/src/pages"
    files_to_update = [
        "SamplePacksPage.js",
        "MidiPacksPage.js", 
        "AcapellasPage.js"
    ]
    
    updated_count = 0
    for filename in files_to_update:
        file_path = os.path.join(pages_dir, filename)
        if os.path.exists(file_path):
            if update_file(file_path):
                updated_count += 1
        else:
            print(f"⚠️  File not found: {file_path}")
    
    print(f"\n✨ Updated {updated_count} files")

if __name__ == "__main__":
    main()

