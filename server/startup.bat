@echo off

set PROGRAM_DIR=%~dp0
set SOLR_HOME=-Dgeonames.solr.home="%PROGRAM_DIR%solr"
set MAVEN_OPTS=-XX:MaxPermSize=512m -Xmx1024m

start "Geoname Solr Index" /d"%PROGRAM_DIR%" mvn -P dev %SOLR_HOME% jetty:run ^>stdout.log
