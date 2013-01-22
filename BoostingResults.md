Introduction
=====
Currently there are two areas where boosting is implemented:
 * The *harvester* performs boosting against any record matching the desired country code, as well as giving a boost to populated places (feature code: 'PPL`*`').
 * The *server* performs search-time boosting based on exact or left-anchored matches.

_The [FutureDevelopment future development page] has this listed as an area that should be more configurable, but for now the details below are built into the source code... although it's not too onerous to change._

*NOTE:* in v1.0 the country code is 'AU': Australia, but in trunk it is now configurable (r39). The documentation continues to reference Australia below, but whatever country/countries you have configured will apply. 

Harvester
=====
One of the intentions of this Project is to provide a Geonames data feed to a form control running a jQuery autocomplete dropdown. Because of how tight the user interface is there, we want the Solr relevancy rankings to suggest the most relevant data as a priority.

To that end we apply two boosts to documents at index-time:
  # Our client is located in Australia, so we want to give a boost to Australian locations. We give a '`^5`' boost in this case.
  # We also want populated places to be slightly more important, ie. cities, towns etc., so we give a '`^2`' to these records.

The boosts are multiplicative, so we end up with four tiers of documents in the index:
  # Populated, Australian locations have a boost of `^10`.
  # Australian locations (non-populated) have a boost of `^5`.
  # Other populated locations of the world have a boost of `^2`.
  # Everything else has no boost (ie. an innate `^1`).

It is also worth noting that as per many [http://lucene.472066.n3.nabble.com/Boost-with-wildcard-tp486327p486330.html posts on the Solr mailing list] document level boosting does not function when you are performing wildcard queries (which we do, given the autocomplete feature).

To get around this we use the workaround suggested in the above link and instead apply the boost as a *field boost* to the field '`boost`'. Then in the server below you'll note we always include 'boost:boost' in a query. So the net effect is that every document in the index has this field with the same value in it, providing an equal search score, allowing the boost to provide all the distinction.

Server
=====
Combined with the above boosts performed at index-time, we also have a search-time algorithm for ensuring that the best _term_ based matches are factored into the equation as well.

There are three fields of relevance:
  * `basic_name`: A standard Solr tokenized field field. This is considered mostly a fallback if there are no exact matches.
  * `basic_name_str`: A basic string version of above used to find left-anchored matches. ie. 'starts with'.
  * `basic_name_rev`: A reversed version of of the string name. This is an old Solr trick for exact match handling. Searches cannot start with a wildcard, so you reverse the search term and search against a reversed field. ie. 'ends with'.

The algorithm is put together thusly:
```
String rev = new StringBuffer(q).reverse().toString();
// Perfect matches win
String both = "(basic_name_str:("+q+"*) AND basic_name_rev:("+rev+"*))";
// Then left-anchored matches
String left = "(basic_name_str:("+q+"*))";
// Then anything else
String name = "(basic_name:("+q+"*) OR basic_name:("+q+"))";
// Now some hardcoded boosting as we put it together
String boost = "boost:boost^10";
return "("+both+"^10 OR "+left+"^4 OR "+name+")^0.2"+" AND "+boost;
```

So for search-time boosting we have three tiers:
  # Exact matches ('starts with' and 'ends with' both _hit_): `^10`.
  # Starts with matches: `^4`.
  # Normal Solr search matches: `^1` (no boost).

Now from there it's a matter of balancing the index-time and search-time boosting to get the result set desired. This isn't an exact science, especially since Solr is also adding in subtle effects of its own based on internal algorithms (these are configurable, but complicated, so we've left them alone... and we don't necessarily want to get rid of them either).

After quite a few sample searches we settled on some weightings that provided us with a nice constant blend of relevancy scores from top to bottom:
```
(search-time)^0.2 AND (index-time)^10
```
