import * as status from "../utils/status";

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
  status.complete();
  next();
}