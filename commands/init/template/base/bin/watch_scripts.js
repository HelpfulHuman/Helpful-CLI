const rollup = require('rollup');
const config = require('../rollup.config');
const fs = require('fs');
const chalk = require('chalk');
const chokidar = require('chokidar');


const watcher = chokidar.watch('./src/**/*.js', { persistent: true });

var inProgress = true;
var cache;

watcher.on('ready', function () {
  inProgress = false;
  process.stdout.write('Rollup: Watching for changes.');
  build(); // initial build
});

watcher.on('all', function () {
  if (inProgress) return;
  build();
});

function build () {
  process.stdout.write('\nRollup: Build triggered, please wait...\n\n');

  inProgress = true;

  rollup.rollup({
    entry: config.entry,
    moduleName: config.moduleName,
    sourceMap: config.sourceMap,
    cache: cache,
    plugins: config.plugins,
    treeshake: false
  }).then(function (bundle) {
    cache = bundle;
    return bundle.write({
      format: config.format,
      dest: config.dest
    });
  }).then(function () {
    inProgress = false;
    process.stdout.write('\n' + chalk.bgGreen('Rollup: Build Completed.') + '\n\n');
  })
  .catch(function (err) {
    inProgress = false;
    // console.error(err);
    process.stderr.write( removeNpmErr(err.message) );
    process.stdout.write('\n' + chalk.bgRed('Rollup: Build Error!') + '\n\n');
  });
}

const isNpmErr = /^npm /i;

function removeNpmErr (str) {
  var lines = str.split(/\r\n|\r|\n/g);
  for (var i = 0; i < lines.length; i++) {
    if (isNpmErr.test(lines[i])) {
      lines = lines.slice(0, i);
      break;
    }
  }
  return lines.join('\r\n');
}