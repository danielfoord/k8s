#!/bin/bash
set -e

echo "Current working directory: $(pwd)"
echo "Listing prisma directory contents:"
ls -la prisma/

# Wait for database to be ready
echo "Waiting for database to be ready..."
# ./wait-for-it.sh db:5432 -t 60

# Debug: Show environment variables (excluding sensitive data)
echo "DATABASE_URL configuration (hiding credentials):"
echo $DATABASE_URL | sed 's/:[^:]*@/:****@/'

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Generate Prisma Client (in case of any changes)
echo "Regenerating Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "Migration complete. Starting application..."

# Start the application
exec "$@"