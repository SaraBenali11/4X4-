@echo off
REM Windows batch script to run the Flask backend

echo.
echo ========================================
echo Sutraty Backend Startup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher
    pause
    exit /b 1
)

REM Check if requirements are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist .env (
    echo.
    echo Warning: .env file not found
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo Please edit .env with your MySQL credentials
    echo.
)

REM Initialize database
echo.
echo Initializing database...
python init_db.py
if errorlevel 1 (
    echo Warning: Database initialization failed
    echo Make sure MySQL is running and credentials are correct
    echo.
)

REM Start the Flask server
echo.
echo Starting Flask server...
echo.
python app.py

pause
