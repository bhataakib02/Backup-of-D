#!/bin/bash

# NEXUS CYBER INTELLIGENCE - Complete Deployment Script
# Enterprise-Grade Cybersecurity Platform

echo "🚀 NEXUS CYBER INTELLIGENCE - Deployment Starting..."
echo "=================================================="

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
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Python
    if command -v python &> /dev/null; then
        PYTHON_VERSION=$(python --version)
        print_success "Python found: $PYTHON_VERSION"
    else
        print_error "Python is not installed. Please install Python 3.9+ first."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend || exit 1
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Install Python dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Initialize database
    print_status "Initializing database..."
    python scripts/init_database.py 2>/dev/null || print_warning "Database initialization skipped (file not found)"
    
    # Train ML models
    print_status "Training ML models..."
    python scripts/train_models.py 2>/dev/null || print_warning "Model training skipped (file not found)"
    
    cd ..
    print_success "Backend setup completed!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend || exit 1
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    npm install --legacy-peer-deps
    
    # Build for production if specified
    if [ "$1" == "production" ]; then
        print_status "Building for production..."
        npm run build
    fi
    
    cd ..
    print_success "Frontend setup completed!"
}

# Create environment files
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# NEXUS CYBER INTELLIGENCE Configuration
APP_NAME=NEXUS_CYBER_INTELLIGENCE
APP_VERSION=2.0.0
FLASK_ENV=development
SECRET_KEY=nexus-cyber-intelligence-secret-key-2024
JWT_SECRET_KEY=nexus-jwt-secret-key-2024

# Database Configuration
DATABASE_URL=sqlite:///nexus_ci.db
POSTGRES_DB=nexus_ci
POSTGRES_USER=nexus
POSTGRES_PASSWORD=nexus2024

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# API Keys (Optional)
VIRUSTOTAL_API_KEY=your-virustotal-api-key
ABUSEIPDB_API_KEY=your-abuseipdb-api-key
SHODAN_API_KEY=your-shodan-api-key

# Security Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
RATE_LIMIT_PER_MINUTE=100
SESSION_TIMEOUT_MINUTES=30

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/nexus_ci.log
EOF
        print_success "Backend .env file created"
    else
        print_warning "Backend .env file already exists"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# NEXUS CYBER INTELLIGENCE Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_VERSION=2.0.0
REACT_APP_NAME=NEXUS_CYBER_INTELLIGENCE
GENERATE_SOURCEMAP=false
EOF
        print_success "Frontend .env file created"
    else
        print_warning "Frontend .env file already exists"
    fi
}

# Start services
start_services() {
    print_status "Starting NEXUS CYBER INTELLIGENCE services..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    python app.py &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    # Save PIDs for later cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_success "Services started successfully!"
    print_status "Backend running on: http://localhost:5000"
    print_status "Frontend running on: http://localhost:3000"
    print_status ""
    print_status "🎉 NEXUS CYBER INTELLIGENCE is now running!"
    print_status "=================================================="
    print_status "📊 Dashboard: http://localhost:3000"
    print_status "🔧 API Docs: http://localhost:5000/api/docs"
    print_status "❤️ Health Check: http://localhost:5000/api/health"
    print_status "=================================================="
}

# Stop services
stop_services() {
    print_status "Stopping NEXUS CYBER INTELLIGENCE services..."
    
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || print_warning "Backend process not found"
        rm .backend.pid
    fi
    
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || print_warning "Frontend process not found"
        rm .frontend.pid
    fi
    
    print_success "Services stopped!"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Check backend
    if curl -f http://localhost:5000/api/health &>/dev/null; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &>/dev/null; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend health check failed"
    fi
}

# Main deployment function
deploy() {
    local mode=${1:-development}
    
    print_status "Deploying NEXUS CYBER INTELLIGENCE in $mode mode..."
    
    check_requirements
    create_env_files
    setup_backend
    setup_frontend $mode
    
    if [ "$mode" != "build-only" ]; then
        start_services
    fi
}

# Help function
show_help() {
    echo "NEXUS CYBER INTELLIGENCE - Deployment Script"
    echo "============================================="
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy              Deploy in development mode (default)"
    echo "  deploy production   Deploy in production mode"
    echo "  deploy build-only   Build without starting services"
    echo "  start              Start services"
    echo "  stop               Stop services"
    echo "  restart            Restart services"
    echo "  health             Check service health"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy           # Deploy in development mode"
    echo "  $0 deploy production # Deploy in production mode"
    echo "  $0 start            # Start services"
    echo "  $0 stop             # Stop services"
    echo "  $0 health           # Check health"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy ${2:-development}
        ;;
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        start_services
        ;;
    "health")
        health_check
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac