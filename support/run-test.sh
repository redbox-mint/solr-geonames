#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script runs the mocha tests in the docker container.

docker compose \
  -f ./support/docker-compose.dev.yml \
  -f ./support/docker-compose.test.yml up \
  --menu=false \
  --remove-orphans \
  --abort-on-container-exit \
  --exit-code-from solr-geonames
