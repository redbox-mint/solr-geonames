#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script removes the solr index and data so it can be populated from scratch.

docker volume rm solr-geonames-dev_data-solr || true
