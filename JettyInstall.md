Installing for Jetty
=====
This process is fairly trivial, and is how we deploy alongside our existing projects.

 1. Download [the bundled ZIP](http://code.google.com/p/solr-geonames/downloads/detail?name=solr-geonames.zip) containing the WAR file (~5MB) and configuration.
 1. Add some context configuration. Jetty can be configured in several ways, in our case we have a 'contexts' folder with XML for each context. Sample '`geonames.xml`':
```
<?xml version="1.0"?>
<!DOCTYPE Configure PUBLIC "-//Mort Bay Consulting//DTD Configure//EN" "http://jetty.mortbay.org/configure.dtd">
<Configure class="org.mortbay.jetty.webapp.WebAppContext">
    <Set name="contextPath">/geonames</Set>
    <Set name="war"><SystemProperty name="jetty.home" default="."/>/../webapps/geonames.war</Set>
    <Set name="parentLoaderPriority">true</Set>
    <Set name="extraClasspath"><SystemProperty name="extra.classpath" default=""/></Set>
</Configure>
```
 1. Deploy the WAR file into the '`webapps`' folder of your Jetty server. The XML above is pointing there.
 1. Also in the ZIP package is a '`solr`' directory. You can deploy this wherever you like.
 1. The empty '`data`' directory under '`solr`' is where you are going to need to copy/move your [DeveloperInstall built index data].
 1. You also need to modify your server startup scripts to ensure that the appropriate system parameter is pointing to your '`solr`' directory:
```
-Dgeonames.solr.home=/your/path/to/solr
```

This should arrange for Jetty to start your servlet, and ensure that the servlet knows where to find its Solr configuration and index data. You can access the [interface](SearchInterface.md) under the `/geonames` context.
