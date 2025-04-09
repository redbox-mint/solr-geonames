import { parseAdmin1Codes, parseCountryInfo, parseFeatureClassCodes, parseMain } from "../../src/data";
import { Admin1Codes, Country, Entry, FeatureClassCode } from "../../src/model";
import moment from "moment";

let expect: Chai.ExpectStatic;
import("chai").then(mod => expect = mod.expect);
describe("File parsing", () => {
  it("geonames main format can be parsed", async function () {
    const entries = await parseMain("test/example-data/geonamesMain.txt");
    const expected: Entry[] = [
      {
        admin1_code: "00",
        admin2_code: "",
        admin3_code: "",
        admin4_code: "",
        alternatenames: "",
        basic_name: "Kahui Number 2",
        cc2: "",
        country_code: "NZ",
        elevation: null,
        feature_class: "T",
        feature_code: "HLL",
        gtopo30: -9999,
        geonameid: 2078064,
        latitude: -39.31667,
        longitude: 123.93333,
        population: 0,
        timezone: "Pacific/Auckland",
        utf8_name: "Kahui Number 2",
        date_modified: moment("1993-12-30"),
      },
    ];
    expect(expected[0]).to.eql(entries[0]);
  });

  it("geonames admin codes format can be parsed", async function () {
    const entries = await parseAdmin1Codes("test/example-data/admin1CodesASCII.txt");
    const expected: Admin1Codes[] = [
      {
        code: "NZ.G2",
        geonameId: "2179538",
        name: "Wellington Region",
        nameAscii: "Wellington Region",
      },
    ];
    expect(expected[0]).to.eql(entries[0]);
  });

  it("geonames feature codes format can be parsed", async function () {
    const entries = await parseFeatureClassCodes("test/example-data/featureCodes_en.txt");
    const expected: FeatureClassCode[] = [
      {
        featureClass: "T",
        featureCode: "HLL",
        title: "hill",
        description: "a rounded elevation of limited extent rising above the surrounding land with local relief of less than 300m",
      },
    ];
    expect(expected[0]).to.eql(entries[0]);
  });

  it("geonames feature codes format can be parsed", async function () {
    const entries = await parseCountryInfo("test/example-data/countryInfo.txt");
    const expected: Country[] = [
      {
        iso: "AD",
        iso3: "AND",
        isoNumeric: "020",
        country: "Andorra",
        continent: "EU",
        geonameId: "3041565",
      },
    ];
    expect(expected[0]).to.eql(entries[0]);
  });
});
