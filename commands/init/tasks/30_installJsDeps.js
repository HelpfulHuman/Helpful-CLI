const sh = require('shelljs');

const FAIL_MSG = 'An error occurred while trying to install NPM dependencies.  You may need to run this command manually.';

module.exports = function (input, done) {
  if ( ! input.tags.javascript) return done();

  const installDepsCmd = 'npm i -S ' + input.deps.js.join(' ');
  const installDevCmd = 'npm i -D ' + input.deps.jsDev.join(' ');

  sh.cd(input.dest);
  sh.exec(installDepsCmd, function (code) {
    if (code !== 0) console.warn(FAIL_MSG);
    sh.exec(installDevCmd, function (code) {
      if (code !== 0) console.warn(FAIL_MSG);
      done();
    });
  });
}