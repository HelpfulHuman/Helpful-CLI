import request from "request";
import { someSeries } from "async";

/**
 * Regular expressions
 */
const GITHUB_URL = /^(?:https?\:\/\/)?(?:www\.)?(?:github\.com\/)?([\w\-]+\/[\w\-]+)/;

/**
 * Validate the given sourcePath property and attempt to
 * locate a repository with a helpful.json manifest file.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  process.stdout.write("\n\n  Ok, let's see if we can find this template... ");
  someSeries([
    isGithub
  ], function (test, next) {
    test(ctx.source.path, function (err, url) {
      if (url) ctx.source.url = url;
      next(err, !!url);
    });
  }, function (err, result) {
    if ( ! err && result) {
      process.stdout.write("Looks good!\n");
    } else if ( ! err && ! result) {
      err = new Error("The given template path could not be resolved.");
    }
    if (err) {
      process.stdout.write("Nope.\n");
    }
    next(err);
  });
}

/**
 * Checks to see if the given source references a GitHub hosted
 * repository.
 *
 * @param  {String} source
 * @param  {Callback<E, R>} next
 */
function isGithub (source, next) {
  if ( ! GITHUB_URL.test(source)) next();
  else {
    var url = source.replace(GITHUB_URL, "https://github.com/$1");
    request(url, function (err, { statusCode }) {
      var valid = ( ! err && statusCode >= 200 && statusCode <= 299);
      next(err, (valid ? url + "/archive/master.zip" : null));
    });
  }
}