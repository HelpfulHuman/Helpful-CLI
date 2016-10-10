const minimatch = require('minimatch');

exports.getTruthyKeys = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return !!obj[key];
  });
}

exports.has = function (list, tag, strict) {
  for (var i = 0; i < list.length; i++) {
    if (( ! strict && list[i].includes(tag)) || (strict && minimatch(list[i], tag))) {
      return true;
    }
  }
  return false;
}