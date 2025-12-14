#!/bin/bash
# Start script for both backend and frontend

set -e

echo "================================================"
echo "🚀 Starting Task Manager Application"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_error "Virtual environment not found. Please run ./setup.sh first"
    exit 1
fi

# Function to check if PostgreSQL is running
check_postgres() {
    if command -v pg_isready &> /dev/null; then
        if pg_isready -q; then
            return 0
        fi
    fi
    return 1
}

# Check PostgreSQL
print_info "Checking PostgreSQL..."
if ! check_postgres; then
    print_error "PostgreSQL is not running. Please start PostgreSQL:"
    echo "   sudo service postgresql start"
    exit 1
fi
print_success "PostgreSQL is running"

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate

# Check if database is set up
print_info "Checking database setup..."
if python manage.py showmigrations tasks 2>/dev/null | grep -q "\[ \]"; then
    print_info "Running migrations..."
    python manage.py migrate
fi

echo ""
print_success "Backend ready!"
echo ""
print_info "Starting Django development server..."
echo "   Backend will be available at: http://localhost:8000"
echo "   Admin panel: http://localhost:8000/admin/"
echo "   API: http://localhost:8000/api/"
echo ""
print_info "Default credentials: admin / admin123"
echo ""
echo "================================================"
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo ""

# Start Django server
python manage.py runserver
