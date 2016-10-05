exports.getTruthyKeys = function (obj) {
  return Object.keys(obj).filter(function (key) {
    return !!obj[key];
  });
}