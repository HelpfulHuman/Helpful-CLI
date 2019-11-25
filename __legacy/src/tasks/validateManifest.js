import * as status from "../utils/status";
import lintManifest from "../utils/lintManifest";

/**
 * Load, validate and parse the helpful.json manifest
 * file that we downloaded from the remote template
 * repository.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  status.report("Validating manifest file");

  try {
    lintManifest(ctx.lintManifest);
  } catch (err) {
    status.fail();
    return next(err);
  }

  status.complete();
  next();
}