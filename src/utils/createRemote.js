import request from "request";

/**
 * Returns a new function that will compare the given source path
 * against a pattern.  If the pattern matches, the "check url" will be
 * hit as a second form of remote validation before a download is
 * attempted.
 *
 * @param  {RegExp} pattern
 * @param  {String} checkUrl
 * @param  {String} downloadUrl
 * @param  {Function} downloader
 * @return {Function}
 */
export default function (pattern, checkUrl, downloadUrl, downloader) {
  return function (source, dest, done) {
    if ( ! pattern.test(source)) done();
    else {
      var check = source.replace(pattern, checkUrl);
      request(check, function (err, { statusCode }) {
        var valid = ( ! err && statusCode >= 200 && statusCode <= 299);
        if ( ! valid) return done(err);
        var download = source.replace(pattern, downloadUrl);
        downloader(download, dest, (err) => done(err, !err));
      });
    }
  };
}