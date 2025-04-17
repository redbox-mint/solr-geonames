import { buildIndexSolrDocs, defineSchema, updateConfig } from "./features";
import {
  parseAdmin1Codes,
  parseCountryInfo,
  parseFeatureClassCodes,
} from "./data";
import path from "node:path";

export const inputs = {
  sourceDataDir: "/opt/solr-geonames",
  corename: "geonames",
  solrUrl: "http://localhost:8983/solr",
};
const args = process.argv.slice(2);
args.forEach((arg, index) => {
  if (arg === "--dir" && args[index + 1]) {
    inputs.sourceDataDir = args[index + 1];
  }
  if (arg === "--core" && args[index + 1]) {
    inputs.corename = args[index + 1];
  }
  if (arg === "--solrUrl" && args[index + 1]) {
    inputs.solrUrl = args[index + 1];
  }
});

console.log(`Running with core=${inputs.corename} directory=${inputs.sourceDataDir} url=${inputs.solrUrl}`);

// Main function to orchestrate the workflow
async function main() {
  try {
    const sourceDataDir = inputs.sourceDataDir;
    const corename = inputs.corename;
    const solrUrl = inputs.solrUrl;

    console.log("Defining Solr schema");
    await defineSchema(solrUrl, corename);

    console.log("Updating Solr config");
    await updateConfig(solrUrl, corename);

    console.log("Parsing data files");
    const raw = {
      locationPath: path.join(sourceDataDir, "geonamesMain.txt"),
      admin1Codes: await parseAdmin1Codes(path.join(sourceDataDir, "admin1CodesASCII.txt")),
      featureClassCodes: await parseFeatureClassCodes(path.join(sourceDataDir, "featureCodes_en.txt")),
      countries: await parseCountryInfo(path.join(sourceDataDir, "countryInfo.txt")),
    };

    console.log("Building and indexing geonames data");
    await buildIndexSolrDocs(solrUrl, corename, raw);

    console.log("Process complete.");
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

main();
