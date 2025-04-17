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
The fields are in ascii English, except for `utf8_name`, which can be in English or the language of the area.

- basic_name: The stored identifier.
- title: The basic title of the location.
- latitude: latitude in decimal degrees (wgs84).
- longitude: longitude in decimal degrees (wgs84).
- feature_class_name: The name of the feature class.
- feature_code_name: The name of the feature code.
- country_name: The country name.
- subdivision_name: The subdivision names.
- display_title: The displayed title

The `display_title` should be used for displaying the location.
The `basic_name` should be used for storing the location.

The display title field is built from these fields, to try to make it unique.

It is a best-effort unique, not guaranteed.

The fields that might be used to construct the display title are:
- feature_class_name
- feature_code_name
- country_name
- subdivision_name

## ReDBox config

The geonames lookup is usually used in a vocab field.

Here are two configuration approaches.

- sourceType: This indicates how to obtain the 'vocabulary' / 'autocomplete' items.
- provider: This indicates where to look for the configuration.

For the 'external' sourceType and 'geonames' provider:

- resultArrayProperty: This is the dotted path to extract from the response.
- titleFieldName: This is the property to use for the 'value' / 'internal' name of each available option.
- titleFieldArr: This is the array of fields to use to build the displayed title.
- titleFieldDelim: This is the separator to use between the field values to build the displayed title.

Show the full display title as the options, then the basic name as the selected option.

```json
{
  "class": "VocabField",
  "definition": {
    "disableEditAfterSelect": false,
    "sourceType": "external",
    "provider": "geonames",
    "resultArrayProperty": "response.docs",
    "titleFieldName": "basic_name",
    "titleFieldArr": [
      "display_title"
    ],
    "fieldNames": [
      "basic_name",
      "latitude",
      "longitude"
    ],
    "stringLabelToField": "basic_name"
  }
}
```

Another approach: show the basic names as the options and the selected option.

```json
{
  "class": "VocabField",
  "definition": {
    "disableEditAfterSelect": false,
    "sourceType": "external",
    "provider": "geonames",
    "resultArrayProperty": "response.docs",
    "titleFieldName": "basic_name",
    "titleFieldArr": [
      "basic_name"
    ],
    "fieldNames": [
      "basic_name",
      "latitude",
      "longitude"
    ],
    "stringLabelToField": "basic_name"
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
time npm run dev:populate

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
