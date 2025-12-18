# PowerShell script to quickly check backend endpoints
# Run from src/backend: .\check_routes.ps1

$base = "http://localhost:5000"

Write-Host "Testing backend endpoints at $base"

# Health
Write-Host "\nChecking /api/health"
try {
    $health = Invoke-RestMethod -Uri "$base/api/health" -Method Get -ErrorAction Stop
    Write-Host "Health endpoint response:" -ForegroundColor Green
    $health | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "Failed to call /api/health:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Products
Write-Host "\nChecking /api/products"
try {
    $products = Invoke-RestMethod -Uri "$base/api/products" -Method Get -ErrorAction Stop
    if ($products -and $products.count) {
        Write-Host "Products returned count:" $products.count -ForegroundColor Green
    } else {
        Write-Host "Products endpoint responded but returned no data or unknown shape." -ForegroundColor Yellow
        $products | ConvertTo-Json -Depth 5 | Write-Host
    }
} catch {
    Write-Host "Failed to call /api/products:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "\nDone."