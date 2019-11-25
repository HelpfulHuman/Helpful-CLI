import glob from "glob";
import fs from "fs-extra";
import { eachLimit, waterfall, map, filter } from "async";
import { uniqBy, flatten } from "lodash";
import * as status from "../utils/status";
import path from "path";
import processText from "../utils/processText";
import checkWhen from "../utils/checkWhen";

const assign = Object.assign;

/**
 * Compile a list of copy operations based on the given paths (and options)
 * and then execute them in a limited parallel operation.
 *
 * @param  {Object} ctx
 * @param  {Callback<Error>} next
 */
export default function (ctx, next) {
  status.report("Performing file copy operations");
  // get the file ops to copy from the manifest
  var fileOps = ctx.manifest.copy || [];

  waterfall([
    // map over each file operation and find the files
    (next) => map(fileOps, findFiles.bind(null, ctx), next),
    // flatten our found files and remove duplicates
    (ops, next) => next(null, uniqBy(flatten(ops), "file")),
    // generate the destination path for each file
    (ops, next) => next(null, ops.map(addDestinationPath.bind(null, ctx))),
    // remove files that shouldn't be copied or processed further
    (ops, next) => filter(ops, validateOperation.bind(null, ctx), next),
    // run each file op through processFile() at a limited rate
    (ops, next) => eachLimit(ops, 15, processFile.bind(null, ctx), next)
  ], function (err) {
    if (err) status.fail();
    else status.complete();
    next(err);
  });
}

/**
 * Finds the files that match each file op path and creates a new file
 * op record for each one with the absolute filepath.
 *
 * @param  {Object} ctx
 * @param  {Object} fileOp
 * @param  {Callback<Error, Array>} next
 */
function findFiles (ctx, fileOp, next) {
  glob(fileOp.path, {
    cwd: ctx.paths.template,
    ignore: fileOp.exclude
  }, function (err, files) {
    if (err) return next(err);
    next(null, files.map(file => assign({}, fileOp, { file })));
  });
}

/**
 * Takes the context for the command and determines what the destination
 * path for each file operation should be.
 *
 * @param  {Object} ctx
 * @param  {Object[]} op
 * @param  {Callback<Error, Array>} next
 */
function addDestinationPath (ctx, op, next) {
  // extract out the file info from the template
  var file = path.parse(op.file);

  // crate a new dest string with replacements
  var dest = path.join(
    ctx.paths.target,
    (op.renameDir || file.dir),
    (op.renameFile || file.base)
  );

  // return the update object
  return Object.assign(op, { dest });
}

/**
 * Filter out the file op if it won't be able to be written for any reason.
 *
 * @param  {Object} op
 * @param  {Callback<Error, Array>} next
 */
function validateOperation (ctx, op, next) {
  // check the when value
  if ( ! checkWhen(ctx, op.when)) {
    return next();
  }

  // see if the file exists
  fs.exists(op.dest, function (exists) {
    next(null, ( ! exists || op.overwrite));
  });
}

/**
 * Process the file operation configuration using the file path we found
 * with glob.
 *
 * @param  {Object} context
 * @param  {Object} op
 * @param  {Callback<Error>} next
 */
function processFile (ctx, op, next) {
  waterfall([
    // read the file
    (next) => {
      var file = path.join(ctx.paths.template, op.file);
      fs.readFile(file, "utf8", next);
    },
    // parse the contents of the file using user input
    (contents, next) => next(null, processText(ctx, contents)),
    // write the contents into the desired file location
    (contents, next) => fs.outputFile(op.dest, contents, next)
  ], next);
}
