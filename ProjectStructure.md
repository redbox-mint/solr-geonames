Details
=====
The top-level of this Project is simply an empty shell containing the two related Projects as modules. So building the top-level Project is a waste of time.

The *Harvester* Project is designed to ingest a Geonames data dump and build a Solr index.

The *Server* Project is designed to created a simple Java Servlet running off the created Solr index. _IF_ you want to run a [DeveloperInstall dev server] from Maven you will want to copy the Solr index data from the harvester to the server, or modify the start script to point at the harvester's index.

History
=====
When this project was first set up, there were hopes that the end result would be a single WAR artefact distributed from a Maven repository containing all the index data and configuration together (for a particular ['boost' build](BoostingResults.md) anyway). ie. The 'Australian' artefact.

However, given the size of the Solr index we ended up with it was felt that distributing that much binary data via Maven was a little crude, so the Project structure we ended up with might look a little odd.

Ideally the top-level Project would have been responsible for:
  * building the harvester
  * downloading the Geonames data dump
  * running the harvester
  * building the server
  * bundling the harvester's index with the server

Of course, this never resulted... but if anyone wants to do this sort of thing it should be possible with the current Project layout. The result would be an ~3GB WAR file that you can use in projects and simply 'unpack' from Maven to get you index data on disk.
