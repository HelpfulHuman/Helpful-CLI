const fs = require('fs-extra');
const async = require('async');

module.exports = function (input, done) {
  async.filter(input.files, function (file, next) {
    const isDir = fs.lstatSync(file.src).isDirectory();
    next(null, !isDir);
  }, function (err, files) {
    if (err) return done(err);
    input.files = files;
    done();
  });
}