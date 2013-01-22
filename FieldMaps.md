Field Maps
=====

At the top of the harvester code you'll find a Java Map indicating how data should map between the two systems:

```
/** Column mappings */
private static final Map<String, Integer> columns;
static {
    columns = new LinkedHashMap();
    columns.put("id",             0);
    columns.put("utf8_name",      1);
    columns.put("basic_name",     2);
    // Skip altername names     : 3    <== Only v1.0, trunk now supports
    columns.put("latitude",       4);
    columns.put("longitude",      5);
    columns.put("feature_class",  6);
    columns.put("feature_code",   7);
    columns.put("country_code",   8);
    // Skip other Country Codes : 9
    // Skip Admin Codes         : 10-13
    columns.put("population",     14);
    columns.put("elevation",      15);
    columns.put("gtopo30",        16);
    columns.put("timezone",       17);
    columns.put("date_modified",  18);
}
```

The Map keys contain the name of the Solr field to populate, and the Map value is the column index into the Geonames data (tab delimited file).

A side effect of this is that if the Geonames data ever changes format (for whatever reason) this Map will need to be adjusted.

The fields that have been skipped are below, along with reasons:
  * ~~Alternate names is a potentially huge field, particularly for country entries, where it seems that a huge number of entries are input here, containing the various regions/cities. This was unnecessary for our purposes~~. r39 added optional support for this to trunk.
  * Alternate country codes '`cc2`' could possibly be of use to some, although to index correctly in Solr it would need some extra parsing. For starters you'd need split the comma separated values, then remove the main country code. Finally you'd want to create a multi-valued field in the schema to populate.
  * We also ignored the four administrative codes entirely, since they weren't relevant to us.
