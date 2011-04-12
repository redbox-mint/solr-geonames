#!/bin/sh
PROGRAM_DIR=`cd \`dirname $0\`; pwd`
SOLR_HOME="-Dgeonames.solr.home=$PROGRAM_DIR/solr"
export MAVEN_OPTS="-XX:MaxPermSize=512m -Xmx1024m"
nohup mvn -P dev $SOLR_HOME jetty:run &> stdout.log
