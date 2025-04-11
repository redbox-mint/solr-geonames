import axios from "axios";

let expect: Chai.ExpectStatic;
import("chai").then(mod => expect = mod.expect);

describe("Solr query", function () {
  const cases = [
    {
      args: (function () {
        return new URLSearchParams("");
      })(),
      expected: {
        status: 200, start: 0, numFound: 0, docs: [],
      },
    },
    {
      // test full match
      args: (function () {
        const params = new URLSearchParams("");
        params.append("q", "*Kahui*");
        return params;
      })(),
      expected: {
        status: 200, start: 0, numFound: 1, docs: [
          {
            geonameid: "2078064",
            admin1_code: ["00"],
            basic_name: ["Kahui Number 2, New Zealand (hill)"],
            country_code: ["NZ"],
            country_name: ["New Zealand"],
            date_modified: ["1993-12-30T00:00:00Z"],
            feature_class: ["T"],
            feature_class_name: ["Natural landmark"],
            feature_code: ["HLL"],
            feature_code_name: ["hill"],
            gtopo30: [-9999],
            latitude: [-39.31667],
            longitude: [123.93333],
            location_name: ["Kahui Number 2"],
            population: [0],
            timezone: ["Pacific/Auckland"],
            title: ["Kahui Number 2, New Zealand (hill)"],
            utf8_name: ["Kahui Number 2"],
          },
        ],
      },
    },
    {
      // test partial match and different case
      args: (function () {
        const params = new URLSearchParams("");
        params.append("q", "*hui num*");
        return params;
      })(),
      expected: {
        status: 200, start: 0, numFound: 1, docs: [
          {
            geonameid: "2078064",
            admin1_code: ["00"],
            basic_name: ["Kahui Number 2, New Zealand (hill)"],
            country_code: ["NZ"],
            country_name: ["New Zealand"],
            date_modified: ["1993-12-30T00:00:00Z"],
            feature_class: ["T"],
            feature_class_name: ["Natural landmark"],
            feature_code: ["HLL"],
            feature_code_name: ["hill"],
            gtopo30: [-9999],
            latitude: [-39.31667],
            longitude: [123.93333],
            location_name: ["Kahui Number 2"],
            population: [0],
            timezone: ["Pacific/Auckland"],
            title: ["Kahui Number 2, New Zealand (hill)"],
            utf8_name: ["Kahui Number 2"],
          },
        ],
      },
    },
    {
      // test partial match with feature class and feature code filtering
      args: (function () {
        const params = new URLSearchParams("");
        params.append("q", "*nukau*");
        params.append("q.op", "AND");
        params.append("fq", "feature_class:A");
        params.append("fq", "feature_code:ADMD");
        return params;
      })(),
      expected: {
        status: 200, start: 0, numFound: 1, docs: [
          {
            // original
            geonameid: "2178889",
            utf8_name: ["Manukau County"],
            basic_name: ["Manukau County, New Zealand (administrative division)"],
            latitude: [-37],
            longitude: [175],
            feature_class: ["A"],
            feature_code: ["ADMD"],
            country_code: ["NZ"],
            population: [0],
            gtopo30: [70],
            timezone: ["Pacific/Auckland"],
            date_modified: ["1993-12-30T00:00:00Z"],

            // new
            alternatenames: ["Manukau"],
            admin1_code: ["00"],
            // admin2_code: [""],
            // admin3_code: [""],
            // admin4_code: [""],

            // additional
            location_name: ["Manukau County"],
            title: ["Manukau County, New Zealand (administrative division)"],
            feature_class_name: ["Region"],
            feature_code_name: ["administrative division"],
            country_name: ["New Zealand"],
            // subdivision_name: [""],
          },
        ],
      },
    },
    {
      // test with subdivision name
      args: (function () {
        const params = new URLSearchParams("");
        params.append("q", "*skew*");
        params.append("q.op", "AND");
        params.append("fq", "feature_class:T");
        params.append("fq", "feature_code:MT");
        return params;
      })(),
      expected: {
        status: 200, start: 0, numFound: 1, docs: [
          {
            // original
            geonameid: "2178895",
            utf8_name: ["Askew Hill"],
            basic_name: ["Askew Hill, Marlborough, New Zealand (mountain)"],
            latitude: [-41.03333],
            longitude: [173.7],
            feature_class: ["T"],
            feature_code: ["MT"],
            country_code: ["NZ"],
            population: [0],
            gtopo30: [286],
            timezone: ["Pacific/Auckland"],
            date_modified: ["2016-06-22T00:00:00Z"],

            // new
            alternatenames: ["Askews Hill"],
            admin1_code: ["F4"],
            admin2_code: ["053"],
            // admin3_code: [""],
            // admin4_code: [""],

            // additional
            location_name: ["Askew Hill"],
            title: ["Askew Hill, Marlborough, New Zealand (mountain)"],
            feature_class_name: ["Natural landmark"],
            feature_code_name: ["mountain"],
            country_name: ["New Zealand"],
            subdivision_name: ["Marlborough"],
          },
        ],
      },
    },
    {
      // test with countries only
      args: (function () {
        const params = new URLSearchParams("");
        params.append("q", "Australia");
        params.append("fq", "feature_class:A AND feature_code:COUNTRY");
        return params;
      })(),
      expected: {
        status: 200, start: 0, numFound: 1, docs: [
          {
            // original
            geonameid: "2077456",
            utf8_name: ["Australia"],
            basic_name: ["Australia (country)"],
            feature_class: ["A"],
            feature_code: ["COUNTRY"],
            country_code: ["AU"],

            // new
            alternatenames: ["Australia"],

            // additional
            location_name: ["Australia"],
            title: ["Australia (country)"],
            feature_class_name: ["Country"],
            feature_code_name: ["Country"],
            country_name: ["Australia"],
          },
        ],
      },
    },
  ];
  cases.forEach(({ args, expected }) => {
    it(`should give expected query response '${JSON.stringify(args.toString())}' = ${JSON.stringify(expected.docs.length)}`, async function () {
      const queryUrl = `http://nginx:8080/select?${args.toString()}`;
      const response = await axios.get(queryUrl);
      expect(response.data.response.docs.map((d: Record<string, string>) => {
        delete d["_root_"];
        delete d["_version_"];
        delete d["id"];
        return d;
      })).to.eql(expected.docs);
      expect(response.data.response.start).to.eql(expected.start);
      expect(response.data.response.numFound).to.eql(expected.numFound);
      expect(response.status).to.eql(expected.status);
    });
  });
});
