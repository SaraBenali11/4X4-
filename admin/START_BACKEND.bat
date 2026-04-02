@echo off
echo Starting Backend Server...
echo.

cd /d "%~dp0src\backend"

echo Current directory: %CD%
echo.

echo Installing/updating dependencies...
call pip install -r requirements/requirements.txt

echo.
echo Starting Flask server...
echo Backend will be available at http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py

pause

