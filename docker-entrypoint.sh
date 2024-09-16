#!/bin/sh

# Print Docker DNS info
echo "Docker DNS settings:"
cat /etc/resolv.conf

# Print hosts file
echo "Hosts file contents:"
cat /etc/hosts

# Try to resolve 'db' hostname
echo "Attempting to resolve 'db' hostname:"
getent hosts db

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
max_retries=30
counter=0
while ! nc -z db 3306; do
  counter=$((counter + 1))
  if [ $counter -ge $max_retries ]; then
    echo "Error: MySQL is still not ready after $max_retries attempts. Exiting."
    exit 1
  fi
  echo "MySQL is not ready. Retrying in 5 seconds... (Attempt $counter/$max_retries)"
  sleep 5
done
echo "MySQL is ready"

# Test database connection
echo "Testing database connection..."
if npx prisma db push --skip-generate; then
    echo "Database connection successful"
else
    echo "Error: Failed to connect to the database. Exiting."
    exit 1
fi

# Run migrations
echo "Running database migrations..."
if npx prisma migrate deploy; then
    echo "Migrations completed successfully"
else
    echo "Error: Failed to run migrations. Exiting."
    exit 1
fi

# Seed the database
echo "Seeding the database..."
if npx prisma db seed; then
    echo "Database seeding completed successfully"
else
    echo "Error: Failed to seed the database. Exiting."
    exit 1
fi

# Start the application
echo "Starting the application..."
exec "$@"