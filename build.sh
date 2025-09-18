#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting backend build process..."

# Navigate to backend directory
cd backend

# Check Python version
python3 --version

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --only-binary=all -r requirements.txt

echo "✅ Build completed successfully!"

