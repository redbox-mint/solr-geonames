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
package au.edu.usq.adfi.geonames.server;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A Response wrapper to rendering output for the 'search' function.
 *
 * @author Greg Pendlebury
 */
public class JsonSearchResponse implements OpenSearchResponse {
    /** Logging */
    private static Logger log = LoggerFactory.getLogger(JsonSearchResponse.class);

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
        return "{\n"+headResponse(results)+",\n"+listResponse(results)+"\n}";
    }

    /**
     * Render a response indicated no results were returned
     *
     * @return String: The rendered output
     */
    @Override
    public String renderEmptyResponse() {
        return "{\n"+headResponse(null)+",\n\"results\": []\n}";
    }

    /**
     * Create a response header string for the result set.
     *
     * @param results: The Solr results
     * @return String: Header block
     */
    private String headResponse(QueryResponse results) {
        // Start index
        String start = request.getParameter("start");
        if (start == null || start.equals("")) {
            start = GeoServlet.DEFAULT_START;
        }

        // Rows
        String rows = request.getParameter("rows");
        if (rows == null || rows.equals("")) {
            rows = GeoServlet.DEFAULT_ROWS;
        }


        String inner = escape("title", "Generic Search")+",\n";
        if (results == null) {
            inner += escape("totalResults", "0")+",\n";
        } else {
            SolrDocumentList list = results.getResults();
            inner += escape("totalResults", list.getNumFound())+",\n";
        }
        inner += escape("startIndex", start)+",\n";
        inner += escape("itemsPerPage", rows)+"\n";
        return "\"OpenSearchResponse\": {\n"+inner+"\n}";
    }

    /**
     * Create a results string for the result set.
     *
     * @param results: The Solr results
     * @return String: Results section in JSON
     */
    private String listResponse(QueryResponse results) {
        // Render each row
        SolrDocumentList list = results.getResults();
        List<String> rows = new ArrayList();
        for (SolrDocument doc : list) {
            rows.add(renderRow(doc));
        }

        String joined = join(rows, ",\n");
        return "\"results\": [\n"+joined+"\n]";
    }

    /**
     * Simple join wrapper
     *
     * @param list: The List of Strings to join
     * @param separator: The separator to join on
     * @return String: The joined list
     */
    private String join(List<String> list, String separator) {
        String output = "";
        for (String element : list) {
            // We don't need a separator before the first element
            if (!output.equals("")) {
                output += separator;
            }
            output += element;
        }
        return output;
    }

    /**
     * Render a single 'row' from the result set
     *
     * @param doc: The Solr document to render
     * @return String: The rendered document in JSON
     */
    private String renderRow(SolrDocument doc) {
        String output = "";
        for (String key : doc.keySet()) {
            // Make sure our commas are correct
            if (!output.equals("")) {
                output += ",\n";
            }

            Object object = doc.getFieldValue(key);
            String value = null;
            if (object instanceof String) {
                value = (String) doc.getFieldValue(key);
            }
            if (object instanceof Integer) {
                value = String.valueOf((Integer) doc.getFieldValue(key));
            }
            if (object instanceof Float) {
                value = String.valueOf((Float) doc.getFieldValue(key));
            }
            if (object instanceof Long) {
                value = String.valueOf((Long) doc.getFieldValue(key));
            }
            if (object instanceof Date) {
                value = ((Date) object).toString();
            }
            output += escape(key, value);
        }
        // Display string
        String name = (String) doc.getFieldValue("basic_name");
        String country = (String) doc.getFieldValue("country_code");
        String timezone = (String) doc.getFieldValue("timezone");
        String display = name+", "+country+" ("+timezone+")";
        output += ",\n"+escape("display", display);

        return "{\n"+output+"\n}";
    }

    /**
     * Simple escape function to avoid typos when
     * joining a key/value pair into JSON
     *
     * @param key: The key string
     * @param value The value string
     * @return String: The key value pair escape, quoted and joined
     */
    private String escape(String key, long value) {
        return escape(key, String.valueOf(value));
    }

    /**
     * Simple escape function to avoid typos when
     * joining a key/value pair into JSON
     *
     * @param key: The key string
     * @param value The value string
     * @return String: The key value pair escape, quoted and joined
     */
    private String escape(String key, String value) {
        key = key.replace("\"", "\\\"");
        key = key.replace("\\", "\\\\");
        value = value.replace("\"", "\\\"");
        value = value.replace("\\", "\\\\");
        return "\""+key+"\": \""+value+"\"";
    }

    /**
     * Render an error message response
     *
     * @param String: The message to include in the response
     * @return String: The rendered output
     */
    @Override
    public String renderError(String message) {
        message = message.replace("\"", "\\\"");
        message = message.replace("\\", "\\\\");
        return "{\"Error\": \""+message+"\"}";
    }

    /**
     * Get the content type to return to users for this response
     *
     * @return String: The MIME type to use
     */
    @Override
    public String contentType() {
        return "application/json";
    }
}
