Overview
=============
This project has a pair of basic Java applications:
 * The first harvests the [Geonames.org](http://geonames.org) dataset into an embedded Solr index.
 * The second wraps the embedded Solr index in a basic Java Servlet.

Documentation
=============
Given the amount of data indexed we don't upload the indexed data to this project. So installing is a two step process:
  * [Developer Installation](DeveloperInstall.md): is required to build your index data (at least once), and you can use this to run a simple dev server.
  * [Deploying using Jetty](JettyInstall.md): is an example of deploying the resulting data and WAR file to an existing server.

Some more background information/documentation:
  * [Search Interface(s)](SearchInterface.md) available on a running system.
  * [Relevancy Ranking](BoostingResults.md) built into the system... and how to change.
  * [Maven Project Layout](ProjectStructure.md), and why.
  * [Development TODOs](FutureDevelopment.md) and ideas if people want to extend this code.
  * [JavaDoc](https://dev.redboxresearchdata.com.au/jenkins/job/solr-geonames/javadoc/?) hosted on an [external build server](https://dev.redboxresearchdata.com.au/jenkins/job/solr-geonames/).

Deployment
=============
Artifacts are now available in Maven Central [MavenDeployment via Sonatype], and can be included in your project like so:
```
        <dependency>
            <groupId>com.googlecode.solr-geonames</groupId>
            <artifactId>solr-geonames-server</artifactId>
            <type>war</type>
            <version>1.0</version>
        </dependency>
        <dependency>
            <groupId>com.googlecode.solr-geonames</groupId>
            <artifactId>solr-geonames-harvester</artifactId>
            <version>1.0</version>
        </dependency>
```

A 'skinny' WAR artifact is also available if you don't want to bring down the ~10mb WAR with JARs bundled inside:
```
        <dependency>
            <groupId>com.googlecode.solr-geonames</groupId>
            <artifactId>solr-geonames-server</artifactId>
            <type>war</type>
            <classifier>skinny</classifier>
            <version>1.0</version>
        </dependency>
```
