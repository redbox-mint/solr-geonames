import axios from "axios";

let expect: Chai.ExpectStatic;
import("chai").then(mod => expect = mod.expect);

describe("Solr query", function () {
  const cases = [
    {
      args: {
        search: "",
        additionalQueryString: "",
      },
      expected: {
        status: 200, start: 0, numFound: 0, docs: [],
      },
    },
    {
      args: {
        search: "Kahui",
        additionalQueryString: "",
      },
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
  ];
  cases.forEach(({ args, expected }) => {
    it(`should give expected query response '${JSON.stringify(args)}' = ${JSON.stringify(expected)}`, async function () {
      let queryUrl = `http://nginx:8080/select?timeAllowed=1000&q=${args.search}`;
      if (args.additionalQueryString) {
        queryUrl += args.additionalQueryString;
      }
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
