import glob from "glob";
import fs from "fs-extra";
import { eachLimit, waterfall, map, filter } from "async";
import { uniqBy, flatten } from "lodash";
import * as status from "../utils/status";
import path from "path";
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
 * @param  {Object[]} ops
 * @param  {Callback<Error, Array>} next
 */
function addDestinationPath (ctx, ops, next) {
  var { template } = ctx.paths;

  // extract out the file info from the template
  var file = path.parse(ops.file.substr(template.length));

  // crate a new dest string with replacements
  var dest = path.join(
    template,
    (ops.renameDir || file.dir),
    (ops.renameFile || file.base)
  );

  // return the update object
  return Object.assign(ops, { dest });
}

/**
 * Filter out the file op if it won't be able to be written for any reason.
 *
 * @param  {Object} op
 * @param  {Callback<Error, Array>} next
 */
function validateOperation (ctx, op, next) {
  // check op info against user input

  fs.exists(op.dest, function (exists) {
    next(null, (!exists || op.overwrite));
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
    (next) => fs.readFile(op.file, "utf8", next),
    // parse the contents of the file using user input
    (contents, next) => processText(ctx, contents),
    // write the contents into the desired file location
    (contents, next) => fs.writeFile(op.dest, contents, next)
  ], next);
}
