Search Interfaces
=====
At present there are two supported search functions: '`search`' and '`detail`', and there is an additional function '`debug`' which developers/designers may wish to use simply to explore data.

*Search* is intended for use in searching the systems using search terms, whilst the *detail* function will return specific Geonames data for a given ID.

The URL template is typically of the form:
```
/geonames/search?func={search|detail|debug}&format={html|json}&q={search terms}
```

Although additional, optional parameters are supported. A full list is below.

Parameters
=====

|| *Parameter* || *Default* || *Options* || *Notes* ||
|| `func` || N/A || `search`, `detail` or `debug` || Required parameter ||
|| `q` || N/A || Any search terms || Required parameter for '`search`' function ||
|| `id` || N/A || Any Geonames ID || Required parameter for '`detail`' function ||
|| `format` || `html` || `html` or `json` || Output format requested, see further notes below ||
|| `rows` || `20` || Any integer || Number of results to return per 'page' ||
|| `start` || `0` || Any integer || The row count to start at, typically for paging ||
|| `fq` || N/A || Any Solr query || The filter query to apply during search. Optional ||

Alternate Names
=====

r39 (in the old GoogleCode hosted codebase) adds to trunk support for searching on alternate names (if indexed). The parameter '`f`' needs to be the field '`alternate_names`' (no other field is currently supported) for this to work.

Additionally, results are currently limited to the '`JsonSearchResponse`' handler ([see doco](OpenSearch.md)).

Outputs
=====

It is worth noting that the outputs are decided based on a combination of '`format`' and '`function`', as per the OpenSearch design notes.

The '`json`' format results were intended for accessing by systems to run autocomplete features in a data entry form, so it returns a display string for use on screen, backed up by supplemental data for after the user has selected a result.

The '`html`' format is generally for trivial debugging/demonstration, since it mimics the very bare bones look of an autocomplete query directly against the server.

The '`debug`' *function* also happens to use '`html`' format (in fact it doesn't support '`json`'), but is intended for deeper interrogation of the index. It supports facets and filtering, but does not have any pagination implemented.
