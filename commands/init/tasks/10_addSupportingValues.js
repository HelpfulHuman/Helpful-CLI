const _ = require('lodash');
const path = require('path');

module.exports = function (input, done) {
  Object.assign(input, {
    projectNamePascal: _.startCase(input.projectName).replace('-', ''),
    projectNameClean: _.startCase(input.projectName).replace('-', ' '),
    currentYear: (new Date()).getYear(),
    dest: path.join(process.cwd(), input.projectName)
  });
  done();
}