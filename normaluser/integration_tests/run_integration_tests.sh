#!/usr/bin/env bash
set -euo pipefail

# Start docker compose, run tests, and tear down
COMPOSE_PROJECT_NAME=sutraty_integration
export COMPOSE_PROJECT_NAME

echo "Starting docker-compose..."
# detect compose binary: prefer 'docker compose' (plugin), fall back to 'docker-compose' if needed
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif docker-compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "docker compose or docker-compose is required"; exit 1
fi

${COMPOSE_CMD} up -d --build

echo "Waiting for backend to be healthy..."
timeout=120
start=$SECONDS
until curl -sS -o /dev/null -w "%{http_code}" http://localhost:5000/api/health | grep -q 200; do
  sleep 2
  if (( SECONDS - start >= timeout )); then
    echo "Backend did not become healthy in time"; ${COMPOSE_CMD} logs; exit 1
  fi
done

echo "Backend is healthy. Running integration tests..."
python -m pytest src/backend/tests/integration_test.py -q

echo "Integration tests finished; tearing down..."
${COMPOSE_CMD} down

echo "Integration tests complete."
