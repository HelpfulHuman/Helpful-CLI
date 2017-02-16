import url from "url";
import http from "http";
import { someSeries } from "async";

/**
 * Validate the given sourcePath property and attempt to
 * locate a repository with a helpful.json manifest file.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  process.stdout.write("\n\n\tOk, let's see if we can find this template... ");
  someSeries([
    isGithub
  ], function (test, next) {
    test(ctx.source.path, next);
  }, function (err, result) {
    if ( ! err && result) {
      Object.assign(ctx.source, result);
      process.stdout.write("Looks good!");
    } else if ( ! err && ! result) {
      err = new Error("The given template path could not be resolved.");
    }
    if (err) {
      process.stdout.write("Nope.");
    }
    next(err);
  });
}

/**
 * Provides a callback with a true or false response depending on if the
 * given URL has a valid 200-series response.
 *
 * @param  {String} testUrl
 * @param  {Callback<Boolean>} cb
 */
function checkUrl (testUrl, cb) {
  var req = http.request({
    method: 'HEAD',
    host: url.parse(testUrl).host,
    port: 80,
    path: url.parse(testUrl).pathname
  }, function (res) {
    cb(res.statusCode >= 200 && res.statusCode <= 299);
  });
}

/**
 * Takes a RegEx value and creates a URL using the given replacement
 * string value.
 *
 * @param  {RegExp} pattern
 * @param  {String} replacement
 * @return {Function}
 */
function testAndCreateUrl (pattern, replacement) {
  return function (source, next) {
    if ( ! pattern.test(source)) next();
    else {
      var url = source.replace(pattern, replacement);
      checkUrl(url, function (valid) {
        var out;
        if (valid) out = { url, type: "github" };
        next(null, out);
      });
    }
  };
}

/**
 * Checks to see if the given source references a GitHub hosted
 * repository.
 *
 * @param  {String} source
 * @param  {Callback<E, R>} next
 */
const isGithub = testAndCreateUrl(
  /^(?:https?\:\/\/)?(?:www\.)?(?:github\.com\/)?([\w\-]+\/[\w\-]+)/,
  "https://github.com/$1"
);