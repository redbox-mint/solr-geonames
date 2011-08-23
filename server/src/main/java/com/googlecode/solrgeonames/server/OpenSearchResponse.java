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

/**
 * A response interface that all formats and functions will adhere to.
 *
 * @author Greg Pendlebury
 */
public interface OpenSearchResponse {

    /**
     * An initialisation function giving access to the HTTP input.
     *
     * @param request: The incoming HTTP request
     */
    public void init(HttpServletRequest request);

    /**
     * Render a valid response to a search result list.
     *
     * @param results: The results list to render
     * @return String: The rendered output
     */
    public String renderResponse(QueryResponse results);

    /**
     * Render a response indicated no results were returned
     *
     * @return String: The rendered output
     */
    public String renderEmptyResponse();

    /**
     * Render an error message response
     *
     * @param String: The message to include in the response
     * @return String: The rendered output
     */
    public String renderError(String message);

    /**
     * Get the content type to return to users for this response
     *
     * @return String: The MIME type to use
     */
    public String contentType();
}
