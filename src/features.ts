import axios from "axios";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { featureClassesEnglish, parseMainLine } from "./data";
import { Admin1Codes, Country, Doc, Entry, FeatureClassCode } from "./model";

/**
 * Create the solr schema.
 *
 * Based on previous schema.
 * See: https://github.com/redbox-mint/solr-geonames/blob/811877c1916fb1c29e4215a2fa7f36b657048074/server/solr/conf/schema.xml#L22
 *
 * @param solrUrl The url to the solr instance.
 * @param corename The name of the solr index.
 */
export async function defineSchema(solrUrl: string, corename: string) {
  const schemaConfig = {
    "add-field": [
      { name: "geonameid", type: "string", stored: true, indexed: true },
      { name: "utf8_name", type: "text_general", stored: true, indexed: true },
      { name: "basic_name", type: "text_general", stored: true, indexed: true },
      { name: "alternatenames", type: "text_general", stored: true, indexed: true }, // new v2
      { name: "latitude", type: "pdoubles", stored: true, indexed: true },
      { name: "longitude", type: "pdoubles", stored: true, indexed: true },
      { name: "feature_class", type: "strings", stored: true, indexed: true },
      { name: "feature_code", type: "strings", stored: true, indexed: true },
      { name: "country_code", type: "strings", stored: true, indexed: true },
      { name: "cc2", type: "strings", stored: true, indexed: true }, // new v2
      { name: "admin1_code", type: "strings", stored: true, indexed: true }, // new v2
      { name: "admin2_code", type: "strings", stored: true, indexed: true }, // new v2
      { name: "admin3_code", type: "strings", stored: true, indexed: true }, // new v2
      { name: "admin4_code", type: "strings", stored: true, indexed: true }, // new v2
      { name: "population", type: "plongs", stored: true, indexed: true },
      { name: "elevation", type: "plongs", stored: true, indexed: true },
      { name: "gtopo30", type: "plongs", stored: true, indexed: true },
      { name: "timezone", type: "strings", stored: true, indexed: true },
      { name: "date_modified", type: "pdates", stored: true, indexed: true },
      { name: "location_name", type: "text_general", stored: true, indexed: true }, // new v3
      { name: "title", type: "text_general", stored: true, indexed: true }, // new v3
      { name: "feature_class_name", type: "strings", stored: true, indexed: true }, // new v3
      { name: "feature_code_name", type: "strings", stored: true, indexed: true }, // new v3
      { name: "country_name", type: "text_general", stored: true, indexed: true }, // new v3
      { name: "subdivision_name", type: "text_general", stored: true, indexed: true }, // new v3
    ],
  };
  try {
    const response = await axios.post(`${solrUrl}/${corename}/schema`, schemaConfig);
    console.log("Schema defined successfully:", response.data);
  } catch (error) {
    console.error("Error defining schema:", error);
    throw error;
  }
}

/**
 * Function to define default search field.
 *
 * df: 'default field' specifies which field will be searched when none are given in the query
 * See: https://solr.apache.org/guide/solr/latest/query-guide/standard-query-parser.html#standard-query-parser-parameters
 *
 * based on previous schema.
 * See: https://github.com/redbox-mint/solr-geonames/blob/811877c1916fb1c29e4215a2fa7f36b657048074/server/solr/conf/schema.xml#L46
 *
 * @param solrUrl The url to the solr instance.
 * @param corename The name of the solr index.
 */
export async function updateConfig(solrUrl: string, corename: string) {
  const data = {
    "update-requesthandler": {
      name: "/select",
      class: "solr.SearchHandler",
      defaults: {
        echoParams: "explicit",
        rows: 10,
        df: "basic_name",
      },
    },
  };
  try {
    const response = await axios.post(`${solrUrl}/${corename}/config`, data);
    console.log("Config updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating config:", error);
    throw error;
  }
}

/**
 * Update the solr index.
 *
 * @param docs The items to index.
 * @param solrUrl The url to the solr instance.
 * @param corename The name of the solr index.
 */
export async function indexGeonames(solrUrl: string, corename: string, docs: object[]) {
  try {
    const response = await axios.post(`${solrUrl}/${corename}/update?commit=true`, docs);
    console.log(`Indexed ${docs.length} documents successfully:`, response.data);
  } catch (error) {
    console.error("Error indexing documents:", error);
    throw error;
  }
}

/**
 * Parse a file.
 *
 * @param path The path to the file.
 * @param lineCallback A callback to parse each line.
 * @param batchCallback A callback to process a batch of results from the line callback.
 * @param batchMax The preferred size of each batch.
 */
export async function parseFile(
  path: string,
  lineCallback: (line: string) => Promise<object>,
  batchCallback: (lines: object[]) => Promise<void>,
  batchMax: number = 100,
) {
  console.log(`Reading file ${path}`);

  const fileStream = createReadStream(path);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const batch: object[] = [];
  let lineCount = 0;
  for await (const line of rl) {
    const row = await lineCallback(line);
    lineCount += 1;
    batch.push(row);

    if (batch.length > 0 && (batch.length % batchMax) === 0) {
      console.log(`Batch of size ${batch.length} from file ${path}`);
      await batchCallback(batch);
      batch.length = 0;
    }
  }

  if (batch.length > 0) {
    console.log(`Batch of size ${batch.length} from file ${path}`);
    await batchCallback(batch);
  }

  console.log(`Finished reading ${lineCount} lines from file ${path}`);
}

