@echo off

REM show usage if no parameters given
if "%1" == "" goto usage

set PROGRAM_DIR=%~dp0

set SOLR_HOME=-Dgeonames.solr.home="%PROGRAM_DIR%solr"
set PARAMS=-Dexec.args="%PROGRAM_DIR%%1"
set ENTRY_POINT=-Dexec.mainClass=au.edu.usq.adfi.geonames.harvester.Harvester
set MAVEN_OPTS=-XX:MaxPermSize=512m -Xmx1024m

call mvn %PARAMS% %SOLR_HOME% %ENTRY_POINT% exec:java
goto end

:usage
echo This script requires the first parameter to be in the input file to ingest.
echo NOTE: This input file is expected to be a tab delimited geonames data dump.
echo Usage: %0 inputFile.txt

:end