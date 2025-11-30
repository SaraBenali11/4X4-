Param()

Write-Host "Stopping Docker Compose (PowerShell)..."

try {
  docker compose version > $null 2>&1
  $cmd = 'docker compose'
} catch {
  $cmd = 'docker-compose'
}

Invoke-Expression "$cmd down -v"
Write-Host "Stack stopped."
