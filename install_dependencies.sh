#!/bin/bash

# Installation script for AG's GearStore
# Installs all required dependencies for backend and frontend

echo "🚀 AG's GearStore - Dependency Installation"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "gearstore_backend" ] || [ ! -d "ag-gearstore" ]; then
    echo "❌ Error: Please run this script from the AG's directory"
    exit 1
fi

echo "✅ Directory structure verified"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
echo "========================"
cd gearstore_backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your Paystack keys"
fi

cd ..
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
echo "========================="
cd ag-gearstore

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
else
    echo "✅ Node modules already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "📝 Please edit .env.local and add your Paystack public key"
fi

cd ..
echo ""

echo "✅ Installation Complete!"
echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Get your Paystack API keys:"
echo "   https://dashboard.paystack.com/#/settings/developers"
echo ""
echo "2. Update backend configuration:"
echo "   Edit: gearstore_backend/.env"
echo "   Add your PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY"
echo ""
echo "3. Update frontend configuration:"
echo "   Edit: ag-gearstore/.env.local"
echo "   Add your NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
echo ""
echo "4. Start the servers:"
echo "   Terminal 1: cd gearstore_backend && source venv/bin/activate && python manage.py runserver"
echo "   Terminal 2: cd ag-gearstore && npm run dev"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - ENV_SETUP_GUIDE.md"
echo "   - PAYSTACK_QUICK_START.md"
echo ""
