#!/usr/bin/env bash
# Builds the production Docker stack and checks that the pieces talk to each other.
# Run from the project root:   ./scripts/smoke-test.sh
# It leaves the stack running afterwards. Stop it with:   docker compose down
set -uo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on this machine, so the production stack cannot be tested here."
  exit 2
fi
if [ ! -f .env ]; then
  echo "No .env file. Create it first:   cp .env.example .env   (then fill it in)"
  exit 2
fi

PORT="$(grep -E '^FRONTEND_PORT=' .env | tail -1 | cut -d= -f2 | tr -d '"'"'"' ')"
BASE="http://127.0.0.1:${PORT}"
PASS=0
FAIL=0

check() { # check "description" command...
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "  PASS  $label"; PASS=$((PASS + 1))
  else
    echo "  FAIL  $label"; FAIL=$((FAIL + 1))
  fi
}

status_of() { curl -s -o /dev/null -w '%{http_code}' "$1"; }
type_of() { curl -s -o /dev/null -w '%{content_type}' "$1"; }
# "docker compose port" prints nothing, or ":0", when a container port is not published on the host.
not_published() { local p; p="$(docker compose port "$1" "$2" 2>/dev/null)"; [ -z "$p" ] || [ "${p##*:}" = "0" ]; }
health_ok() { curl -fsS "$BASE/api/health" | grep -q '"database":"connected"'; }

echo "Building and starting the stack (first run takes a few minutes)..."
if ! docker compose up -d --build --wait; then
  echo "The stack did not come up healthy. Last log lines:"
  docker compose logs --tail 40
  exit 1
fi

echo "Checking $BASE"
check "migrations ran without error" \
  bash -c 'docker compose logs backend | grep -q "Running database migrations" && ! docker compose logs backend | grep -q "ERROR:"'
check "home page is served (200, HTML)" \
  bash -c "[ \"$(status_of "$BASE/")\" = 200 ] && [[ \"$(type_of "$BASE/")\" == text/html* ]]"
check "React Router: a deep link survives a refresh (200, HTML)" \
  bash -c "[ \"$(status_of "$BASE/some/deep/page")\" = 200 ] && [[ \"$(type_of "$BASE/some/deep/page")\" == text/html* ]]"
check "API reachable through Nginx, database connected" health_ok
check "unknown API route returns a JSON 404, not the React app" \
  bash -c "[ \"$(status_of "$BASE/api/does-not-exist")\" = 404 ] && [[ \"$(type_of "$BASE/api/does-not-exist")\" == application/json* ]]"
check "backend is not published on the host" \
  not_published backend 3000
check "database is not published on the host" \
  not_published database 3306
check "frontend port is bound to 127.0.0.1 only" \
  bash -c 'docker compose port frontend 80 | grep -q "^127\.0\.0\.1:"'

echo "Rebuilding the backend alone (checks that Nginx finds the new container)..."
docker compose up -d --build --force-recreate --wait backend >/dev/null 2>&1
sleep 12
check "API still reachable after the backend was recreated" health_ok

echo "Restarting everything (checks the database survives a restart)..."
docker compose restart >/dev/null 2>&1
docker compose up -d --wait >/dev/null 2>&1
check "API and database healthy after a full restart" health_ok

echo
echo "$PASS passed, $FAIL failed."
echo "Not covered here: this site's own features and whether its saved data is still there after a restart. Test those by hand."
[ "$FAIL" -eq 0 ]
