#!/usr/bin/env bash

set -euo pipefail
set -o xtrace

# This script downloads data from the geonames website to the directory used by the local dev.

GEONAMES_DATA_NAME="AU"
#GEONAMES_DATA_NAME="allCountries"

TMP_DIR="support/.tmp-data"
mkdir -p "${TMP_DIR}"

# Location data
LOCATION_DATA_URL="https://download.geonames.org/export/dump/${GEONAMES_DATA_NAME}.zip"
LOCATION_DATA_ZIP="${TMP_DIR}/${GEONAMES_DATA_NAME}.zip"
LOCATION_DATA_FILE="${TMP_DIR}/${GEONAMES_DATA_NAME}.txt"
LOCATION_DATA_TARGET_FILE="${TMP_DIR}/geonamesMain.txt"
curl -C - -o "${LOCATION_DATA_ZIP}" -z "${LOCATION_DATA_ZIP}" "${LOCATION_DATA_URL}"

# unzip the data file
unzip -u "${LOCATION_DATA_ZIP}" -d "${TMP_DIR}"

# move the data file
mv "${LOCATION_DATA_FILE}" "${LOCATION_DATA_TARGET_FILE}"
chmod +r "${LOCATION_DATA_TARGET_FILE}"

# Feature classes and codes
FEATURE_CODES_URL="https://download.geonames.org/export/dump/featureCodes_en.txt"
FEATURE_CODES_PATH="${TMP_DIR}/featureCodes_en.txt"
curl -C - -o "${FEATURE_CODES_PATH}" -z "${FEATURE_CODES_PATH}" "${FEATURE_CODES_URL}"

# Country info
COUNTRY_INFO_URL="https://download.geonames.org/export/dump/countryInfo.txt"
COUNTRY_INFO_PATH="${TMP_DIR}/countryInfo.txt"
curl -C - -o "${COUNTRY_INFO_PATH}" -z "${COUNTRY_INFO_PATH}" "${COUNTRY_INFO_URL}"

# Admin 1 codes
ADMIN1_CODES_URL="https://download.geonames.org/export/dump/admin1CodesASCII.txt"
ADMIN1_CODES_PATH="${TMP_DIR}/admin1CodesASCII.txt"
curl -C - -o "${ADMIN1_CODES_PATH}" -z "${ADMIN1_CODES_PATH}" "${ADMIN1_CODES_URL}"
