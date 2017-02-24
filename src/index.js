import { applyEachSeries } from "async";
import createContext from "./tasks/createContext";
import fetchRemote from "./tasks/fetchRemote";
import loadManifest from "./tasks/loadManifest";
import validateManifest from "./tasks/validateManifest";
import askQuestions from "./tasks/askQuestions";
import copyFiles from "./tasks/copyFiles";
import runCommands from "./tasks/runCommands";
import cleanUp from "./tasks/cleanUp";
import end from "./tasks/endingNotification";

// Give our commands some breathing room!
process.stdout.write("\n\n");

/**
 * The operational tasks that occur (in order).
 */
const tasks = [
  fetchRemote,
  loadManifest,
  validateManifest,
  askQuestions,
  copyFiles,
  runCommands,
];

/**
 * Start the scaffolding process using a path that either
 * exists locally or at a remote URL.
 *
 * @param  {String} sourcePath
 * @param  {String} targetPath
 */
export function install (sourcePath, targetPath) {
  var ctx = createContext(sourcePath, targetPath);
  applyEachSeries(tasks, ctx, function (err1) {
    cleanUp(ctx, (err2) => end(err1 || err2, ctx));
  });
}

/**
 * Expose manifest validation as a standalone task.
 *
 * @param  {String} manifestPath
 */
export function validate (manifestPath) {
}

/**
 * Start a wizard to create a new manifest file for the specified path.
 *
 * @param  {String} manifestPath
 */
export function templatize (manifestPath) {
}