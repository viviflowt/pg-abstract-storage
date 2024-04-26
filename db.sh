#!/bin/bash
set -e

# rm -rf ./drizzle &>/dev/null || true

# pnpm run generate

pmpm run typeorm schema:drop
pnpm run typeorm schema:sync

# pnpm run seed
