import fs from "fs-extra";
import * as status from "../utils/status";

/**
 * Manually remove the temp files, just to be safe.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  var temp = ctx.paths.temp;
  if ( ! temp || ! fs.existsSync(temp)) return next();
  status.report("Cleaning up temporary files");
  fs.remove(temp, function (err) {
    if (err) status.fail();
    else status.complete();
    next(err);
  });
}