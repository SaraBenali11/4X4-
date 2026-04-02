Param()

Write-Host "Starting Docker Compose (PowerShell)..."

$composeCmd = (Get-Command -Name 'docker' -ErrorAction SilentlyContinue)
if (-not $composeCmd) {
  Write-Error "Docker is not installed or not on PATH. Please install Docker Desktop."
  exit 1
}

# Use 'docker compose' if available
try {
  docker compose version > $null 2>&1
  $cmd = 'docker compose'
} catch {
  $cmd = 'docker-compose'
}

Invoke-Expression "$cmd up --build -d"

# Wait for backend
$timeout = 120
$start = Get-Date
while ((Get-Date) - $start).TotalSeconds -lt $timeout {
  try {
    $response = Invoke-RestMethod -Uri http://localhost:5000/api/health -UseBasicParsing -TimeoutSec 2
    if ($response.status -eq 'success') { Write-Host 'Backend healthy'; break }
  } catch {
  }
  Start-Sleep -Seconds 2
}

if ((Get-Date) - $start).TotalSeconds -ge $timeout {
  Write-Error 'Backend did not become healthy in time'; Invoke-Expression "$cmd logs"; exit 1
}

Write-Host 'Running Python integration tests...'
Invoke-Expression 'python -m pytest src/backend/tests/integration_test.py -q'

Write-Host 'Tearing down Docker Compose...'
Invoke-Expression "$cmd down -v"
Write-Host 'Integration tests complete.'
