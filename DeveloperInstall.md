Developer Installation
=====

The example focuses on Windows since this is the laptop it was first built on, although Maven is platform neutral and basic migration of the batch scripts should be trivial. For other environments, there should be appropriate shell scripts of the same name beside the batch scripts.

 1. The build process requires [Maven](http://maven.apache.org/). Make sure you have it installed.
 1. Check out the code.
 1. From the '`root`' of the project go into the '`harvester`' directory and run Maven to build the Harvester JAR:
```
cd trunk/harvester
mvn clean install
```
 1. Download the FULL Geonames [data dump](http://download.geonames.org/export/dump/allCountries.zip) (~200MB).
 1. Unzip the Geonames data in your '`harvester`' directory, resulting ~900MB '`allCountries.txt`'.
 1. (Skip if using v1.0) Before you run the next step, consider whether you you want to use optional paramaters: '`--withAlternateNames`' and '`--countryIdsToBoost:AU,FR`' (just an example, insert your own country code)
 1. Run the '`harvest.bat`' file to build your Solr index. It takes maybe an hour, although this is hardware dependent and will build a Solr index of ~3GB. The Solr index is under '`solr/data`' in the '`harvester`' directory. The script requires the file you just unpacked in the same directory and added as a command line parameter `[`optionals`]`:
```
harvest.bat [--withAlternateNames] [--countryIdsToBoost:AU,FR] allCountries.txt
```
 1. Copy or move the '`solr/data`' directory into the '`server`' directory to sit in the same location. If you are developing, then copying allows you to work on both projects independently.
 1. Move to the '`server`' project and run '`mvn clean install`' to build it.
```
cd ../server
mvn clean install
```
 1. You can have Maven start a developer's instance of Jetty using the '`startup.bat`' script. '`stop.bat`' will tell Maven to stop the server.
 1. When the server is online you should be able to access it from: http://localhost:9997/geonames/

It's worth noting that the build has also been run on Mac and Solaris now, and the Solr index is about half the size. We suspect the `optimize()` call in Embedded Solr is not working correctly under Windows.
