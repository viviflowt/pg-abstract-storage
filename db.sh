#!/bin/bash
set -e

pnpm run typeorm schema:drop

pnpm run typeorm schema:sync
