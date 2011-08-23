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

import org.apache.solr.client.solrj.response.FacetField;
import org.apache.solr.client.solrj.response.FacetField.Count;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A Response wrapper to rendering output for the 'debug' function.
 *
 * @author Greg Pendlebury
 */
public class HtmlDebugResponse implements OpenSearchResponse {
    /** Logging */
    private static Logger log = LoggerFactory.getLogger(HtmlDebugResponse.class);
    private HttpServletRequest request;

    /**
     * An initialisation function giving access to the HTTP input.
     *
     * @param request: The incoming HTTP request
     */
    @Override
    public void init(HttpServletRequest request) {
        this.request = request;
    }

    /**
     * Render a valid response to a search result list.
     *
     * @param results: The results list to render
     * @return String: The rendered output
     */
    @Override
    public String renderResponse(QueryResponse results) {
        String table = resultsTables(results);
        String facets = facetsMenu(results);
        String debug = "<pre>"+results.toString()+"</pre>";

        return
"<html>" +
    "<head>" +
        "<title>Debugging</title>" +
        "<link rel='stylesheet' type='text/css' href='styles.css' />" +
    "</head>" +
    "<body>" +
        "<table class='debug'>" +
            "<tr><th>FACETS</th><th>RESULTS</th></tr>" +
            "<tr><td>"+facets+"</td><td>"+table+"</td></tr>" +
        "</table>" +
    "</body>" +
"</html>";
   }

    private String facetsMenu(QueryResponse results) {
        String output = "";
        for (FacetField field : results.getFacetFields()) {
            String fieldName = field.getName();
            output += "<ul>";
            output += "<li class='heading'><b>"+fieldName+"</b></li>";
            for (Count entry : field.getValues()) {
                long count = entry.getCount();
                if (count > 0) {
                    String value = entry.getName();
                    // Exact match on row count
                    if (count == results.getResults().getNumFound()) {
                        output += "<li>"+value+" ("+count+")</li>";
                    // A genuine facet
                    } else {
                        String link = facetLink(fieldName+":"+value);
                        output += "<li><a href='"+link+"'>"+value+"</a> ("+count+")</li>";
                    }
                }
            }
            output += "</ul>";
        }
        return output;
    }

    private String facetLink(String newFq) {
        // FUNC
        String link = "/geonames/search?func=debug&format=html";
        // q
        String q = request.getParameter("q");
        if (q == null) {
            q = "";
        }
        link += "&q="+q;
        // rows
        String rows = request.getParameter("rows");
        if (rows != null) {
            link += "&rows="+rows;
        }
        // start
        String start = request.getParameter("start");
        if (start != null) {
            link += "&start="+start;
        }
        // fq
        String fq = request.getParameter("fq");
        if (fq == null) {
            link += "&fq="+newFq;
        } else {
            link += "&fq=("+newFq+ ") AND ("+fq+")";
        }
        return link;
    }

    private String resultsTables(QueryResponse results) {
        String output = "<table class='results'>";
        output += "<tr>" +
                "<th>Location</th>" +
                "<th>Geonames URI</th>" +
                "<th>Country Code</th>" +
                "<th>Timezone</th>" +
                "<th>Feature Class</th>" +
                "<th>Feature Code</th>" +
                "<th>Score</th>" +
                "</tr>";
        for (SolrDocument doc : results.getResults()) {
            output += renderRow(doc);
        }
        output += "</table>";
        return output;
    }

    private String renderRow(SolrDocument doc) {
        String name = (String) doc.getFieldValue("basic_name");
        String id = (String) doc.getFieldValue("id");
        String country = (String) doc.getFieldValue("country_code");
        String timezone = (String) doc.getFieldValue("timezone");
        String fClass = (String) doc.getFieldValue("feature_class");
        String fCode = (String) doc.getFieldValue("feature_code");
        String score = String.valueOf((Float) doc.getFieldValue("score"));
        return "<tr>" +
                "<td>"+name+"</td>" +
                "<td><a href='http://sws.geonames.org/"+id+"/'>Geo</a> || <a href='/geonames/search?func=detail&amp;id="+id+"'>Solr</a></td>" +
                "<td>"+country+"</td>" +
                "<td>"+timezone+"</td>" +
                "<td>"+fClass+"</td>" +
                "<td>"+fCode+"</td>" +
                "<td>"+score+"</td>" +
                "</tr>";
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
