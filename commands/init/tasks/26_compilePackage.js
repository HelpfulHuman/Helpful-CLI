const fs = require('fs-extra');
const path = require('path');
const utils = require('../utils');

module.exports = function (input, done) {
  var pkg = {
    name: input.projectName,
    version: '1.0.0',
    description: input.projectSummary,
    tags: [],
    engines: { node: '>=4.0' },
    scripts: {
      start: [],
      'dev:start': [],
      build: [],
      postinstall: [],
      test: 'mocha',
      tdd: 'npm run test -- --watch'
    },
    license: (input.projectType === 'lib' ? 'MIT' : 'ISC')
  };

  if (utils.has(input.deps.js, 'http-server', true)) {
    pkg.scripts['start'].push('http-server');
  }

  if (utils.has(input.deps.jsDev, 'stylus', true)) {
      pkg.scripts['dev:start'].push('npm run watch:styles');
      pkg.scripts['build'].push('npm run build:styles');
      pkg.scripts['build:styles'] = 'stylus ' + (input.projectType === 'app' ? 'client' : 'src') + '/index.styl --use ./node_modules/helpful-ui --use ./node_modules/autoprefixer-stylus --out public/' + input.projectType + '.css';
      pkg.scripts['watch:styles'] = 'npm run build:styles -- --watch --sourcemap';
  }

  if (utils.has(input.deps.jsDev, 'rollup', true)) {
    pkg.scripts['dev:start'].push('npm run watch:scripts');
    pkg.scripts['build'].push('npm run build:scripts');
    pkg.scripts['build:scripts'] = 'rollup --config';
    pkg.scripts['watch:scripts'] = 'node bin/watch_scripts.js';
  }

  if (input.projectType === 'lib' && input.tags.frontend) {
    pkg['main'] = 'dist/' + input.projectName + '.cjs.js';
    pkg['jsnext:main'] = 'dist/' + input.projectName + '.es.js';
  }

  if (input.projectType === 'lib' && input.tags.node) {
    pkg['main'] = 'lib/index.js';
  }

  if (input.tags.server) {
    pkg.scripts['start'].push('node server/index.js');
    pkg.scripts['dev:start'].push('nodemon server/index.js');
  }

  if (utils.has(input.deps.jsDev, 'browser-sync')) {
    pkg.scripts['dev:start'].push('npm run reload');
    pkg.scripts['reload'] = 'browser-sync start --config bs.config.js';
  }

  if (pkg.scripts.build.length > 0) {
      pkg.scripts.postinstall.push('npm run build');
  }

  Object.keys(pkg.scripts).forEach(function (script) {
    const val = pkg.scripts[script];
    if (val.length === 0) delete pkg.scripts[script];
    else if (Array.isArray(val)) pkg.scripts[script] = val.join(' | ');
  });

  fs.outputJson(path.join(input.dest, 'package.json'), pkg, { spaces: 2 }, done);
}