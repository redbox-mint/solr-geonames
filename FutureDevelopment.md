Future Development
=====

During initial development the code was written with a specific purpose in mind. Sometimes we implemented features in a way where we new there was a more generic and/or flexible choice available, but the way chosen was fastest for our project.

Any ideas that came up in this light should be recorded here:

  * The various [boosting algorithms](BoostingResults.md) are currently implemented in source code. It would be more flexible if these were configurable. *NOTE:* Current trunk (ie. not in v1.0) has made country codes configurable. r39
  * [Mapping data](FieldMaps.md) from Geonames to Solr is at this stage is hard-coded into a Java Map at the top of the harvester. Also a couple of fields were skipped because they weren't relevant to our needs.
  * Currently 'batch' sizes are hard-coded into the source, and the loop is arbitrarily run to account for a dataset larger then the number of records in Geonames. This was mostly for convenience during development since it was trivial to tweak those two numbers to manipulate the amount of data ingested during a debug run.
  * There was some work started (and abandoned) on OpenSearch. This could be completed.

You'll note that most of the points above relate to configuration of features we hard-coded originally, but not all.
