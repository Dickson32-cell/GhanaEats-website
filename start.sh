#!/bin/bash
cd server

# Write DATABASE_URL from Render env into .env file for Prisma CLI
echo "DATABASE_URL=$DATABASE_URL" > .env
echo "JWT_SECRET=$JWT_SECRET" >> .env
echo "PORT=$PORT" >> .env
echo "NODE_ENV=$NODE_ENV" >> .env

echo "=== Creating database tables ==="
npx prisma db push --accept-data-loss

echo "=== Seeding Ghana menu ==="
node seed-ghana-menu.js

echo "=== Starting server ==="
node server.js