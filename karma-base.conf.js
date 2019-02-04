module.exports = function(params) {

  'use strict';

  console.log('Vendor files: ' + params.vendor.join(', '));

  return function(config) {

    return config.set({
      basePath: '',
      frameworks: ['mocha', 'chai'],
      files: Array.prototype.concat([
        'node_modules/sinon/pkg/sinon.js',
        'node_modules/sinon-chai/lib/sinon-chai.js'],

        params.vendor,

        params.src || 'bootshine.js',

        ['tests/**/*.test.js']
      ),
      exclude: [],
      preprocessors: {
        'src/bootshine.js': ['coverage']
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
