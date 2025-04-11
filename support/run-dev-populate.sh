#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script creates and populates the solr index from the geonames raw data in test/example-data.

docker compose -f ./support/docker-compose.populate.yml up \
  --menu=false \
  --remove-orphans \
  --abort-on-container-exit \
  --exit-code-from solr-geonames || true
docker compose -f ./support/docker-compose.populate.yml down
