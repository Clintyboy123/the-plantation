#!/bin/sh
# Runs every time the backend container starts:
# 1. wait until the database accepts connections
# 2. apply any database migrations that have not been applied yet
# 3. start the API
# If a migration fails the container stops, so a half-migrated site never goes live.
set -e

echo "Waiting for the database..."
node src/utils/waitForDatabase.js

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running database migrations..."
  ./node_modules/.bin/sequelize-cli db:migrate
fi

# exec hands the process over to Node so Docker's stop signal reaches it directly.
exec node src/server.js
