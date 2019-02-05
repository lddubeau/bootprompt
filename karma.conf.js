var baseConfig = require('./karma-base.conf');

module.exports = baseConfig({
  vendor: [
    'tests/vendor/jquery-3.3.1.slim.js',
    'tests/vendor/bootstrap-4.2.1.bundle.js'
  ],
  src: ['src/bootprompt.js', 'src/bootprompt.locales.js']
});
