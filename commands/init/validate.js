exports.name = function (input) {
  if (/^[a-z][a-z0-9\-\.]+$/.test(input)) return true;
  return 'Valid names must start with a letter and can only contain alphanumeric characters, hyphens or periods.'
}