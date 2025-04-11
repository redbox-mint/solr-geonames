#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script cleans up the dev docker containers.
# It also makes the preparations for the dev env.

docker compose -f ./support/docker-compose.dev.yml down

npm run compile:clean

npm run compile
