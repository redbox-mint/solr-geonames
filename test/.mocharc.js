"use strict";

module.exports = {
  require: "chai",
  recursive: true,
  slow: 2000,
  timeout: "20s",
  ui: "bdd",
  global: ["moment", "_"],
};

if (process.env.CI === "true") {
  console.log("Mocha running in CI.");
  // (For CI) Run mocha and write results to a junit format file:
  module.exports["reporter"] = "mocha-junit-reporter";
  module.exports["reporter-option"] = "mochaFile=./support/junit/mocha.xml";
} else {
  console.log("Mocha running in local dev.");
  // (For development) Run mocha and show the results on stdout:
  module.exports["reporter"] = "spec";
}
