const sh = require('shelljs');

module.exports = function (input, done) {
  if (sh.which('git')) {
    sh.cd(input.dest);
    sh.exec('git init');
    sh.exec('git add .');
    sh.exec('git commit -am "Project Set Up"');
  }
  done();
}