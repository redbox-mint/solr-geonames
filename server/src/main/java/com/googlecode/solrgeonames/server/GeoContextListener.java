/*
 * Geonames Solr Index - Servlet
 * Copyright (C) 2011 University of Southern Queensland
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
package com.googlecode.solrgeonames.server;

import java.io.File;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.core.CoreContainer;
import org.apache.solr.core.CoreDescriptor;
import org.apache.solr.core.SolrConfig;
import org.apache.solr.core.SolrCore;
import org.apache.solr.core.SolrResourceLoader;
import org.apache.solr.schema.IndexSchema;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Server startup and shutdown events
 *
 * @author Greg Pendlebury
 */
public class GeoContextListener implements ServletContextListener {
    /** Logging */
    private static Logger log = LoggerFactory.getLogger(GeoContextListener.class);

    /** Solr file names */
    private static String SOLR_CONFIG = "solrconfig.xml";
    private static String SOLR_SCHEMA = "schema.xml";

    /** Solr index */
    private CoreContainer solrContainer;
    private EmbeddedSolrServer solrServer;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("\n=============\nStarting Solr:\n");

        // Find the Solr home
        String solrHome = System.getProperty("geonames.solr.home");
        if (solrHome == null) {
            log.error("No 'geonames.solr.home' provided!");
            return;
        }
        // Validate on a basic level
        File solrDir = new File(solrHome);
        if (solrDir == null || !solrDir.exists() || !solrDir.isDirectory()) {
            log.error("SOLR_HOME does not exist, or is not a directory: '{}'",
                    solrHome);
            return;
        }

        // Start Solr
        try {
            solrServer = startSolr(solrHome);
            log.info("\n... Solr is online\n=============\n");

            // Store access to Solr for the Servlet
            sce.getServletContext().setAttribute("solr", solrServer);
        } catch (Exception ex) {
            log.error("\n... Solr failed to load!");
            log.error("Stack trace: ", ex);
            log.error("\n=============");
        }
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("\n=============\nShutting down Solr\n");
        if (solrContainer != null) {
            solrContainer.shutdown();
        }
    }

    /**
     * Start up an embedded Solr server.
     *
     * @param home: The path to the Solr home directory
     * @return EmbeddedSolrServer: The instantiated server
     * @throws Exception if any errors occur
     */
    private EmbeddedSolrServer startSolr(String home) throws Exception {
        SolrConfig solrConfig = new SolrConfig(home, SOLR_CONFIG, null);
        IndexSchema schema = new IndexSchema(solrConfig, SOLR_SCHEMA, null);

        solrContainer = new CoreContainer(new SolrResourceLoader(
                SolrResourceLoader.locateSolrHome()));
        CoreDescriptor descriptor = new CoreDescriptor(solrContainer, "",
                solrConfig.getResourceLoader().getInstanceDir());
        descriptor.setConfigName(solrConfig.getResourceName());
        descriptor.setSchemaName(schema.getResourceName());

        SolrCore solrCore = new SolrCore(null, solrConfig.getDataDir(),
                solrConfig, schema, descriptor);
        solrContainer.register("", solrCore, false);
        return new EmbeddedSolrServer(solrContainer, "");
    }

}
