#!/bin/bash
# Complete setup script for Task Manager application

set -e  # Exit on error

echo "================================================"
echo "🚀 Task Manager - Complete Setup Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Python is installed
print_info "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi
print_success "Python 3 found: $(python3 --version)"

# Check if PostgreSQL is installed
print_info "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL 12 or higher."
    exit 1
fi
print_success "PostgreSQL found"

echo ""
echo "================================================"
echo "📦 Step 1: Setting up Python Backend"
echo "================================================"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    print_info "Creating virtual environment..."
    python3 -m venv venv
    print_success "Virtual environment created"
else
    print_info "Virtual environment already exists"
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated"

# Install Python dependencies
print_info "Installing Python dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
print_success "Python dependencies installed"

# Setup database
echo ""
print_info "Setting up database..."
python3 setup_database.py

echo ""
echo "================================================"
echo "🎨 Step 2: Setting up Frontend"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Navigate to UI directory
cd ui

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        print_error "Neither pnpm nor npm found. Please install Node.js package manager."
        exit 1
    fi
    print_success "Frontend dependencies installed"
else
    print_info "Frontend dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local file..."
    cp .env.local.example .env.local
    print_success ".env.local file created"
else
    print_info ".env.local file already exists"
fi

cd ..

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Start the backend:"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
echo ""
echo "2️⃣  In a new terminal, start the frontend:"
echo "   cd ui"
echo "   pnpm dev  (or npm run dev)"
echo ""
echo "3️⃣  Open your browser:"
echo "   Backend:  http://localhost:8000/admin/"
echo "   Frontend: http://localhost:3000/"
echo ""
echo "4️⃣  Login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "================================================"
echo "🎉 Happy Coding!"
echo "================================================"
echo ""
