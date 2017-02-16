import os from "os";
import path from "path";
import shortid from "shortid";
import fs from "fs-extra";
import request from "request";

/**
 * Attempt to download and unpack (if necessary) the contents
 * of the remote template repository into a temporary file
 * on the local machine.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  // get the extension for the file being downloaded
  var ext = path.extname(ctx.source.url);

  // create the temporary directory path
  // TODO use os.tmpdir() instead
  var tempDir = path.join("TEMP", shortid.generate());

  // create the destination file
  var dest = path.join(tempDir, "source" + ext);

  // create the file and start downloading the zip contents from the URL
  fs.createFile(dest, function (err) {
    if (err) return next(err);
    ctx.source.temp = dest;

    // create the stream into the destination folder
    var stream = request
      .get(ctx.source.url)
      .pipe(fs.createWriteStream(dest));

    // handle errors
    stream.on("error", next);

    // take care of any finishing tasks
    stream.on("finish", () => next());
  });
}