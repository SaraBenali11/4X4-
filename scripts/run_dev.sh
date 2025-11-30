#!/usr/bin/env bash
set -euo pipefail

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD='docker compose'
elif docker-compose version >/dev/null 2>&1; then
  COMPOSE_CMD='docker-compose'
else
  echo 'docker compose not found. Please install Docker and Docker Compose.'
  exit 1
fi

echo "Starting dev stack (MySQL + backend + frontend)..."
${COMPOSE_CMD} up --build -d
echo "All services started. Backend: http://localhost:5000; Frontend: http://localhost:3000"
