#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script cleans up the containers, output, and data from the mocha tests.
# It also makes the preparations for the mocha tests.

docker compose -f ./support/docker-compose.dev.yml -f support/docker-compose.test.yml down

npm run test:compile:clean

rm -rf support/junit || true
mkdir -p support/junit

npm run test:compile
