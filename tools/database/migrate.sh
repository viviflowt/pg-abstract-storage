#!/bin/bash
set -e

MIGRATIONS_DIR="src/assets/database/migrations"

mkdir -p $MIGRATIONS_DIR
rm -rf $MIGRATIONS_DIR/*

name=$1

if [ -z $name ]; then
  echo "Please provide a name for the migration"
  exit 1
fi

npm run typeorm migration:generate \
  --pretty \
  $MIGRATIONS_DIR/$name

npx prettier --write $MIGRATIONS_DIR/*.ts &>/dev/null
