const fs = require("fs/promises");
const path = require("path");

const endpointsPath = path.join(__dirname, "../endpoints.json");

function fetchEndpoints() {
  return fs.readFile(endpointsPath, "utf8").then((endpoints) => {
    return JSON.parse(endpoints);
  });
}

module.exports = fetchEndpoints;
