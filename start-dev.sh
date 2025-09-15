#!/bin/bash

# Atomic Rose Tools Store - Development Startup Script

echo "🚀 Starting Atomic Rose Tools Store Development Environment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the Store root directory"
    echo "   Expected structure: Store/{frontend,backend}/"
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Backend
echo "🔧 Starting Backend Server..."
cd backend
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in backend directory"
    echo "   Please create .env with your MongoDB and R2 credentials"
fi

python3 simple_api.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if ! curl -s http://127.0.0.1:8000/api/v1/products > /dev/null; then
    echo "❌ Backend failed to start. Check your .env configuration."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend running on http://127.0.0.1:8000"

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd frontend
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in frontend directory"
    echo "   Creating default .env file..."
    echo "REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1" > .env
fi

npm start &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

echo "✅ Frontend running on http://localhost:3000"
echo ""
echo "🎉 Development environment is ready!"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://127.0.0.1:8000"
echo "   API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user interrupt
wait
