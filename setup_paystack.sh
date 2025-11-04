#!/bin/bash

# Paystack Setup Script for AG's GearStore
# This script helps you set up Paystack payment integration

echo "🚀 AG's GearStore - Paystack Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -d "gearstore_backend" ] || [ ! -d "ag-gearstore" ]; then
    echo "❌ Error: Please run this script from the AG's directory"
    echo "   Expected structure:"
    echo "   - gearstore_backend/"
    echo "   - ag-gearstore/"
    exit 1
fi

echo "✅ Directory structure verified"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd gearstore_backend

if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please create it first:"
    echo "   python -m venv venv"
    exit 1
fi

source venv/bin/activate
pip install requests > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Python dependencies installed"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

cd ..

echo ""
echo "🔑 Paystack API Keys Setup"
echo "=========================="
echo ""
echo "To complete the setup, you need to:"
echo ""
echo "1. Sign up at https://paystack.com (if you haven't already)"
echo "2. Go to Settings → API Keys & Webhooks"
echo "3. Copy your Secret Key and Public Key"
echo ""
echo "4. Update the file:"
echo "   gearstore_backend/gearstore_backend/settings.py"
echo ""
echo "   Replace these lines:"
echo "   PAYSTACK_SECRET_KEY = 'sk_test_your_secret_key_here'"
echo "   PAYSTACK_PUBLIC_KEY = 'pk_test_your_public_key_here'"
echo ""
echo "   With your actual keys from Paystack"
echo ""
echo "✅ Setup script completed!"
echo ""
echo "📖 Next steps:"
echo "   1. Update your Paystack keys in settings.py"
echo "   2. Start the backend: cd gearstore_backend && python manage.py runserver"
echo "   3. Start the frontend: cd ag-gearstore && npm run dev"
echo "   4. Test the payment flow at http://localhost:3000/checkout"
echo ""
echo "📚 For detailed instructions, see PAYSTACK_SETUP.md"
echo ""
