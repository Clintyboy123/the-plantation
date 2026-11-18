#!/usr/bin/env bash
# Runs ON THE VPS, called by GitHub Actions after it has built and pushed new images.
#   ./deploy/deploy.sh <frontend-image> <backend-image>
# e.g. ./deploy/deploy.sh ghcr.io/<owner>/<repo>-frontend:sha-3f2a1bc ghcr.io/<owner>/<repo>-backend:sha-3f2a1bc
#
# What it does, in order:
#   1. backs up the database and uploads (migrations run on start, so always back up first)
#   2. writes the new image names into .env (so manual docker compose commands use the same version)
#   3. pulls the images and restarts the stack
#   4. waits until all three containers are healthy
#   5. if they are not healthy in time: puts the previous images back and restarts (automatic rollback)
#   6. removes old images and backups older than the last 14
set -euo pipefail

cd "$(dirname "$0")/.."

NEW_FRONTEND="${1:?Usage: deploy.sh <frontend-image> <backend-image>}"
NEW_BACKEND="${2:?Usage: deploy.sh <frontend-image> <backend-image>}"
KEEP_BACKUPS=14

[ -f .env ] || { echo "No .env in $(pwd). Create it from .env.example first."; exit 1; }

set_env() { # set_env KEY VALUE: replace the line, or add it (works the same on Linux and macOS)
  local tmp; tmp="$(mktemp)"
  awk -v k="$1" -v v="$2" 'BEGIN { done = 0 }
    index($0, k "=") == 1 { print k "=" v; done = 1; next }
    { print }
    END { if (!done) print k "=" v }' .env > "$tmp"
  cat "$tmp" > .env && rm -f "$tmp"   # cat keeps the file's owner and permissions
}
get_env() { grep -E "^$1=" .env | tail -1 | cut -d= -f2- || true; }

all_healthy() {
  local ids healthy
  ids="$(docker compose ps -q frontend backend database)"
  [ "$(echo "$ids" | grep -c .)" -eq 3 ] || return 1
  healthy="$(echo "$ids" | xargs docker inspect -f '{{.State.Health.Status}}' | grep -c '^healthy$')"
  [ "$healthy" -eq 3 ]
}

wait_healthy() {
  for _ in $(seq 1 "${HEALTH_TRIES:-60}"); do # 5s apart: up to 5 minutes (first start of MySQL is slow)
    if all_healthy; then return 0; fi
    sleep 5
  done
  return 1
}

PREV_FRONTEND="$(get_env FRONTEND_IMAGE)"
PREV_BACKEND="$(get_env BACKEND_IMAGE)"

# 1. Backup (skipped on the very first deploy, when there is no database yet)
mkdir -p backups
STAMP="$(date +%F-%H%M%S)"
if [ -n "$(docker compose ps -q database 2>/dev/null)" ]; then
  echo "Backing up database and uploads ($STAMP)..."
  # If a backup fails, remove the half-written file and stop before anything is changed.
  docker compose exec -T database sh -c 'exec mysqldump --single-transaction --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
    | gzip > "backups/db-$STAMP.sql.gz" \
    || { rm -f "backups/db-$STAMP.sql.gz"; echo "Database backup failed: nothing was changed."; exit 1; }
  # A one-off container with the uploads volume attached: works even if the backend is down or crash-looping.
  docker compose run --rm --no-deps -T --entrypoint tar backend -czf - -C /app uploads > "backups/uploads-$STAMP.tar.gz" \
    || { rm -f "backups/uploads-$STAMP.tar.gz"; echo "Uploads backup failed: nothing was changed."; exit 1; }
else
  echo "No database running yet (first deploy): nothing to back up."
fi

# 2 + 3. New images in, restart
set_env FRONTEND_IMAGE "$NEW_FRONTEND"
set_env BACKEND_IMAGE "$NEW_BACKEND"
echo "Pulling $NEW_FRONTEND and $NEW_BACKEND..."
docker compose pull frontend backend database

# 4. Start and health gate. "up" itself fails when the backend never turns healthy (the frontend waits
#    for it), so a failed "up" counts as an unhealthy deploy and goes to the rollback below.
if docker compose up -d --no-build --remove-orphans && wait_healthy; then
  echo "Deployed and healthy."
else
  echo "The new version did not become healthy. Recent logs:"
  docker compose logs --tail=60 backend frontend || true

  # 5. Rollback to the previous images, if there were any
  if [ -n "$PREV_FRONTEND" ] && [ -n "$PREV_BACKEND" ]; then
    echo "Rolling back to $PREV_FRONTEND and $PREV_BACKEND..."
    set_env FRONTEND_IMAGE "$PREV_FRONTEND"
    set_env BACKEND_IMAGE "$PREV_BACKEND"
    if docker compose up -d --no-build --remove-orphans && wait_healthy; then
      echo "Rolled back: the previous version is live again."
      echo "If a database migration caused the failure, restore backups/db-$STAMP.sql.gz (see README)."
    else
      echo "Rollback is not healthy either. Check: docker compose logs"
    fi
  fi
  exit 1
fi

# 6. Tidy up
docker image prune -f >/dev/null
prune_backups() { # keep the newest $KEEP_BACKUPS files matching a pattern; no match is fine
  local old
  old="$(ls -1t backups/$1 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) || true)"
  [ -z "$old" ] || echo "$old" | while IFS= read -r f; do rm -f "$f"; done
}
prune_backups 'db-*.sql.gz'
prune_backups 'uploads-*.tar.gz'
echo "Done."
