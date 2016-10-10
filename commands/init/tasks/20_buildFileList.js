const _ = require('lodash');
const async = require('async');
const glob = require('glob');
const path = require('path');
const templates = path.resolve(__dirname + '/../template');
const utils = require('../utils');

function renameDotFile (file) {
  var fpath = file.split('/');
  var fname = fpath.pop();
  if (fname[0] !== '_') return file;
  return fpath.concat('.' + fname.slice(1)).join('/');
}

function baseFiles (input, done) {
  done(null, utils
    .getTruthyKeys({
      'README.md': true,
      _gitignore: true,
      _env: utils.has(input.deps.jsDev, 'dotenv', true),
      '_env.example': utils.has(input.deps.jsDev, 'dotenv', true),
      'public/_gitignore': (input.tags.frontend && input.projectType !== 'lib'),
      'public/images/_gitkeep': (input.tags.frontend && input.projectType !== 'lib'),
      'public/index.html': (input.projectType !== 'lib' && input.tags.frontend && !input.templating),
      'test/mocha.opts': input.tags.javascript,
      'bs.config.js': utils.has(input.deps.jsDev, 'browser-sync'),
      'rollup.config.js': utils.has(input.deps.jsDev, 'rollup', true),
      Procfile: (input.targetEnv === 'foreman'),
      Dockerfile: (input.targetEnv === 'docker'),
      LICENSE: (input.projectType === 'lib')
    })
    .map(function (file) {
      return {
        src: path.join(templates, 'base', file),
        dest: path.join(input.dest, renameDotFile(file))
      };
    })
  );
}

function getTemplates (input) {
  return utils.getTruthyKeys({
    react: (input.frontend === 'react'),
    site: (input.projectType === 'site'),
    'server-node': (input.backend === 'node'),
    'server-express': (input.backend === 'express'),
    'lib-frontend': (input.projectType === 'lib' && input.tags.frontend),
    'lib-node': (input.projectType === 'lib' && input.tags.node),
  });
}

function getAllFiles (dir, input) {
  return function (done) {
    const src = path.join(templates, dir);
    glob('**/*', { cwd: src }, function (err, files) {
      if (err) return done(err);
      done(null, files.map(function (file) {
        return {
          src: path.join(src, file),
          dest: path.join(input.dest, renameDotFile(file))
        };
      }));
    });
  }
}

module.exports = function (input, done) {
  const loaders = [].concat(
    baseFiles.bind(null, input),
    getTemplates(input).map(function (template) {
      return getAllFiles(template, input);
    })
  );

  async.parallel(loaders, function (err, files) {
    if (err) done(err);
    input.files = _.flatten(files);
    done();
  });
}