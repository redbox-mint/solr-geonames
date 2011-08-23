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

import javax.servlet.http.HttpServletRequest;

import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A Response wrapper to rendering output for the 'search' function.
 *
 * @author Greg Pendlebury
 */
public class HtmlSearchResponse implements OpenSearchResponse {
    /** Logging */
    private static Logger log = LoggerFactory.getLogger(HtmlSearchResponse.class);

    /**
     * An initialisation function giving access to the HTTP input.
     *
     * @param request: The incoming HTTP request
     */
    @Override
    public void init(HttpServletRequest request) {
    }

    /**
     * Render a valid response to a search result list.
     *
     * @param results: The results list to render
     * @return String: The rendered output
     */
    @Override
    public String renderResponse(QueryResponse results) {
        String output = "";
        for (SolrDocument doc : results.getResults()) {
            output += renderRow(doc);
        }
        return output;
    }

    private String renderRow(SolrDocument doc) {
        String id = (String) doc.getFieldValue("id");
        String name = (String) doc.getFieldValue("basic_name");
        String country = (String) doc.getFieldValue("country_code");
        String timezone = (String) doc.getFieldValue("timezone");
        String score = String.valueOf((Float) doc.getFieldValue("score"));
        //return "<b><a href='?id="+id+"'>"+name+"</a></b>, "+country+", "+score+"<br/>";
        return "<b><a href='/geonames/search?func=detail&amp;id="+id+"'>"+name+"</a></b>, "+country+" ("+timezone+")<br/>";
    }

    /**
     * Render a response indicated no results were returned
     *
     * @return String: The rendered output
     */
    @Override
    public String renderEmptyResponse() {
        return "Boo, 0 results";
    }

    /**
     * Render an error message response
     *
     * @param String: The message to include in the response
     * @return String: The rendered output
     */
    @Override
    public String renderError(String message) {
        return "Error: " + message;
    }

    /**
     * Get the content type to return to users for this response
     *
     * @return String: The MIME type to use
     */
    @Override
    public String contentType() {
        return "text/html";
    }
}
