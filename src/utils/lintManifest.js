import createLogger from "./createLogger";
import isGlob from "is-glob";

/**
 * Lints a manifest and reports fatal errors, warnings and
 * suggestions based on the rules defined here.  Enable "strict mode"
 * by passing `true` in as the second value.
 *
 * @param  {Object} manifest
 * @param  {Boolean} strictMode
 * @return {Object}
 */
export default function (manifest, strictMode = false) {
  // create a logger
  var logger = createLogger(strictMode);

  // check if we meet the minimum requirements
  if (minRequirements(logger, manifest)) {
    manifest.ask = checkAsk(logger, manifest.ask);
    manifest.copy = checkCopy(logger, manifest.copy);
    manifest.run = checkRun(logger, manifest.run);
  }

  // return our logger
  return logger;
}

/**
 * Checks if the manifest meets the minimum requirements.
 *
 * @param  {Object} log
 * @param  {Object} manifest
 * @return {Boolean}
 */
function minRequirements (log, manifest) {
  if (
    ! manifest ||
    typeof manifest !== "object" ||
    Array.isArray(manifest) ||
    ( ! manifest.ask && ! manifest.copy && ! manifest.run)
  ) {
    log.fail("Your manifest file must be an key/value object with at least ask, copy, or run specified");
    return false;
  } else {
    return true;
  }
}

/**
 * Handles validation for the ask step.
 *
 * @param  {Object} log
 * @param  {Array} list
 * @return {Array}
 */
function checkAsk (log, list) {
  if ( ! list) return [];

  if ( ! Array.isArray(list)) {
    log.fail("The `ask` property must be an array of question objects");
    return [];
  }

  return list.map(processSingleQuestion.bind(null, log));
}

/**
 * Lint and default out a single question.
 *
 * @param  {Object} log
 * @param  {Object} item
 * @return {Object}
 */
function processSingleQuestion (log, item, i) {
  if ( ! item || typeof item !== "object" || Array.isArray(item)) {
    log.fail(`ask.${i}: Questions must be a key/value object that is compliant with inquirer.js`);
    return null;
  }

  return item;
}

/**
 * Handles validation for the copy step.
 *
 * @param  {Object} log
 * @param  {Array} list
 * @return {Array}
 */
function checkCopy (log, list) {
  if ( ! list) return [];

  if ( ! Array.isArray(list)) {
    log.fail("The `copy` property must be an array of file operation objects");
    return [];
  }

  return list.map(processSingleFileOp.bind(null, log));
}

/**
 * Lint and default out a single file operation.
 *
 * @param  {Object} log
 * @param  {Object} item
 * @return {Object}
 */
function processSingleFileOp (log, item, i) {
  if (typeof item === "string") item = { path: item };

  if ( ! item || typeof item !== "object" || Array.isArray(item)) {
    log.fail(`copy.${i}: File operations must be a key/value object that contain at least a \`path\` string`);
    return null;
  }

  if (typeof item.path !== "string") {
    log.fail(`ask.${i}.path: File operation paths must be a string`);
    return null;
  }

  // TODO overwrite should be warned against for certain files
  // TODO renameFile must be a string if set

  if (item.renameFile && isGlob(item.path)) {
    log.warn(`ask.${i}: You should not use the \`renameFile\` option with globs`);
  }

  // TODO renameDir must be a string if set

  return item;
}

/**
 * Handles validation for the run step.
 *
 * @param  {Object} log
 * @param  {Array} list
 * @return {Array}
 */
function checkRun (log, list) {
  if ( ! list) return [];

  if ( ! Array.isArray(list)) {
    log.fail("The `run` property must be an array of command objects");
    return [];
  }

  return list.map(processSingleCommand.bind(null, log));
}

/**
 * Lint and default out a single command.
 *
 * @param  {Object} log
 * @param  {Object} item
 * @return {Object}
 */
function processSingleCommand (log, item) {
  if (typeof item === "string") item = { path: item };

  if ( ! item || typeof item !== "object" || Array.isArray(item)) {
    log.fail("Commands must be a key/value object");
    return null;
  }

  return item;
}