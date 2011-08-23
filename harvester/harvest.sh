#!/bin/bash

usage() {
    echo "This script requires the first parameter to be in the input file to ingest."
    echo "NOTE: This input file is expected to be a tab delimited geonames data dump."
    echo "Usage: `basename $0` inputFile.txt"
	exit 1
}

# check script arguments
[ $# -gt 0 ] || usage

# get absolute path of where the script is run from
PROGRAM_DIR=`cd \`dirname $0\`; pwd`

if [ -f $1 ]; then
	INPUT_FILE=$1
    shift
    MAVEN_ARGS="$*"
    SOLR_HOME="-Dgeonames.solr.home=$PROGRAM_DIR/solr"
    export MAVEN_OPTS="-XX:MaxPermSize=512m -Xmx1024m"
	mvn $MAVEN_ARGS $SOLR_HOME \
		-Dexec.args="$PROGRAM_DIR/$INPUT_FILE" \
		-Dexec.mainClass=com.googlecode.solrgeonames.harvester.Harvester \
		exec:java
fi
