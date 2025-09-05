#!/bin/sh

echo "Running database migrations..."
if ! npm run db:migrate
then
  echo "Database migration failed. Exiting."
  exit 1
fi

exec "$@"
