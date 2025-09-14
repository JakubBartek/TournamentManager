#!/bin/sh
set -e

# Ensure prisma client / migrations are generated/applied against runtime DB
echo "Running prisma generate..."
npx prisma generate

if echo "$DATABASE_URL" | grep -q '^file:'; then
  dbpath=$(echo "$DATABASE_URL" | sed -E 's/^file:(.*)$/\1/')
  dbdir=$(dirname "$dbpath")
  mkdir -p "$dbdir"
fi

echo "Applying migrations..."
npx prisma migrate deploy || true

exec "$@"