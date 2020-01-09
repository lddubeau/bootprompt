const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const { ConfigBuilder, lintConfig } = require("karma-browserstack-config");

function inlineFirst(files) {
  files.unshift({
    pattern:
    path.resolve("./node_modules/es6-promise/dist/es6-promise.auto.min.js"),
    included: true,
    served: true,
    watched: false,
  });
}

inlineFirst.$inject = ["config.files"];

const { env: { CONTINUOUS_INTEGRATION } } = process;

module.exports = config => {
  const { browsers, grep } = config;

  const coverage =
        !config.debug ? ["karma-coverage-istanbul-instrumenter"] : [];

  const customLaunchers = new ConfigBuilder({ mobile: true }).getConfigs({
    excludes: ["IE8", "IE9"],
  });
  lintConfig(customLaunchers);

  const options = {
    basePath: "",
    frameworks: ["mocha", "chai", "use-cdn", "inline-first"],
    plugins: [
      "karma-*",
      {
        "framework:inline-first": ["factory", inlineFirst],
      },
      "@use-cdn/karma",
    ],
    files: [
      "node_modules/sinon/pkg/sinon.js",
      "node_modules/sinon-chai/lib/sinon-chai.js",
      // We cannot use the min version here because all comments are stripped.
      // And the comments telling istanbul to ignore lines will be stripped too.
      "build/dist/bootprompt.all.js",
      { pattern: "build/dist/**/*.map", included: false },
      "tests/util.ts",
      "tests/**/*.test.ts",
    ],
    client: {
      mocha: {
        grep,
      },
    },
    exclude: [],
    preprocessors: {
      "tests/*.ts": ["typescript"],
      "build/dist/*.js": coverage,
    },
    typescriptPreprocessor: {
      tsconfigPath: "./tests/tsconfig.json",
      compilerOptions: {
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        typescript: require("typescript"),
        sourceMap: false,
        // We have to have them inline for the browser to find them.
        inlineSourceMap: true,
        inlineSources: true,
      },
    },
    reporters: ["mocha", "coverage-istanbul"],
    port: 9876,
    //
    // Use this address rather than localhost. Apparently there are issues with
    // trying to access localhost on iOS. See:
    // https://www.browserstack.com/question/758
    // https://www.browserstack.com/question/663
    // https://stackoverflow.com/q/53034231/
    //
    hostname: "bs-local.com",
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeHeadless", "FirefoxHeadless"],
    browserStack: {
      project: "bootprompt",
    },
    customLaunchers,
    captureTimeout: 60000,
    concurrency: 3,
    coverageIstanbulReporter: {
      // If we are running in Travis the HTML results are not useful, but
      // we want to provide coverage information for Coveralls.
      reports: CONTINUOUS_INTEGRATION ? ["lcovonly"] : ["html"],
      dir: path.join(__dirname, "coverage"),
    },
  };

  let localConfig = {
    browserStack: {},
  };

  if (CONTINUOUS_INTEGRATION) {
    // Running on Travis. The user id and key are taken from the environment.
    localConfig.browserStack.startTunnel = true;
  }
  else {
    // Running outside Travis: we get our configuration from ./local-config, if
    // it exists.
    try {
      // eslint-disable-next-line global-require
      localConfig = require("./localConfig");
    }
    catch (ex) {} // eslint-disable-line no-empty
  }

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
