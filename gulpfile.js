// const fs = require('fs')
const babel = require('gulp-babel')
const gulp = require('gulp')
const gPlugins = require('gulp-load-plugins')() // 加载全部gulp插件
const gutil = require('gulp-util')
const uglify = require('gulp-uglify-es').default

gulp.task('default', (cb) => {
  gPlugins.runSequence('build', 'chrome', cb)
})

gulp.task('watch', ['build'], () => {
  gulp.watch(['./src/**/*', './package.json'], ['default'])
})

gulp.task('build', (cb) => {
  gPlugins.runSequence('cleanBuild', 'css', 'asset', 'ext', 'js', 'lib', cb)
})

gulp.task('dist', (cb) => {
  gPlugins.runSequence('cleanDist', 'chrome', cb)
})

gulp.task('clean', (cb) => {
  gPlugins.runSequence('cleanDist', 'cleanBuild', cb)
})

// clean
gulp.task('cleanBuild', () => {
  return pipe('./temp', gPlugins.clean())
})
gulp.task('cleanDist', () => {
  return pipe('./dist', gPlugins.clean())
})

// css
gulp.task('css', () => {
  return pipe(
    './src/css/custom.less',
    gPlugins.plumber(),
    gPlugins.less({ relativeUrls: true }),
    gPlugins.autoprefixer({ cascade: true }),
    './temp/css'
  )
})

// asset
gulp.task('asset', () => {
  return pipe('./src/asset/**/*', 'temp/')
})

// ext
gulp.task('ext', () => {
  return pipe('./src/ext/*', 'temp/')
})

// js
gulp.task('coreJs', () => {
  const src = [
    './src/js/index.js',
    './src/js/template.js',
    './src/js/observer.js',
    './src/js/util.js'
  ]
  return pipe(
    src,
    babel(),
    gPlugins.preprocess(),
    gPlugins.concat('notionx.js'),
    './temp'
  )
})
gulp.task('js', ['coreJs'], () => {
  const src = [
    './src/lib/jquery.js',
    './src/lib/jquery-ui.js',
    './src/lib/lodash.min.js',
    './temp/notionx.js'
  ]
  return pipe(
    src,
    babel(),
    gPlugins.wrap('(function(){\n<%= contents %>\n})();'),
    gPlugins.concat('content-script.js'),
    gutil.env.production && uglify(),
    './temp'
  )
})

// lib
gulp.task('lib', () => {
  return pipe('./src/lib/*', 'temp/lib/')
})

// chrome
gulp.task('chrome', () => {
  return pipe('./temp/**/*', gPlugins.zip('chrome.zip'), './dist')
})
// var crx = require('gulp-crx-pack');
// var manifest = require('./src/ext/manifest.json');

// gulp.task('crx', function() {
//   return gulp.src('./extension-src')
//     .pipe(crx({
//       privateKey: fs.readFileSync('./certs/key', 'utf8'),
//       filename: manifest.name + '.crx'
//     }))
//     .pipe(gulp.dest('./dist'));
// });

// util
function pipe (src, ...transforms) {
  const work = transforms
    .filter((t) => !!t)
    .reduce((stream, transform) => {
      const isDest = typeof transform === 'string'
      return stream
        .pipe(isDest ? gulp.dest(transform) : transform)
        .on('error', (err) => {
          gutil.log(gutil.colors.red('[Error]'), err.toString())
        })
    }, gulp.src(src))

  return work
}
