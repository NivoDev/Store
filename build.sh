#!/bin/bash
# Build script for Render deployment

echo "🔧 Starting build process..."

# Upgrade pip first
pip install --upgrade pip

# Install dependencies with pre-built wheels only
echo "📦 Installing Python dependencies..."
pip install --only-binary=all -r requirements.txt

# Check if simple_api.py exists
if [ ! -f "backend/simple_api.py" ]; then
    echo "❌ backend/simple_api.py not found"
    exit 1
fi

echo "✅ Build completed successfully!"
