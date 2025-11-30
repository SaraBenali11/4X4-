Param()

Write-Host "Starting Docker Compose (Windows PowerShell)..."

try {
  docker compose version > $null 2>&1
  $cmd = 'docker compose'
} catch {
  $cmd = 'docker-compose'
}

Invoke-Expression "$cmd up --build -d"
Write-Host "All services started. Backend: http://localhost:5000; Frontend: http://localhost:3000"
