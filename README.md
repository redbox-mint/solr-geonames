# ReDBox location service

Built using [geonames](https://download.geonames.org/export/) 
indexed by [Apache Solr](https://solr.apache.org/).


## Overview

The geonames service is used for autocomplete of place names.

These are the use cases:

1. Select any place

- Allow selection of any place in the world
- In English
- The autocomplete options should be distinguishable
- The value stored is basic_name, latitude, longitude

2. Select any country

- Allow selection of any country
- In English
- The autocomplete options should be distinguishable
- The value stored is basic_name, latitude, longitude


## Implementation

The solr index includes these fields.
The fields are in English, except for `basic_name`, which is an identifier.

- basic_name: The stored identifier.
- title: The displayed title.
- latitude: latitude in decimal degrees (wgs84).
- longitude: longitude in decimal degrees (wgs84).
- location_name: The name of the location.
- feature_class_name: The name of the feature class.
- feature_code_name: The name of the feature code.
- country_name: The country name.
- subdivision_name: The subdivision names.

The `title` should be used for displaying the location.
The `basic_name` should be used for storing the location.

These two fields are built from these fields, to try to make both fields unique.

It is a best-effort unique, not guaranteed.

The fields that might be used to construct these two fields are:
- location_name
- feature_class_name
- feature_code_name
- country_name
- subdivision_name

## ReDBox config

Use the geonames query like this:

```json
{
  "class": "VocabField",
  "definition": {
    "disableEditAfterSelect": false,
    "provider": "geonames",
    "sourceType": "external",
    "titleFieldName": "title",
    "titleFieldArr": [
      "basic_name"
    ],
    "fieldNames": [
      "basic_name",
      "latitude",
      "longitude"
    ],
    "stringLabelToField": "basic_name",
    "resultArrayProperty": "response.docs"
  }
}
```

## Backward Compatibility

The existing ReDBox fields show the 'basic_name' as the options,
and also store the basic_name as the value.

The basic_name is not unique - it is the name used for a variety of
types of places (feature classes and codes).

This means that after the options and values gain more information,
existing stored data cannot be matched to single item.

This should be ok, as the selection is not tied to the autocompelete options,
the stored value will remain until a new option is chosen from the new 
autocomplete options that have more information.


## Development and Testing

To run tests:

```shell
# Run the mocha tests
npm run test

# remove the mocha test output
npm run test:clean

# remove the solr data, so the next test run can start from a known point
npm run data:destroy
```

To run local development:

```shell
# start the solr and nginx servers
npm run dev

# In another terminal:

# This will download the geonames data files if they aren't already present
npm run data:download

# run solr-geonames to populate the solr index
npm run dev:populate

# stop the solr and nginx servers
npm run dev:clean

# (optional) remove the solr data, so the next dev run can start from a known point
npm run data:destroy
```

To clean up the local data:

```shell
# This will remove all the dev data, except the geonames data files
# If you want new geonames data files, remove the existing files manually and then run `npm run data:download`
npm run data:destroy
```
