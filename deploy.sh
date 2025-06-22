#!/bin/bash

# Granada Dashboard Deployment Script
echo "🚀 Starting Granada Dashboard Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.9+ first."
        exit 1
    fi
    
    if ! command -v pip &> /dev/null; then
        print_error "pip is not installed. Please install pip first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    
    if [ ! -f "backend/requirements.txt" ]; then
        print_error "backend/requirements.txt not found"
        exit 1
    fi
    
    cd backend
    pip install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Failed to build frontend"
        exit 1
    fi
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << EOF
# Database
DATABASE_URL=postgresql://user:password@localhost/granada_db

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# API Settings
API_V1_STR=/api/v1
PROJECT_NAME=Granada Dashboard API

# Logging
LOG_LEVEL=INFO
EOF
        print_warning "Please update the .env file with your actual configuration values"
    else
        print_success "Environment file exists"
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start backend
    print_status "Starting backend API server..."
    cd backend
    nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "Backend API server started (PID: $BACKEND_PID)"
    else
        print_error "Failed to start backend API server"
        exit 1
    fi
    
    # Start frontend development server
    print_status "Starting frontend development server..."
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > frontend.pid
    
    # Wait a moment for frontend to start
    sleep 5
    
    print_success "Frontend development server started (PID: $FRONTEND_PID)"
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        kill $BACKEND_PID 2>/dev/null
        rm backend.pid
        print_success "Backend server stopped"
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        kill $FRONTEND_PID 2>/dev/null
        rm frontend.pid
        print_success "Frontend server stopped"
    fi
}

# Show status
show_status() {
    print_status "Service Status:"
    
    # Check backend
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "✅ Backend API: Running (http://localhost:8000)"
        print_status "   - API Documentation: http://localhost:8000/docs"
        print_status "   - Health Check: http://localhost:8000/health"
    else
        print_error "❌ Backend API: Not running"
    fi
    
    # Check frontend
    if curl -s http://localhost:5173 > /dev/null; then
        print_success "✅ Frontend: Running (http://localhost:5173)"
        print_status "   - Student Dashboard: http://localhost:5173/dashboard/student"
        print_status "   - Business Dashboard: http://localhost:5173/dashboard/business"
        print_status "   - Job Seeker Dashboard: http://localhost:5173/dashboard/job-seeker"
        print_status "   - General Dashboard: http://localhost:5173/dashboard/general"
    else
        print_error "❌ Frontend: Not running"
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    print_status "Running frontend tests..."
    npm test -- --run
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    python -m pytest tests/ -v
    cd ..
    
    print_success "Tests completed"
}

# Main deployment function
deploy() {
    print_status "🚀 Granada Dashboard Deployment Starting..."
    
    check_dependencies
    setup_environment
    install_frontend
    install_backend
    build_frontend
    start_services
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    show_status
    echo ""
    print_status "📚 Available endpoints:"
    print_status "   - Landing Page: http://localhost:5173"
    print_status "   - API Documentation: http://localhost:8000/docs"
    print_status "   - Student Dashboard: http://localhost:5173/dashboard/student"
    print_status "   - Business Dashboard: http://localhost:5173/dashboard/business"
    print_status "   - Job Seeker Dashboard: http://localhost:5173/dashboard/job-seeker"
    print_status "   - General Dashboard: http://localhost:5173/dashboard/general"
    echo ""
    print_status "📋 Next steps:"
    print_status "   1. Update .env file with your configuration"
    print_status "   2. Set up your database (PostgreSQL)"
    print_status "   3. Configure Stripe keys for payments"
    print_status "   4. Test the dashboards and credit system"
    echo ""
    print_status "🛑 To stop services: ./deploy.sh stop"
    print_status "📊 To check status: ./deploy.sh status"
}

# Handle command line arguments
case "$1" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "status")
        show_status
        ;;
    "test")
        run_tests
        ;;
    "restart")
        stop_services
        sleep 2
        start_services
        ;;
    *)
        deploy
        ;;
esac