async function buildSolrDocs(
  batchCompleteCallback: (docs: Doc[]) => Promise<void>,
  raw: {
    locationPath: string
    admin1Codes: Admin1Codes[]
    featureClassCodes: FeatureClassCode[]
    countries: Country[]
  },
) {
  //  Create maps from the admin codes, feature codes, countries
  // const continents = continentsEnglish;
  const featureClasses = featureClassesEnglish;

  // index country names from countriesMap
  const countryDocs: Doc[] = [];

  const countriesMap = new Map<string, Country>();
  for (const country of raw.countries) {
    const id = country.iso;
    if (!countriesMap.has(id)) {
      countriesMap.set(id, country);
    }

    const display = `${country.country} (country)`;
    countryDocs.push({
      // original
      geonameid: parseInt(country.geonameId),
      utf8_name: country.country,
      basic_name: display,
      latitude: null,
      longitude: null,
      feature_class: "A",
      feature_code: "COUNTRY",
      country_code: country.iso,
      population: null,
      elevation: null,
      gtopo30: null,
      timezone: null,
      date_modified: null,

      // new
      alternatenames: country.country,
      cc2: null,
      admin1_code: null,
      admin2_code: null,
      admin3_code: null,
      admin4_code: null,

      // additional
      location_name: country.country,
      title: display,
      feature_class_name: "Country",
      feature_code_name: "Country",
      country_name: country.country,
      subdivision_name: null,
    });
  }

  await batchCompleteCallback(countryDocs);

  const featureClassCodesMap = new Map<string, Map<string, FeatureClassCode>>();
  for (const item of raw.featureClassCodes) {
    if (!featureClassCodesMap.has(item.featureClass)) {
      featureClassCodesMap.set(item.featureClass, new Map<string, FeatureClassCode>());
    }
    const featureClassMap = featureClassCodesMap.get(item.featureClass);
    if (!featureClassMap.has(item.featureCode)) {
      featureClassMap.set(item.featureCode, item);
    }
  }

  const admin1CodesMap = new Map<string, Map<string, Admin1Codes>>();
  for (const item of raw.admin1Codes) {
    if (!admin1CodesMap.has(item.country_code)) {
      admin1CodesMap.set(item.country_code, new Map<string, Admin1Codes>());
    }
    const admin1CountryCodesMap = admin1CodesMap.get(item.country_code);
    if (!admin1CountryCodesMap.has(item.admin1_code)) {
      admin1CountryCodesMap.set(item.admin1_code, item);
    }
  }

  const batchCallback = async function (lines: object[]) {
    const docs: Doc[] = [];

    //  Iterate through the locations, building a Doc for each one
    const locations = lines as Entry[];
    for (const location of locations) {
      const feature_class_name = featureClasses.get(location.feature_class) || location.feature_class;
      const feature_code_name = featureClassCodesMap.get(location.feature_class)?.get(location.feature_code)?.title || location.feature_code;
      const country_name = countriesMap.get(location.country_code)?.country || location.country_code;
      let subdivision_name = admin1CodesMap.get(location.country_code)?.get(location.admin1_code)?.nameAscii || location.admin1_code;
      if (subdivision_name == "00") {
        subdivision_name = "";
      }

      const names = [location.basic_name, subdivision_name, country_name].filter(i => !!i?.trim());
      const feature = [feature_code_name, feature_class_name].find(i => !!i);
      const display = `${names.join(", ")}${feature ? " (" + feature + ")" : ""}`;

      docs.push({
        // original
        geonameid: location.geonameid,
        utf8_name: location.utf8_name,
        basic_name: display,
        latitude: location.latitude,
        longitude: location.longitude,
        feature_class: location.feature_class,
        feature_code: location.feature_code,
        country_code: location.country_code,
        population: location.population,
        elevation: location.elevation,
        gtopo30: location.gtopo30,
        timezone: location.timezone,
        date_modified: location.date_modified,

        // new
        alternatenames: location.alternatenames,
        cc2: location.cc2,
        admin1_code: location.admin1_code,
        admin2_code: location.admin2_code,
        admin3_code: location.admin3_code,
        admin4_code: location.admin4_code,

        // additional
        location_name: location.basic_name,
        title: display,
        feature_class_name: feature_class_name,
        feature_code_name: feature_code_name,
        country_name: country_name,
        subdivision_name: subdivision_name,
      });
    }
    await batchCompleteCallback(docs);
  };

  await parseFile(raw.locationPath, parseMainLine, batchCallback);
}

/**
 * Build the solr doc from the geonames data
 * @param solrUrl The url to the solr instance.
 * @param corename The name of the solr index.
 * @param raw The raw geonames data sets.
 */
export async function buildIndexSolrDocs(
  solrUrl: string,
  corename: string,
  raw: {
    locationPath: string
    admin1Codes: Admin1Codes[]
    featureClassCodes: FeatureClassCode[]
    countries: Country[]
  },
) {
  async function doIndex(docs: Doc[]) {
    await indexGeonames(solrUrl, corename, docs);
  }

  await buildSolrDocs(doIndex, raw);
}

/**
 * Build the solr docs and return them.
 * @param raw The raw geonames data sets.
 */
export async function createSolrDocs(
  raw: {
    locationPath: string
    admin1Codes: Admin1Codes[]
    featureClassCodes: FeatureClassCode[]
    countries: Country[]
  },
) {
  const result: Doc[] = [];

  async function doIndex(docs: Doc[]) {
    result.push(...docs);
  }

  await buildSolrDocs(doIndex, raw);
  return result;
}
