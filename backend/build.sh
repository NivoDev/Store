#!/bin/bash
# Build script for Render deployment

echo "🔧 Starting build process..."

# Navigate to backend directory
cd backend

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ requirements.txt not found in backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if simple_api.py exists
if [ ! -f "simple_api.py" ]; then
    echo "❌ simple_api.py not found in backend directory"
    exit 1
fi

echo "✅ Build completed successfully!"