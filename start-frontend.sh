#!/bin/bash
# Start script for frontend

set -e

echo "================================================"
echo "🎨 Starting Frontend Application"
echo "================================================"
echo ""

cd ui

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Please run ./setup.sh first"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "ℹ️  Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
fi

echo "✅ Frontend ready!"
echo ""
echo "ℹ️  Starting Next.js development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo ""
echo "================================================"
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    pnpm dev
else
    npm run dev
fi
