let browsers
if (process.env.TRAVIS) {
  browsers = ['Chrome_travis_ci']
} else {
  browsers = ['Chrome']
}

module.exports = function(config) {
  config.set({
    browserify: {
      debug: true,
      transform: [
        [
          'babelify',
          {
            presets: ['es2015', 'flow'],
            plugins: ['istanbul', 'transform-class-properties']
          }
        ]
      ]
    },
    browsers,
    coverageReporter: { type: 'lcov' },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    frameworks: ['browserify', 'jasmine'],
    files: ['tests/**/*.js'],
    preprocessors: {
      'tests/**/*.js': 'browserify'
    },
    reporters: ['progress', 'coverage']
  })
}
