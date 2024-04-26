#!/bin/bash
set -e
set -x
set -o pipefail

clear

rm -rf dist &>/dev/null || true

pnpm run dev

# FusionAuth
# username=admin@sandbox.io
# password=password
# UI: http://localhost:9011/admin
# API: http://localhost:9011/api

# "seed": "npx ts-node -r tsconfig-paths/register tools/database/seed/seed.ts",
# user@tenant1.com

# httpbin: http://localhost:8080/
