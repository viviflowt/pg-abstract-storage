#!/bin/bash
set -e
set -x
set -o pipefail

clear

rm -rf dist &>/dev/null || true
rm -rf node_modules &>/dev/null || true
rm -rf pnmp-lock.yaml &>/dev/null || true

# pnpm run dev

pnpm install

# https://docs.parcelvoy.com/
