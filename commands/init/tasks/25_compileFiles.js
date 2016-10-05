const fs = require('fs-extra');
const async = require('async');
const nunjucks = require('nunjucks');

function createFileProcessor (input) {
  return function (file, done) {
    fs.readFile(file.src, 'utf8', function (err, contents) {
      if (err) return done(err);
      contents = (contents ? nunjucks.renderString(contents, input) : '');
      fs.outputFile(file.dest, contents, done);
    });
  }
}

module.exports = function (input, done) {
  // console.log('Compiling files...');
  async.each(input.files, createFileProcessor(input), done);
}