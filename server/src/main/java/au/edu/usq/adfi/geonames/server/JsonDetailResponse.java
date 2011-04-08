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
 * A Response wrapper to rendering output for the 'detail' function.
 *
 * @author Greg Pendlebury
 */
public class JsonDetailResponse implements OpenSearchResponse {
    /** Logging */
    private static Logger log = LoggerFactory.getLogger(JsonDetailResponse.class);

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
        // Render each row
        SolrDocumentList list = results.getResults();
        List<String> rows = new ArrayList();
        for (SolrDocument doc : list) {
            rows.add(renderRow(doc));
        }

        // Are we returning a single value?
        if (list.size() == 1) {
            return rows.get(0);

        // Or a list?
        } else {
            String joined = join(rows, ",\n");
            return "[\n"+joined+"\n]";
        }
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
            key = key.replace("\"", "\\\"");
            value = value.replace("\"", "\\\"");
            output += "\""+key+"\": \""+value+"\"";
        }
        return "{\n"+output+"\n}";
    }

    /**
     * Render a response indicated no results were returned
     *
     * @return String: The rendered output
     */
    @Override
    public String renderEmptyResponse() {
        return "{\"Error\": \"ID not found\"}";
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
