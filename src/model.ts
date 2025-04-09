import { Moment } from "moment";

/**
 * Main geonames database row.
 *
 * See: https://download.geonames.org/export/dump/readme.txt
 */
export interface Entry {
  /**
     * goenameid integer id of record in geonames database
     */
  geonameid: number
  /**
     * name of geographical point (utf8) varchar(200)
     */
  utf8_name: string
  /**
     * name of geographical point in plain ascii characters, varchar(200)
     */
  basic_name: string
  /**
     * alternatenames, comma separated, ascii names automatically transliterated, convenience attribute from alternatename table, varchar(10000)
     */
  alternatenames: string
  /**
     * latitude in decimal degrees (wgs84)
     */
  latitude: number
  /**
     * longitude in decimal degrees (wgs84)
     */
  longitude: number
  /**
     * see http://www.geonames.org/export/codes.html, char(1)
     */
  feature_class: string
  /**
     * see http://www.geonames.org/export/codes.html, varchar(10)
     */
  feature_code: string
  /**
     * ISO-3166 2-letter country code, 2 characters
     */
  country_code: string
  /**
     * alternate country codes, comma separated, ISO-3166 2-letter country code, 200 characters
     */
  cc2: string
  /**
     * fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
     */
  admin1_code: string
  /**
     * code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80)
     */
  admin2_code: string
  /**
     * code for third level administrative division, varchar(20)
     */
  admin3_code: string
  /**
     * code for fourth level administrative division, varchar(20)
     */
  admin4_code: string
  /**
   * bigint (8 byte int)
   */
  population: number
  /**
   * in meters, integer
   */
  elevation: number
  /**
   * dem digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
   */
  gtopo30: number
  /**
     *  the iana timezone id (see file timeZone.txt) varchar(40)
     */
  timezone: string
  /**
     * date of last modification in yyyy-MM-dd format
     */
  date_modified: Moment
}

export interface Doc extends Entry {
  location_name: string
  title: string
  feature_class_name: string
  feature_code_name: string
  country_name: string
  subdivision_name: string
}

/**
 * Country details
 *
 * Includes only properties use by solr-geonames.
 *
 * See: https://download.geonames.org/export/dump/countryInfo.txt
 */
export interface Country {
  /**
     * Two-letter ISO code.
     */
  iso: string
  /**
     * Three-letter ISO code.
     */
  iso3: string
  /**
     * Numeric ISO code.
     */
  isoNumeric: string
  /**
     * English country name.
     */
  country: string
  /**
     * Continent (See: https://download.geonames.org/export/dump/readme.txt)
     */
  continent: string
  /**
     * Geoname identifier.
     */
  geonameId: string
}

/**
 * Feature details.
 *
 * See: https://download.geonames.org/export/dump/featureCodes_en.txt
 */
export interface FeatureClassCode {
  /**
     * The top-level feature identifier.
     */
  featureClass: string
  /**
     * The second-level identifier.
     */
  featureCode: string
  /**
     * The short display name.
     */
  title: string
  /**
     * The longer description.
     */
  description: string
}

/**
 * names in English for admin divisions
 *
 * See: https://download.geonames.org/export/dump/admin1CodesASCII.txt
 */
export interface Admin1Codes {
  code: string
  name: string
  nameAscii: string
  geonameId: string
}
