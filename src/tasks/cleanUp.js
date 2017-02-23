import fs from "fs-extra";
import * as status from "../utils/status";

/**
 * Manually remove the temp files, just to be safe.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  if ( ! ctx.paths.temp) return next();
  status.report("Cleaning up temporary files");
  fs.remove(ctx.paths.temp, function (err) {
    if (err) status.fail();
    else status.complete();
    next(err);
  });
}