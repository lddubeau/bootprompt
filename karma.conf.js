/* eslint-env node */

"use strict";

const path = require("path");

const semver = require("semver");

// Minimal localConfig if there is not one locally.
let localConfig = {
  browserStack: {},
};
try {
  // eslint-disable-next-line import/no-unresolved, global-require
  localConfig = require("./localConfig");
}
catch (ex) {} // eslint-disable-line no-empty

function coreJS(files) {
  files.unshift({
    pattern: path.resolve("./node_modules/core-js/client/core.js"),
    included: true,
    served: true,
    watched: false,
  });
}

coreJS.$inject = ["config.files"];

function makeSpecifier(version) {
  return version === undefined ? "" : `@${version}`;
}

module.exports = (config) => {
  // The --use-jquery option is stored as "useJquery". Note the funky
  // capitalization.
  //
  // The --use-bootstrap option is stored as "useBootstrap".
  const { useBootstrap, useJquery: useJQuery } = config;
  const { browsers, grep } = config;

  const jquerySpecifier = makeSpecifier(useJQuery);
  const bootstrapSpecifier = makeSpecifier(useBootstrap);

  const cdn = "https://unpkg.com/";

  const jQueryURL = `${cdn}/jquery${jquerySpecifier}/dist/jquery.js`;

  // The bundle file is only for Bootstrap 4. So for Bootstrap 3 we have to
  // specify bootstrap.js instead of bootstrap.bundle.js.
  const bootstrapURL =
        `${cdn}/bootstrap${bootstrapSpecifier}/dist/js/bootstrap.\
${(useBootstrap === undefined || semver.intersects(`${useBootstrap}`, ">=4")) ?
"bundle." : ""}js`;

  // eslint-disable-next-line no-console
  console.log(`Using Bootstrap ${useBootstrap || "latest"}`);
  // eslint-disable-next-line no-console
  console.log(`Using jQuery ${useJQuery || "latest"}`);

  const coverage = !config.debug ? ["coverage"] : [];
  const options = {
    basePath: "",
    frameworks: ["mocha", "chai", "inline-core-js"],
    plugins: [
      "karma-*",
      {
        "framework:inline-core-js": ["factory", coreJS],
      },
    ],
    files: [
      "node_modules/sinon/pkg/sinon.js",
      "node_modules/sinon-chai/lib/sinon-chai.js",
      jQueryURL,
      bootstrapURL,
      "build/dist/bootprompt.min.js",
      "build/dist/bootprompt.locales.min.js",
      "tests/**/*.test.js",
      { pattern: "build/dist/**/*.map", included: false },
    ],
    client: {
      mocha: {
        grep,
      },
    },
    exclude: [],
    preprocessors: {
      "src/bootprompt.js": coverage,
    },
    reporters: ["dots", "coverage", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless", "FirefoxHeadless"],
    browserStack: {
      project: "bootprompt",
    },
    customLaunchers: {
      ChromeWin: {
        base: "BrowserStack",
        browser: "Chrome",
        os: "Windows",
        os_version: "10",
      },
      FirefoxWin: {
        base: "BrowserStack",
        browser: "Firefox",
        os: "Windows",
        os_version: "10",
      },
      OperaWin: {
        base: "BrowserStack",
        browser: "Opera",
        os: "Windows",
        os_version: "10",
      },
      Edge: {
        base: "BrowserStack",
        browser: "Edge",
        os: "Windows",
        os_version: "10",
      },
      IE11: {
        base: "BrowserStack",
        browser: "IE",
        browser_version: "11",
        os: "Windows",
        os_version: "10",
      },
      IE10: {
        base: "BrowserStack",
        browser: "IE",
        browser_version: "10",
        os: "Windows",
        os_version: "8",
      },
      Opera: {
        base: "BrowserStack",
        browser: "Opera",
        os: "Windows",
        os_version: "10",
      },
      SafariMojave: {
        base: "BrowserStack",
        browser: "Safari",
        os: "OS X",
        os_version: "Mojave",
      },
      SafariHighSierra: {
        base: "BrowserStack",
        browser: "Safari",
        os: "OS X",
        os_version: "High Sierra",
      },
      SafariSierra: {
        base: "BrowserStack",
        browser: "Safari",
        os: "OS X",
        os_version: "Sierra",
      },
      SafariElCapitan: {
        base: "BrowserStack",
        browser: "Safari",
        os: "OS X",
        os_version: "El Capitan",
      },
      Android4_4: {
        base: "BrowserStack",
        browser: "android",
        os: "android",
        device: "Samsung Galaxy Tab 4",
        os_version: "4.4",
        real_mobile: true,
      },
      // iOS... as of 2019/02/05 I don't see iOS supported with plain JS
      // testing. They do support it with Selenium/Appium but we're not using
      // that.
    },
    captureTimeout: 60000,
    coverageReporter: {
      type: "html",
      dir: "tests/coverage",
    },
    junitReporter: {
      outputDir: "tests/reports",
    },
  };

  // Bring in the options from the localConfig file.
  Object.assign(options.browserStack, localConfig.browserStack);

  if (browsers.length === 1 && browsers[0] === "all") {
    const newList =
          options.browsers.concat(Object.keys(options.customLaunchers));

    // Yes, we must modify this array in place.
    // eslint-disable-next-line prefer-spread
    browsers.splice.apply(browsers, [0, browsers.length].concat(newList));
  }

  config.set(options);
};
