@echo off

set PROGRAM_DIR=%~dp0

set PARAMS=-Dexec.args="%PROGRAM_DIR% allCountries.txt solr"
set ENTRY_POINT=-Dexec.mainClass=au.edu.usq.adfi.geonames.harvester.Harvester
set MAVEN_OPTS=-XX:MaxPermSize=512m -Xmx1024m

call mvn %PARAMS% %ENTRY_POINT% exec:java
