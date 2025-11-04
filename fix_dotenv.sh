#!/bin/bash

# Quick fix script to install python-dotenv

echo "🔧 Installing python-dotenv..."
echo ""

cd gearstore_backend

# Check if venv exists
if [ ! -d "../venv" ]; then
    echo "❌ Virtual environment not found at ../venv"
    echo "Please create it first: python3 -m venv venv"
    exit 1
fi

# Activate venv and install
source ../venv/bin/activate

echo "Installing python-dotenv and requests..."
pip install python-dotenv requests

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo ""
    echo "Now you can run:"
    echo "  python manage.py runserver"
else
    echo ""
    echo "❌ Installation failed"
    exit 1
fi
