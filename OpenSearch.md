Introduction
=====
[OpenSearch integration](http://www.opensearch.org/Home) was another one of those features we'd earmarked for inclusion during initial development.

During implementation however it was realised that the system we were integrating with didn't really use most of the `OpenSearch` spec, it just submitted searches to an expected interface.

We decided to drop the feature for this reason, mostly because we didn't want to find a third system for debugging, simply to ensure a feature we didn't *need* was functioning correctly.

Considerations
=====
There are however some design elements left over with `OpenSearch` in mind, so they are mentioned here should anyone want to include them [in future](FutureDevelopment.md).

The search description documents will sit (and did sit) quite happily alongside the `index.html` document in the webapps directory, then you just add `<link/>` elements to your HTML.

Internally the code is structured to assume that a variety of functions and formats are supported. So much so that you will still find the `OpenSearchResponse` Interface is required to be implemented by search response objects.

Basically, the response objects each implement a defined function ('search' or 'detail') in combination with a response format ('html' or 'json'):
  * `HtmlSearchResponse`: respond to a search in HTML format.
  * `JsonSearchResponse`: respond to a search in JSON format.
  * `HtmlDetailResponse`: respond to a detail request in HTML format.
  * `JsonDetailResponse`: respond to a detail request in JSON format.

Notably absent is the XML format... the core of the `OpenSearch` spec, since we are integrating with a system that doesn't use it.

We also had a 'suggest' function, implementing the [OpenSearch Suggestions Extensions](http://www.opensearch.org/Specifications/OpenSearch/Extensions/Suggestions/1.1) to drive the autocomplete fields, but our other system doesn't use this either.

Ultimately however, the setup of the system at this point should make it fairly simple to add these extras outputs if desired.

Flexibility
=====
One possible improvement might be to enhance the `OpenSearchResponse` interface to have each valid implementation return the function and format they support. eg. `getFunction()` and `getFormat()`.

That way you could load them using the `ServiceLoader` and remove the hardcoded mapping to response objects in the Servlet.
