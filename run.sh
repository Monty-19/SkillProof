#!/bin/bash
set -e

echo "Starting SkillProof Full-Stack Services..."

# 1. Terminate any previous instances cleanly
pkill -f "uvicorn app.main:app" || true
pkill -f "vite --host" || true
sleep 1

# 2. Start FastAPI Backend on port 8001
echo "Starting FastAPI Backend on port 8001..."
cd /app/applet/backend
PYTHONPATH=/app/applet/backend python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for Backend to become healthy..."
until curl -s http://127.0.0.1:8001/health > /dev/null 2>&1; do
    sleep 1
done
echo "Backend is live and healthy!"

# 3. Start Vite Frontend on port 3000
echo "Starting Vite Frontend on port 3000..."
cd /app/applet/frontend
exec npm run dev -- --host 0.0.0.0 --port 3000
