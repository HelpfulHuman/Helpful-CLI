const path = require('path');
const async = require('async');
const glob = require('glob');
const chalk = require('chalk');

const tasks = glob
  .sync('./tasks/*', { cwd: __dirname })
  .sort()
  .map(require);

module.exports = function (input) {
  console.log(chalk.bgBlue('\n\nPreparing your project!  This might take a minute...\n\n'));
  async.eachSeries(tasks, function (task, next) {
    task(input, next);
  }, function (err) {
    if (err) console.error(chalk.red(err));
    else console.log(chalk.green.bold('\n\nAll done.  Build something epic.'));
  });
}