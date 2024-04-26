#!/bin/bash
set -e

rm -rf dist &>/dev/null || true

pnpm run typeorm schema:drop
pnpm run typeorm schema:sync

# pnpm run seed
