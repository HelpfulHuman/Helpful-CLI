import glob from "glob";
import path from "path";
import yaml from "yamljs";
import * as status from "../utils/status";

/**
 * Finds where the manifest file actually exists and loads it into
 * our context.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  status.report("Searching for the manifest file");
  var tempDir = ctx.paths.temp;
  var manifestName = ctx.manifestName;
  var pattern = `**/${manifestName}.{js,json,yml,yaml}`;
  glob(pattern, { cwd: tempDir }, function (err, files) {
    try {
      if (err) throw err;
      if (files.length === 0) {
        throw new Error("A valid manifest file could be not found.  Are you sure this is a Helpful CLI compliant template?");
      }

      var manifestPath = path.join(tempDir, files[0]);
      ctx.paths.template = path.resolve(path.dirname(manifestPath));
      if (path.extname(manifestPath).indexOf(".y") === 0) {
        ctx.manifest = yaml.load(manifestPath);
      } else {
        ctx.manifest = require(manifestPath);
      }
    } catch (e) {
      status.fail();
      return next(e);
    }

    status.complete();
    next();
  });
}