#!/bin/bash
cd server

# Write .env file for Prisma CLI (it reads from .env, not process.env)
# Use Render env vars if available, otherwise use the internal DB URL
DB_URL="${DATABASE_URL:-postgresql://ghana_eats_db_user:tcs1XO8cOXmq2PkgN16pSJxerOIoazX2@dpg-d9ikps3tqb8s7391j2ag-a/ghana_eats_db}"
JWT="${JWT_SECRET:-ghana-eats-jwt-2026-ramedic}"
PORT_VAL="${PORT:-10000}"

echo "DATABASE_URL=$DB_URL" > .env
echo "JWT_SECRET=$JWT" >> .env
echo "PORT=$PORT_VAL" >> .env
echo "NODE_ENV=production" >> .env
echo "CLIENT_URL=" >> .env

echo "=== Environment configured ==="
echo "Database URL length: ${#DB_URL}"

echo "=== Creating database tables ==="
npx prisma db push --accept-data-loss

echo "=== Seeding Ghana menu ==="
node seed-ghana-menu.js

echo "=== Starting server ==="
node server.js