module.exports = function(params) {

  'use strict';

  console.log('Vendor files: ' + params.vendor.join(', '));

  return function(config) {

    const coverage = !config.debug ? ["coverage"] : [];
    return config.set({
      basePath: '',
      frameworks: ['mocha', 'chai'],
      files: Array.prototype.concat([
        'node_modules/sinon/pkg/sinon.js',
        'node_modules/sinon-chai/lib/sinon-chai.js'],

        params.vendor,

        params.src || 'bootprompt.js',

        ['tests/**/*.test.js']
      ),
      exclude: [],
      preprocessors: {
        'src/bootprompt.js': coverage,
      },
      reporters: ['dots', 'coverage', 'junit'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadless'],
      captureTimeout: 60000,
      coverageReporter: {
        type: 'html',
        dir: 'tests/coverage'
      },
      junitReporter: {
        outputDir: 'tests/reports'
      }
    });

  };

};
