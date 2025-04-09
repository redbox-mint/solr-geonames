import { parseFile } from "./features";
import { Admin1Codes, Country, Entry, FeatureClassCode } from "./model";
import moment from "moment";

// From: https://download.geonames.org/export/dump/readme.txt

// export const continentsEnglish = [
//   { code: "AF", title: "Africa", geonameId: "6255146" },
//   { code: "AS", title: "Asia", geonameId: "6255147" },
//   { code: "EU", title: "Europe", geonameId: "6255148" },
//   { code: "NA", title: "North America", geonameId: "6255149" },
//   { code: "OC", title: "Oceania", geonameId: "6255151" },
//   { code: "SA", title: "South America", geonameId: "6255150" },
//   { code: "AN", title: "Antarctica", geonameId: "6255152" },
// ];

export const featureClassesEnglish: Map<string, string> = new Map([
  ["A", "Region"], // country, state, region,...
  ["H", "Water area"], // stream, lake, ...
  ["L", "Natural area"], // parks,area, ...
  ["P", "Urban area"], // city, village,...
  ["R", "Transport"], // road, railroad
  ["S", "Built landmark"], // spot, building, farm
  ["T", "Natural landmark"], // mountain,hill,rock,...
  ["U", "Undersea"], // undersea
  ["V", "Forest area"], // forest,heath,...
]);

function toStr(value: string) {
  return value?.trim();
}
function toFloat(value: string): number {
  value = value?.trim();
  const val = parseFloat(value);
  return isNaN(val) ? null : val;
}
function toInt(value: string, radix?: number): number {
  value = value?.trim();
  const val = parseInt(value, radix);
  return isNaN(val) ? null : val;
}

/**
 * Parse the main geonames data file by line.
 *
 * See: https://download.geonames.org/export/dump/allCountries.zip
 *
 * @param line One line from the main data file.
 */
export async function parseMainLine(line: string) {
  const parts = line.split("\t");
  const doc: Entry = {
    geonameid: toInt(parts[0]),
    utf8_name: toStr(parts[1]),
    basic_name: toStr(parts[2]),
    alternatenames: toStr(parts[3]),
    latitude: toFloat(parts[4]),
    longitude: toFloat(parts[5]),
    feature_class: toStr(parts[6]),
    feature_code: toStr(parts[7]),
    country_code: toStr(parts[8]),
    cc2: toStr(parts[9]),
    admin1_code: toStr(parts[10]),
    admin2_code: toStr(parts[11]),
    admin3_code: toStr(parts[12]),
    admin4_code: toStr(parts[13]),
    population: toInt(parts[14], 10),
    elevation: toInt(parts[15], 10),
    gtopo30: toInt(parts[16], 10), // dem
    timezone: toStr(parts[17]),
    date_modified: moment(toStr(parts[18])),
  };
  return doc;
}

/**
 * Parse the main geonames data file.
 * @param path The path to the file.
 */
export async function parseMain(path: string) {
  const result: Entry[] = [];
  const batchCallback = async function (lines: object[]) {
    const items = lines as Entry[];
    result.push(...items);
  };
  await parseFile(path, parseMainLine, batchCallback);
  return result;
}

/**
 * Parse admin division 1 codes.
 *
 * See: https://download.geonames.org/export/dump/admin1CodesASCII.txt
 *
 * @param path The path to the file.
 */
export async function parseAdmin1Codes(path: string) {
  const result: Admin1Codes[] = [];
  const lineCallback = async function (line: string) {
    const parts = line.split("\t");
    const doc: Admin1Codes = {
      code: toStr(parts[0]),
      name: toStr(parts[1]),
      nameAscii: toStr(parts[2]),
      geonameId: toStr(parts[3]),
    };
    return doc;
  };
  const batchCallback = async function (lines: object[]) {
    const items = lines as Admin1Codes[];
    result.push(...items);
  };
  await parseFile(path, lineCallback, batchCallback);
  return result;
}

/**
 * Parse Feature classes and feature codes.
 *
 * See: https://download.geonames.org/export/dump/featureCodes_en.txt
 * See: https://www.geonames.org/export/codes.html
 *
 * @param path The path to the file.
 */
export async function parseFeatureClassCodes(path: string) {
  const result: FeatureClassCode[] = [];
  const lineCallback = async function (line: string) {
    const parts = line.split("\t");
    const [featureClass, featureCode] = toStr(parts[0]).split(".");
    const doc: FeatureClassCode = {
      featureClass: featureClass,
      featureCode: featureCode,
      title: toStr(parts[1]),
      description: toStr(parts[2]),
    };
    return doc;
  };
  const batchCallback = async function (lines: object[]) {
    const items = lines as FeatureClassCode[];
    result.push(...items);
  };
  await parseFile(path, lineCallback, batchCallback);
  return result;
}

/**
 * Parse country info file.
 *
 * See: https://download.geonames.org/export/dump/countryInfo.txt
 *
 * @param path The path to the file.
 */
export async function parseCountryInfo(path: string) {
  const result: Country[] = [];
  const lineCallback = async function (line: string) {
    if (line?.trim()?.startsWith("#")) {
      return null;
    }
    const parts = line.split("\t");
    const doc: Country = {
      iso: toStr(parts[0]),
      iso3: toStr(parts[1]),
      isoNumeric: toStr(parts[2]),
      country: toStr(parts[4]),
      continent: toStr(parts[8]),
      geonameId: toStr(parts[16]),
    };
    return doc;
  };
  const batchCallback = async function (lines: object[]) {
    const items = lines.filter(l => !!l) as Country[];
    result.push(...items);
  };
  await parseFile(path, lineCallback, batchCallback);
  return result;
}
