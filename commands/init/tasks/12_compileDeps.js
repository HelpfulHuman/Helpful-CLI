const _ = require('lodash');

module.exports = function (input, done) {
  var jsDeps = [], jsDev = [];

  if (Array.isArray(input.jsDeps)) {
    jsDeps = jsDeps.concat(input.jsDeps);
  }

  if (input.projectType === 'site' && !input.backend) {
    jsDeps.push('http-server');
  }

  if (input.tags.javascript) {
    jsDeps.push('dotenv');
    jsDev.push('mocha', 'chai', 'sinon', 'sinon-chai');
    if (input.tags.frontend) {
      jsDev.push('rollup@~0.34.0', 'chalk', 'chokidar', 'rollup-plugin-json', 'rollup-plugin-node-resolve', 'rollup-plugin-commonjs', 'rollup-plugin-buble', 'rollup-plugin-replace', 'buble', 'reify');
    }
    if (input.projectType !== 'lib') {
      if (input.tags.frontend) {
        jsDev.push('browser-sync@~2.16.0');
      }
    }
  }

  if (input.tags.css) {
    jsDev.push('stylus', 'autoprefixer-stylus', 'helpful-ui');
  }

  if (input.frontend === 'react') {
    jsDeps.push('react', 'react-router', 'react-dom', 'redux', 'react-redux', 'react-router-redux', 'redux-thunk', 'redux-logger', 'portals');
  }

  if (input.backend === 'express') {
    jsDeps.push('express', 'body-parser', 'cors', 'morgan');
    jsDev.push('nodemon', 'hippie');
  }

  input.deps = {
    js: _.uniq(jsDeps),
    jsDev: _.uniq(jsDev)
  };

  done();
}
