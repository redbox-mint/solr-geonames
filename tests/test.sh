#!/usr/bin/env bash

set -exuo pipefail

FILE_NAME='SM'
ZIP_PATH="${FILE_NAME}.zip"
DATA_PATH="${FILE_NAME}.txt"
DOWNLOAD_URL="https://download.geonames.org/export/dump/${ZIP_PATH}"

# download the data zip file
curl -o "${ZIP_PATH}" -z "${ZIP_PATH}" "${DOWNLOAD_URL}"

# unzip the data file
unzip -u "${ZIP_PATH}"
chmod +r "${DATA_PATH}"

# build the docker image
docker build -t qcifengineering/solr-geonames-indexer:local ../.

# run docker compose
docker compose -f docker-compose.yml up --abort-on-container-exit --exit-code-from solr-geonames

# start containers
docker compose -f docker-compose.yml up -d

# get the schema
# curl http://localhost:8983/solr/solr-geonames/schema | grep geonameid

# example query
curl "http://localhost:8983/solr/solr-geonames/query?q=name:Factory"

docker compose -f docker-compose.yml down -v
