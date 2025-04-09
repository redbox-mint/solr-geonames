#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script runs the dev environment.

docker compose -f ./support/docker-compose.dev.yml build
docker compose -f ./support/docker-compose.dev.yml up \
  --menu=false \
  --remove-orphans \
  --abort-on-container-exit \
  --exit-code-from solr
