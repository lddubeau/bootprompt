// eslint-disable-next-line import/no-extraneous-dependencies
const semver = require("semver");

module.exports = [{
  package: "jquery",
  version: "latest",
  files: [
    "dist/jquery.js",
  ],
}, {
  package: "bootstrap",
  version: "latest",
  files: [
    version => `dist/js/bootstrap.${semver.intersects(version, ">=4") ?
"bundle." : ""}js`,
    "dist/css/bootstrap.css",
  ],
}];
