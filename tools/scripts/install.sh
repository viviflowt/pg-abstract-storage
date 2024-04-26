#!/bin/bash
set -e

node tools/scripts/preinstall.js

pnpm install
pnpm prune

pnpm add -D ~/.npm/_packages/*.tgz
