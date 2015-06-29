gulp       = require 'gulp'
browserify = require 'browserify'
babelify   = require 'babelify'
source     = require 'vinyl-source-stream'

gulp.task 'browserify', ()->
  browserify entries: [ './src/Taiyaki.es6' ], extensions: [ 'es6' ]
  .transform babelify
  .bundle()
  .pipe source 'taiyaki.js'
  .pipe gulp.dest './build/Release/'

gulp.task 'watch', ()->
  gulp.watch 'src/**/*.es6', ['browserify']

gulp.task 'default', [ 'browserify', 'watch' ]
