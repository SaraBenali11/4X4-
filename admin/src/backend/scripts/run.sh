#!/bin/bash

# Unix/Linux/Mac shell script to run the Flask backend

echo ""
echo "========================================"
echo "Sutraty Backend Startup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

# Check if requirements are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "Please edit .env with your MySQL credentials"
    echo ""
fi

# Initialize database
echo ""
echo "Initializing database..."
python3 init_db.py
if [ $? -ne 0 ]; then
    echo "Warning: Database initialization failed"
    echo "Make sure MySQL is running and credentials are correct"
    echo ""
fi

# Start the Flask server
echo ""
echo "Starting Flask server..."
echo ""
python3 app.py
