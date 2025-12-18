@echo off
REM Batch file to start the frontend
REM Double-click this file to start

echo Starting Admin Frontend...
echo.

cd /d "%~dp0"

if exist package.json (
    echo [OK] Found package.json
    echo Current directory: %CD%
    echo.
    
    if not exist node_modules (
        echo Installing dependencies...
        call npm install
    )
    
    echo Starting React development server...
    echo The app will open at http://localhost:3000
    echo.
    call npm start
) else (
    echo [ERROR] package.json not found!
    echo Current directory: %CD%
    echo.
    echo Please make sure you're in the admin/4X4- directory
    pause
)

