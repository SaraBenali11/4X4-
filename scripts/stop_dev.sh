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

echo "Stopping dev stack..."
${COMPOSE_CMD} down -v
echo "Stack stopped."
