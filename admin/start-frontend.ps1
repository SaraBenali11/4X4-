# PowerShell script to start the frontend
# Double-click this file or run: .\start-frontend.ps1

Write-Host "Starting Admin Frontend..." -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✓ Found package.json" -ForegroundColor Green
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "Starting React development server..." -ForegroundColor Yellow
    Write-Host "The app will open at http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    npm start
} else {
    Write-Host "✗ ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure you're in the admin/4X4- directory" -ForegroundColor Yellow
    pause
}

