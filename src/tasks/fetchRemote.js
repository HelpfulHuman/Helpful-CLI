import shortid from "shortid";
import { someSeries } from "async";
import path from "path";

import github from "../remotes/github";

/**
 * Remotes
 */
const REMOTES = [
  github
];

/**
 * Work through configured remotes and attempts to download
 * and unpack the files into a generated temp folder on resolution.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  process.stdout.write("\n\n  Ok, let's see if we can find this template... ");

  // create the temporary directory path
  // TODO use os.tmpdir() instead
  var tempPath = ctx.paths.temp = path.join("TEMP", shortid.generate());

  someSeries(REMOTES, function (remote, next) {
    remote(ctx.paths.source, tempPath, next);
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