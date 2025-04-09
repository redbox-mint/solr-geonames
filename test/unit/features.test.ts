import { parseAdmin1Codes, parseCountryInfo, parseFeatureClassCodes } from "../../src/data";
import { Doc } from "../../src/model";
import moment from "moment";
import { createSolrDocs } from "../../src/features";
import path from "node:path";

let expect: Chai.ExpectStatic;
import("chai").then(mod => expect = mod.expect);
describe("Features", () => {
  it("should build solr docs as expected", async function () {
    const sourceDataDir = "test/example-data";
    const raw = {
      locationPath: path.join(sourceDataDir, "geonamesMain.txt"),
      admin1Codes: await parseAdmin1Codes(path.join(sourceDataDir, "admin1CodesASCII.txt")),
      featureClassCodes: await parseFeatureClassCodes(path.join(sourceDataDir, "featureCodes_en.txt")),
      countries: await parseCountryInfo(path.join(sourceDataDir, "countryInfo.txt")),
    };
    const entries = await createSolrDocs(raw);
    const expected: Doc[] = [
      {
        admin1_code: "00",
        admin2_code: "",
        admin3_code: "",
        admin4_code: "",
        alternatenames: "",
        basic_name: "Kahui Number 2, New Zealand (hill)",
        cc2: "",
        country_code: "NZ",
        country_name: "New Zealand",
        date_modified: moment("1993-12-30"),
        elevation: null,
        feature_class: "T",
        feature_class_name: "Natural landmark",
        feature_code: "HLL",
        feature_code_name: "hill",
        gtopo30: -9999,
        geonameid: 2078064,
        latitude: -39.31667,
        location_name: "Kahui Number 2",
        longitude: 123.93333,
        population: 0,
        subdivision_name: "",
        timezone: "Pacific/Auckland",
        title: "Kahui Number 2, New Zealand (hill)",
        utf8_name: "Kahui Number 2",

      },
    ];
    expect(expected[0]).to.eql(entries[0]);
  });
});
