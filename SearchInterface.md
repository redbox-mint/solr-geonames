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

<table>
<tr><th> Parameter </th><th> Default </th><th> Options </th><th> Notes </th></tr>
<tr><td> `func` </td><td> N/A </td><td> `search`, `detail` or `debug` </td><td> Required parameter </td></tr>
<tr><td> `q` </td><td> N/A </td><td> Any search terms </td><td> Required parameter for '`search`' function </td></tr>
<tr><td> `id` </td><td> N/A </td><td> Any Geonames ID </td><td> Required parameter for '`detail`' function </td></tr>
<tr><td> `format` </td><td> `html` </td><td> `html` or `json` </td><td> Output format requested, see further notes below </td></tr>
<tr><td> `rows` </td><td> `20` </td><td> Any integer </td><td> Number of results to return per 'page' </td></tr>
<tr><td> `start` </td><td> `0` </td><td> Any integer </td><td> The row count to start at, typically for paging </td></tr>
<tr><td> `fq` </td><td> N/A </td><td> Any Solr query </td><td> The filter query to apply during search. Optional </td></tr>
</table>

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
